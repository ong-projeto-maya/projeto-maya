-- =============================================================================
-- Criar Usuário Admin de Teste — Projeto Maya
-- Execute após criar o auth.users via API (ver SETUP_SUPABASE.md passo 5.1)
-- =============================================================================

-- Inserir admin na tabela admin_users
-- Vincula o usuário auth.users com email admin@admin.projetomaya.br
INSERT INTO public.admin_users (user_id, username, role, display_name)
SELECT id, 'admin', 'admin', 'Administrador'
FROM auth.users 
WHERE email = 'admin@admin.projetomaya.br'
ON CONFLICT (user_id) DO NOTHING;

-- Verificar criação
SELECT 
  au.user_id, 
  au.username, 
  au.role, 
  au.display_name,
  u.email,
  u.created_at
FROM public.admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.username = 'admin';
