-- =============================================================================
-- Migration 002 — Content tables
-- Tables: animais, campanhas, eventos, site_stats, mensagens,
--         camp_registrations, newsletter_subscribers, depoimentos
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ANIMAIS
-- ---------------------------------------------------------------------------
create table if not exists public.animais (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('dog','cat')),
  age         text not null,
  gender      text not null check (gender in ('male','female')),
  size        text not null check (size in ('small','medium','large')),
  temperament text[] not null default '{}',
  story       text not null default '',
  image       text not null default '',
  images      text[] not null default '{}',
  is_adopted  boolean not null default false,
  is_puppy    boolean not null default false,
  is_rescued  boolean not null default true,
  is_mixed    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.animais enable row level security;

drop policy if exists "public_select_animais" on public.animais;
create policy "public_select_animais" on public.animais
  for select to anon, authenticated using (true);

drop policy if exists "admin_write_animais" on public.animais;
create policy "admin_write_animais" on public.animais
  for all to authenticated
  using    (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ---------------------------------------------------------------------------
-- 2. CAMPANHAS
-- ---------------------------------------------------------------------------
create table if not exists public.campanhas (
  id                       uuid primary key default gen_random_uuid(),
  title                    text not null,
  slug                     text not null unique,
  description              text not null default '',
  long_description         text not null default '',
  goal                     numeric not null default 0,
  raised                   numeric not null default 0,
  start_date               date not null,
  end_date                 date not null,
  is_active                boolean not null default true,
  image                    text not null default '',
  icon                     text not null default 'Heart',
  category                 text not null default 'saude',
  urgency                  text not null default 'media',
  benefits                 text[] not null default '{}',
  impact_story             text not null default '',
  allows_registration      boolean not null default false,
  registration_description text,
  registration_spots       int not null default 0,
  registration_registered  int not null default 0,
  registration_requirements text[] not null default '{}',
  created_at               timestamptz not null default now()
);

alter table public.campanhas enable row level security;

drop policy if exists "public_select_campanhas" on public.campanhas;
create policy "public_select_campanhas" on public.campanhas
  for select to anon, authenticated using (true);

drop policy if exists "admin_write_campanhas" on public.campanhas;
create policy "admin_write_campanhas" on public.campanhas
  for all to authenticated
  using    (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ---------------------------------------------------------------------------
-- 3. EVENTOS
-- ---------------------------------------------------------------------------
create table if not exists public.eventos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null,
  time        text not null default '',
  location    text not null default '',
  description text not null default '',
  image       text,
  type        text not null default 'other'
                check (type in ('adoption','fundraising','educational','other')),
  capacity    int,
  registered  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.eventos enable row level security;

drop policy if exists "public_select_eventos" on public.eventos;
create policy "public_select_eventos" on public.eventos
  for select to anon, authenticated using (true);

drop policy if exists "admin_write_eventos" on public.eventos;
create policy "admin_write_eventos" on public.eventos
  for all to authenticated
  using    (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ---------------------------------------------------------------------------
-- 4. SITE_STATS
-- ---------------------------------------------------------------------------
create table if not exists public.site_stats (
  key        text primary key,
  value      int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_stats enable row level security;

drop policy if exists "public_select_site_stats" on public.site_stats;
create policy "public_select_site_stats" on public.site_stats
  for select to anon, authenticated using (true);

drop policy if exists "admin_write_site_stats" on public.site_stats;
create policy "admin_write_site_stats" on public.site_stats
  for all to authenticated
  using    (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ---------------------------------------------------------------------------
-- 5. MENSAGENS (contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.mensagens (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  email      text not null,
  telefone   text,
  assunto    text not null default 'outro',
  mensagem   text not null,
  lida       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.mensagens enable row level security;

drop policy if exists "Anyone can insert mensagens" on public.mensagens;
create policy "Anyone can insert mensagens"
  on public.mensagens for insert with check (true);

drop policy if exists "Admin manages mensagens" on public.mensagens;
create policy "Admin manages mensagens"
  on public.mensagens using ((auth.jwt() ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- 6. CAMP_REGISTRATIONS (campaign sign-ups)
-- ---------------------------------------------------------------------------
create table if not exists public.camp_registrations (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid references public.campanhas(id) on delete set null,
  campaign_title text not null,
  nome           text not null,
  email          text not null,
  telefone       text not null,
  cpf            text,
  endereco       text,
  nome_pet       text,
  tipo_pet       text,
  motivo         text not null,
  created_at     timestamptz not null default now()
);

alter table public.camp_registrations enable row level security;

drop policy if exists "Anyone can insert camp_registrations" on public.camp_registrations;
create policy "Anyone can insert camp_registrations"
  on public.camp_registrations for insert with check (true);

drop policy if exists "Admin manages camp_registrations" on public.camp_registrations;
create policy "Admin manages camp_registrations"
  on public.camp_registrations using ((auth.jwt() ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- 7. NEWSLETTER_SUBSCRIBERS
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  nome       text,
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert with check (true);

drop policy if exists "Admin manages newsletter" on public.newsletter_subscribers;
create policy "Admin manages newsletter"
  on public.newsletter_subscribers using ((auth.jwt() ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- 8. DEPOIMENTOS (testimonials)
-- ---------------------------------------------------------------------------
create table if not exists public.depoimentos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  animal     text not null,
  texto      text not null,
  avaliacao  int not null default 5 check (avaliacao between 1 and 5),
  aprovado   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.depoimentos enable row level security;

drop policy if exists "Public reads approved depoimentos" on public.depoimentos;
create policy "Public reads approved depoimentos"
  on public.depoimentos for select using (aprovado = true);

drop policy if exists "Anyone can submit depoimentos" on public.depoimentos;
create policy "Anyone can submit depoimentos"
  on public.depoimentos for insert with check (true);

drop policy if exists "Admin manages depoimentos" on public.depoimentos;
create policy "Admin manages depoimentos"
  on public.depoimentos using ((auth.jwt() ->> 'role') = 'admin');
