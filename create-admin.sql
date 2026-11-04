-- =============================================================================
-- Criar usuário admin — Projeto Maya
--
-- Pré-requisito: o usuário já precisa existir em auth.users. Crie-o primeiro
-- pelo painel do Supabase (Authentication > Add user) ou pela Admin API —
-- ver SETUP_SUPABASE.md, passo 5.1.
--
-- O login do painel monta o e-mail a partir do usuário digitado:
--     <usuário>@admin.projetomaya.br      (hooks/useAuth.ts)
-- Então, para entrar como "eduardo", o e-mail em auth.users precisa ser
-- eduardo@admin.projetomaya.br. O domínio é interno e não precisa existir.
--
-- Troque os dois valores marcados abaixo e execute.
-- =============================================================================

insert into public.admin_users (id, username, role)
select id, 'admin', 'admin'                    -- <<< username usado no login
from auth.users
where email = 'admin@admin.projetomaya.br'     -- <<< e-mail criado em auth.users
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Conferir quem é admin hoje
-- -----------------------------------------------------------------------------
select
  au.id,
  au.username,
  au.role,
  u.email,
  u.created_at
from public.admin_users au
join auth.users u on u.id = au.id
order by u.created_at;
