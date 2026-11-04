-- =====================================================================
-- Projeto Maya — Supabase Schema
--
-- ⚠️  DESATUALIZADO. NÃO É A FONTE DA VERDADE.
--
-- Este arquivo é uma cópia antiga da primeira migration e ficou para trás:
-- não tem as tabelas de conteúdo (animais, campanhas, eventos, mensagens...),
-- não tem a coluna doador_id, ainda usa os nomes do Stripe e carrega políticas
-- de RLS que já foram corrigidas.
--
-- O estado real do banco é a soma de supabase/migrations/, em ordem de nome
-- de arquivo. Para montar um banco do zero:
--
--     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run db:migrate
--
-- Mantido só como referência histórica. Rodar isto no editor SQL instala um
-- esquema errado.
-- =====================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. DOADORES (donor profiles)
--    Linked to auth.users via id (uuid)
-- ─────────────────────────────────────────────
create table if not exists public.doadores (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  nome          text not null,
  telefone      text,
  cpf           text,
  total_doado   numeric(10,2) not null default 0,
  contagem_doacoes integer not null default 0,
  primeira_doacao  date,
  nivel         text not null default 'bronze'
                  check (nivel in ('bronze','silver','gold','diamond')),
  animais_ajudados integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger doadores_updated_at
  before update on public.doadores
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- 2. DOACOES (individual donations / payments)
-- ─────────────────────────────────────────────
create table if not exists public.doacoes (
  id                      uuid primary key default gen_random_uuid(),
  doador_email            text not null,
  pagbank_order_id        text not null unique,
  pagbank_subscription_id text,
  valor                   numeric(10,2) not null,
  tipo                    text not null check (tipo in ('single','monthly')),
  status                  text not null default 'pending'
                            check (status in ('completed','pending','failed')),
  campaign_id             text,
  campaign_name           text,
  proximo_pagamento       date,
  created_at              timestamptz not null default now()
);

create index if not exists doacoes_email_idx
  on public.doacoes(doador_email);

create index if not exists doacoes_subscription_idx
  on public.doacoes(pagbank_subscription_id)
  where pagbank_subscription_id is not null;

-- Trigger: recalculate donor totals after each donation insert/update
create or replace function public.recalculate_doador_totals()
returns trigger language plpgsql security definer as $$
begin
  update public.doadores
  set
    total_doado      = coalesce((
      select sum(valor)
      from public.doacoes
      where doador_email = new.doador_email
        and status = 'completed'
    ), 0),
    contagem_doacoes = coalesce((
      select count(*)
      from public.doacoes
      where doador_email = new.doador_email
        and status = 'completed'
    ), 0),
    nivel = case
      when coalesce((select sum(valor) from public.doacoes where doador_email = new.doador_email and status = 'completed'), 0) >= 5000 then 'diamond'
      when coalesce((select sum(valor) from public.doacoes where doador_email = new.doador_email and status = 'completed'), 0) >= 2000 then 'gold'
      when coalesce((select sum(valor) from public.doacoes where doador_email = new.doador_email and status = 'completed'), 0) >= 500  then 'silver'
      else 'bronze'
    end,
    updated_at = now()
  where email = new.doador_email;
  return new;
end;
$$;

create trigger doacoes_recalculate_totals
  after insert or update on public.doacoes
  for each row execute function public.recalculate_doador_totals();

-- ─────────────────────────────────────────────
-- 3. ASSINATURAS (recurring subscriptions)
-- ─────────────────────────────────────────────
create table if not exists public.assinaturas (
  id                      uuid primary key default gen_random_uuid(),
  doador_email            text not null,
  pagbank_subscription_id text not null unique,
  valor                   numeric(10,2) not null,
  status                  text not null default 'active'
                            check (status in ('active','paused','cancelled')),
  proximo_pagamento       date,
  data_inicio             date not null,
  metodo_pagamento        text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger assinaturas_updated_at
  before update on public.assinaturas
  for each row execute function public.set_updated_at();

create index if not exists assinaturas_email_idx
  on public.assinaturas(doador_email);

-- ─────────────────────────────────────────────
-- 4. ADMIN_USERS (admin roles linked to auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Row-Level Security (RLS)
-- ─────────────────────────────────────────────

-- doadores: each donor can only see/edit their own row
alter table public.doadores enable row level security;

create policy "Donors can read own profile"
  on public.doadores for select
  using (auth.uid() = id);

create policy "Donors can update own profile"
  on public.doadores for update
  using (auth.uid() = id);

create policy "Service role has full access to doadores"
  on public.doadores for all
  using (auth.role() = 'service_role');

-- doacoes: donors can read their own donations; service role can do anything
alter table public.doacoes enable row level security;

create policy "Donors can read own donations"
  on public.doacoes for select
  using (
    doador_email = (
      select email from public.doadores where id = auth.uid()
    )
  );

create policy "Service role has full access to doacoes"
  on public.doacoes for all
  using (auth.role() = 'service_role');

-- assinaturas: same pattern as doacoes
alter table public.assinaturas enable row level security;

create policy "Donors can read own subscriptions"
  on public.assinaturas for select
  using (
    doador_email = (
      select email from public.doadores where id = auth.uid()
    )
  );

create policy "Donors can update own subscription status"
  on public.assinaturas for update
  using (
    doador_email = (
      select email from public.doadores where id = auth.uid()
    )
  );

create policy "Service role has full access to assinaturas"
  on public.assinaturas for all
  using (auth.role() = 'service_role');

-- admin_users: admins can read their own row; service role has full access
alter table public.admin_users enable row level security;

create policy "Admins can read own record"
  on public.admin_users for select
  using (auth.uid() = id);

create policy "Service role has full access to admin_users"
  on public.admin_users for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- INITIAL ADMIN ACCOUNTS
-- ─────────────────────────────────────────────
-- Admin accounts must be created in Supabase Auth first:
--   1. Go to Authentication > Users in the Supabase dashboard
--   2. Click "Add user" for each admin:
--      • email: admin@admin.projetomaya.br   password: maya2024
--      • email: projetomaya@admin.projetomaya.br  password: admin123
--   3. Copy the UUID of each user, then run the inserts below,
--      replacing <UUID_admin> and <UUID_projetomaya> accordingly.
--
-- insert into public.admin_users (id, username) values
--   ('<UUID_admin>',       'admin'),
--   ('<UUID_projetomaya>', 'projetomaya');
