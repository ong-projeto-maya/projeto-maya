-- =============================================================================
-- Migration 001 — Foundation schema
-- Tables: doadores, doacoes, assinaturas, admin_users
-- Triggers: set_updated_at, recalculate_doador_totals, doacoes_recalculate_totals
-- RLS policies for all core tables
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. DOADORES (donor profiles — linked to auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.doadores (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null unique,
  nome             text not null,
  telefone         text,
  cpf              text,
  total_doado      numeric(10,2) not null default 0,
  contagem_doacoes integer not null default 0,
  primeira_doacao  date,
  nivel            text not null default 'bronze'
                     check (nivel in ('bronze','silver','gold','diamond')),
  animais_ajudados integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists doadores_updated_at on public.doadores;
create trigger doadores_updated_at
  before update on public.doadores
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. DOACOES (individual payments / donations)
-- ---------------------------------------------------------------------------
create table if not exists public.doacoes (
  id                     uuid primary key default gen_random_uuid(),
  doador_email           text not null,
  stripe_session_id      text not null unique,
  stripe_subscription_id text,
  valor                  numeric(10,2) not null,
  tipo                   text not null check (tipo in ('single','monthly')),
  status                 text not null default 'pending'
                           check (status in ('completed','pending','failed','cancelled')),
  campaign_id            text,
  campaign_name          text,
  proximo_pagamento      date,
  created_at             timestamptz not null default now()
);

create index if not exists doacoes_email_idx
  on public.doacoes(doador_email);

create index if not exists doacoes_subscription_idx
  on public.doacoes(stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Recalculates donor totals and tier after every insert/update on doacoes
create or replace function public.recalculate_doador_totals()
returns trigger language plpgsql security definer as $$
begin
  update public.doadores
  set
    total_doado      = coalesce((
      select sum(valor) from public.doacoes
      where doador_email = new.doador_email and status = 'completed'
    ), 0),
    contagem_doacoes = coalesce((
      select count(*) from public.doacoes
      where doador_email = new.doador_email and status = 'completed'
    ), 0),
    primeira_doacao  = coalesce(primeira_doacao, current_date),
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

drop trigger if exists doacoes_recalculate_totals on public.doacoes;
create trigger doacoes_recalculate_totals
  after insert or update on public.doacoes
  for each row execute function public.recalculate_doador_totals();

-- ---------------------------------------------------------------------------
-- 3. ASSINATURAS (recurring subscriptions)
-- ---------------------------------------------------------------------------
create table if not exists public.assinaturas (
  id                     uuid primary key default gen_random_uuid(),
  doador_email           text not null,
  stripe_subscription_id text not null unique,
  valor                  numeric(10,2) not null,
  status                 text not null default 'active'
                           check (status in ('active','paused','cancelled')),
  proximo_pagamento      date,
  data_inicio            date not null,
  metodo_pagamento       text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

drop trigger if exists assinaturas_updated_at on public.assinaturas;
create trigger assinaturas_updated_at
  before update on public.assinaturas
  for each row execute function public.set_updated_at();

create index if not exists assinaturas_email_idx
  on public.assinaturas(doador_email);

-- ---------------------------------------------------------------------------
-- 4. ADMIN_USERS
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.doadores    enable row level security;
alter table public.doacoes     enable row level security;
alter table public.assinaturas enable row level security;
alter table public.admin_users enable row level security;

-- doadores
drop policy if exists "Donors can read own profile"       on public.doadores;
drop policy if exists "Donors can update own profile"     on public.doadores;
drop policy if exists "Service role has full access to doadores" on public.doadores;

create policy "Donors can read own profile"
  on public.doadores for select using (auth.uid() = id);
create policy "Donors can update own profile"
  on public.doadores for update using (auth.uid() = id);
create policy "Service role has full access to doadores"
  on public.doadores for all using (auth.role() = 'service_role');

-- doacoes
drop policy if exists "Donors can read own donations"             on public.doacoes;
drop policy if exists "Service role has full access to doacoes"   on public.doacoes;

create policy "Donors can read own donations"
  on public.doacoes for select
  using (doador_email = (select email from public.doadores where id = auth.uid()));
create policy "Service role has full access to doacoes"
  on public.doacoes for all using (auth.role() = 'service_role');

-- assinaturas
drop policy if exists "Donors can read own subscriptions"         on public.assinaturas;
drop policy if exists "Donors can update own subscription status" on public.assinaturas;
drop policy if exists "Service role has full access to assinaturas" on public.assinaturas;

create policy "Donors can read own subscriptions"
  on public.assinaturas for select
  using (doador_email = (select email from public.doadores where id = auth.uid()));
create policy "Donors can update own subscription status"
  on public.assinaturas for update
  using (doador_email = (select email from public.doadores where id = auth.uid()));
create policy "Service role has full access to assinaturas"
  on public.assinaturas for all using (auth.role() = 'service_role');

-- admin_users
drop policy if exists "Admins can read own record"                on public.admin_users;
drop policy if exists "Service role has full access to admin_users" on public.admin_users;

create policy "Admins can read own record"
  on public.admin_users for select using (auth.uid() = id);
create policy "Service role has full access to admin_users"
  on public.admin_users for all using (auth.role() = 'service_role');
