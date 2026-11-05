-- =============================================================================
-- Criar usuário admin — Projeto Maya
--
-- Pré-requisito: o usuário já precisa existir em auth.users. Crie-o primeiro
-- pelo painel do Supabase (Authentication > Add user) ou pela Admin API —
-- ver SETUP_SUPABASE.md, passo 5.1.
--
-- O login do painel (hooks/useAuth.ts) aceita os dois formatos:
--   * e-mail de verdade, usado como digitado  -> use este
--   * nome de usuário sozinho, que vira <usuário>@admin.projetomaya.br
--
-- Prefira e-mail de verdade: o domínio interno não recebe mensagem, então
-- com ele a recuperação de senha do Supabase nunca chega a ninguém.
--
-- O `username` abaixo é só o nome exibido no painel, não serve para entrar.
--
-- Troque os dois valores marcados abaixo e execute.
-- =============================================================================

insert into public.admin_users (id, username, role)
select id, 'admin', 'admin'                 -- <<< nome exibido no painel
from auth.users
where email = 'troque@pelo-seu-email.com'   -- <<< e-mail criado em auth.users
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
