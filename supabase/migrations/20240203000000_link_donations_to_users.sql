-- =============================================================================
-- Migration 004 — Link donations and subscriptions to auth users
-- Adds doador_id (nullable FK to auth.users) to doacoes and assinaturas.
-- Nullable so that anonymous donations (no logged-in user) are still stored.
-- =============================================================================

alter table public.doacoes
  add column if not exists doador_id uuid references auth.users(id) on delete set null;

alter table public.assinaturas
  add column if not exists doador_id uuid references auth.users(id) on delete set null;

-- Index for fast lookup by user
create index if not exists doacoes_doador_id_idx    on public.doacoes    (doador_id);
create index if not exists assinaturas_doador_id_idx on public.assinaturas (doador_id);

-- RLS: donors can read their own donations (by doador_id OR doador_email)
drop policy if exists "donor_select_own_doacoes" on public.doacoes;
create policy "donor_select_own_doacoes" on public.doacoes
  for select to authenticated
  using (
    doador_id = auth.uid()
    or doador_email = (select email from auth.users where id = auth.uid())
  );

drop policy if exists "donor_select_own_assinaturas" on public.assinaturas;
create policy "donor_select_own_assinaturas" on public.assinaturas
  for select to authenticated
  using (
    doador_id = auth.uid()
    or doador_email = (select email from auth.users where id = auth.uid())
  );
