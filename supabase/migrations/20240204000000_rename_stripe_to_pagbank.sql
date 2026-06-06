-- =============================================================================
-- Migration 005 — Rename stripe_subscription_id → pagbank_subscription_id
-- and stripe_session_id → pagbank_order_id in both tables
-- =============================================================================

-- doacoes table
alter table public.doacoes
  rename column stripe_session_id to pagbank_order_id;

alter table public.doacoes
  rename column stripe_subscription_id to pagbank_subscription_id;

-- Rename index on doacoes
drop index if exists doacoes_stripe_subscription_id_idx;
create index if not exists doacoes_pagbank_subscription_id_idx
  on public.doacoes (pagbank_subscription_id)
  where pagbank_subscription_id is not null;

-- assinaturas table
alter table public.assinaturas
  rename column stripe_subscription_id to pagbank_subscription_id;

-- Rename unique constraint (recreate it)
alter table public.assinaturas
  drop constraint if exists assinaturas_stripe_subscription_id_key;

alter table public.assinaturas
  add constraint assinaturas_pagbank_subscription_id_key
  unique (pagbank_subscription_id);
