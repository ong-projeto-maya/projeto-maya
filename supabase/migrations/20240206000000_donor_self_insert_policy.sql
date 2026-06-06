-- =============================================================================
-- Migration 007 — Allow authenticated users to insert their own donor profile
-- and fix loadDoadorData to create the profile client-side without service role
-- =============================================================================

-- Allow each authenticated user to insert their own row in doadores
-- (needed when profile doesn't exist yet on first login)
drop policy if exists "Donors can insert own profile" on public.doadores;

create policy "Donors can insert own profile"
  on public.doadores
  for insert
  to authenticated
  with check (auth.uid() = id);
