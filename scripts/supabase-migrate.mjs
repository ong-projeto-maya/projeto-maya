import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://lnyzamgkxeyxgyoqpjmj.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY env var is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Supabase doesn't expose a direct SQL execution endpoint via the JS client.
// We use the Management API instead.
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''

async function runSQL(label, sql) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  )
  const body = await res.text()
  if (!res.ok) {
    console.error(`[${label}] FAILED (${res.status}):`, body)
  } else {
    console.log(`[${label}] OK`)
  }
}

// 1. Trigger: criar perfil de doador ao registrar no Auth
await runSQL('handle_new_donor function', `
  create or replace function public.handle_new_donor()
  returns trigger language plpgsql security definer set search_path = public as $$
  begin
    insert into public.doadores (id, email, nome, nivel, total_doado, contagem_doacoes, animais_ajudados, created_at, updated_at)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
      'bronze', 0, 0, 0, now(), now()
    )
    on conflict (id) do nothing;
    return new;
  end;
  $$;
`)

await runSQL('on_auth_user_created trigger', `
  drop trigger if exists on_auth_user_created on auth.users;
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_donor();
`)

// 2. Atualizar recalculate_doador_totals para incluir primeira_doacao
await runSQL('recalculate_doador_totals function', `
  create or replace function public.recalculate_doador_totals()
  returns trigger language plpgsql security definer as $$
  begin
    update public.doadores
    set
      total_doado = coalesce((
        select sum(valor) from public.doacoes
        where doador_email = new.doador_email and status = 'completed'
      ), 0),
      contagem_doacoes = coalesce((
        select count(*) from public.doacoes
        where doador_email = new.doador_email and status = 'completed'
      ), 0),
      primeira_doacao = coalesce(primeira_doacao, current_date),
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
`)

console.log('Migration complete.')
