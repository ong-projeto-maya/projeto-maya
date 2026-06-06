-- =============================================================================
-- Migration 006 — Auto-create doadores profile on auth.users insert
-- When a user signs up via Supabase Auth, this trigger immediately creates
-- a matching row in public.doadores so loadDoadorData always finds a profile.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.doadores (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop old trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: create profiles for existing auth users that have no doadores row
insert into public.doadores (id, email, nome)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'nome', split_part(u.email, '@', 1))
from auth.users u
where not exists (
  select 1 from public.doadores d where d.id = u.id
)
on conflict (id) do nothing;
