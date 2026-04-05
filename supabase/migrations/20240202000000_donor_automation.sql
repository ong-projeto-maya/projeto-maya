-- =============================================================================
-- Migration 003 — Donor automation
-- Trigger: create doador profile when a new Auth user signs up
-- =============================================================================

-- Called by auth.users AFTER INSERT — creates the donor profile automatically
create or replace function public.handle_new_donor()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.doadores (
    id, email, nome, nivel,
    total_doado, contagem_doacoes, animais_ajudados,
    created_at, updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    'bronze',
    0, 0, 0,
    now(), now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_donor();
