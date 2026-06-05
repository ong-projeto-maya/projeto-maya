# 🚀 Supabase Local Setup — Projeto Maya

**Agente:** Bulma (DevOps Engineer)  
**Data:** 2026-05-01  
**SO:** Windows 10/11 com Docker Desktop instalado  
**Projeto:** `c:\git\pessoal\projeto-maya`  

---

## 📋 Checklist de Instalação

### ✅ Pré-requisitos
- [x] Docker Desktop instalado e rodando (v29.4.1+)
- [ ] PowerShell aberto como Administrador (recomendado para winget)
- [ ] Arquivos `supabase/schema.sql` e `supabase/seed.sql` existem

---

## 🔧 PASSO 1: Instalar Supabase CLI

### Opção A: Via winget (recomendado)

```powershell
winget install Supabase.CLI --accept-source-agreements --accept-package-agreements
```

### Opção B: Download manual

Se winget falhar:

1. Acesse: https://github.com/supabase/cli/releases
2. Baixe o arquivo `supabase_windows_amd64.zip`
3. Extraia e renomeie o `.exe` para `supabase.exe`
4. Mova para uma pasta no PATH (ex: `C:\Program Files\Supabase\`)
5. Adicione a pasta ao PATH do sistema

### Verificar instalação:

```powershell
supabase --version
# Esperado: supabase 1.x.x ou superior
```

---

## 🎯 PASSO 2: Inicializar Projeto

Na pasta do projeto:

```powershell
cd c:\git\pessoal\projeto-maya
supabase init
```

**Saída esperada:**
```
Finished supabase init.
```

Isso cria o arquivo `supabase/config.toml`.

---

## 🐳 PASSO 3: Iniciar Supabase Local

```powershell
supabase start
```

**⏱️ Primeira execução:** pode demorar 2-5 minutos (download de ~1GB de imagens Docker).

**📝 SALVE TODA A SAÍDA DESTE COMANDO!** Exemplo:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**🔑 Copie e guarde:**
- `anon key`
- `service_role key`

---

## 📊 PASSO 4: Aplicar Schema e Seed

```powershell
# Aplicar schema (cria tabelas, triggers, RLS policies)
supabase db execute --file supabase/schema.sql

# Aplicar seed (dados iniciais: animais, site_stats, etc.)
supabase db execute --file supabase/seed.sql
```

**Verificar sucesso:**

```powershell
# Listar tabelas criadas
supabase db execute --sql "SELECT tablename FROM pg_tables WHERE schemaname='public';"
```

Esperado: `doadores`, `doacoes`, `admin_users`, `animais`, `site_stats`, `contatos`, `voluntarios`, `adocoes`.

---

## 👤 PASSO 5: Criar Usuário Admin de Teste

### 5.1: Criar usuário no Supabase Auth

**⚠️ Substitua `<service_role_key>` pela chave capturada no PASSO 3!**

```powershell
curl -X POST http://localhost:54321/auth/v1/admin/users `
  -H "apikey: <service_role_key>" `
  -H "Authorization: Bearer <service_role_key>" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@admin.projetomaya.br\",\"password\":\"admin123\",\"email_confirm\":true}'
```

**Saída esperada (JSON):**
```json
{
  "id": "uuid-do-usuario-criado",
  "email": "admin@admin.projetomaya.br",
  "email_confirmed_at": "2026-05-01T...",
  ...
}
```

### 5.2: Inserir na tabela `admin_users`

```powershell
supabase db execute --file create-admin.sql
```

**Verificar:**

```powershell
supabase db execute --sql "SELECT * FROM public.admin_users;"
```

Esperado: 1 linha com `username='admin'`, `role='admin'`.

---

## 🔐 PASSO 6: Configurar Variáveis de Ambiente

O arquivo `.env.local` foi criado automaticamente por Bulma com placeholders.

**Edite `c:\git\pessoal\projeto-maya\.env.local` e substitua:**

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=<COLAR_ANON_KEY_AQUI>
SUPABASE_SERVICE_ROLE_KEY=<COLAR_SERVICE_ROLE_KEY_AQUI>
```

**Opcional (se for testar Stripe localmente):**
- Obtenha chaves de teste em https://dashboard.stripe.com/test/apikeys
- Substitua `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## ✅ PASSO 7: Testar Autenticação

### 7.1: Iniciar dev server Next.js

```powershell
npm run dev
# Esperado: Server running on http://localhost:3002
```

### 7.2: Testar login admin

1. Acesse: http://localhost:3002/admin
2. **Credenciais:**
   - Username: `admin`
   - Password: `admin123`
3. Se redirecionar para `/admin/dashboard` → ✅ **SUCESSO!**

---

## 🛠️ Comandos Úteis

```powershell
# Ver status dos containers
supabase status

# Parar Supabase (mantém dados)
supabase stop

# Parar e REMOVER DADOS (reset completo)
supabase stop --no-backup

# Ver logs
supabase logs

# Acessar banco de dados diretamente (psql)
supabase db connect

# Aplicar migrations
supabase db push

# Abrir Supabase Studio (GUI)
# http://localhost:54323
```

---

## 🐛 Troubleshooting

### Erro: `Cannot connect to Docker daemon`

**Solução:**
1. Abra Docker Desktop
2. Aguarde até ver "Docker Desktop is running"
3. Execute `docker ps` para verificar

### Erro: `Port 54321 already in use`

**Solução:**
```powershell
# Verificar processo usando porta 54321
netstat -ano | findstr :54321

# Parar Supabase se já estiver rodando
supabase stop
```

### Erro: `supabase: command not found`

**Solução (Windows):**
1. Feche e reabra o PowerShell (reload do PATH)
2. Se persistir, adicione manualmente ao PATH:
   - Pesquise "Variáveis de Ambiente" → Editar PATH do sistema
   - Adicione `C:\Users\<SEU_USUARIO>\AppData\Local\supabase\cli\bin`

### Erro no `create-admin.sql`: `no rows returned`

**Causa:** O usuário auth.users não foi criado (PASSO 5.1 falhou).

**Solução:**
1. Verifique se o curl retornou JSON com `id`
2. Se o curl falhar, use a API do Supabase Studio:
   - Acesse http://localhost:54323
   - Vá em Authentication → Users → Create User
   - Email: `admin@admin.projetomaya.br`
   - Password: `admin123`
   - Email Confirmed: ✅
3. Execute novamente o `create-admin.sql`

### Login admin retorna erro "Invalid credentials"

**Verificar:**
```powershell
# 1. Verificar se usuário existe no auth.users
supabase db execute --sql "SELECT email FROM auth.users WHERE email='admin@admin.projetomaya.br';"

# 2. Verificar se existe em admin_users
supabase db execute --sql "SELECT * FROM public.admin_users WHERE username='admin';"
```

**Se ambos retornarem vazio:** repetir PASSO 5 completo.

---

## 📊 Status Final Esperado

Após concluir todos os passos:

```
✅ Supabase CLI instalado (supabase --version)
✅ Containers Docker rodando (supabase status)
✅ Schema aplicado (8 tabelas criadas)
✅ Seed aplicado (animais, site_stats populados)
✅ Usuário admin criado (admin@admin.projetomaya.br)
✅ .env.local configurado com credenciais corretas
✅ Next.js dev server rodando (http://localhost:3002)
✅ Login admin funcionando (/admin → Dashboard)
```

---

## 🚨 Próximos Passos (após setup)

1. **Configurar Stripe Webhooks localmente:**
   ```powershell
   stripe listen --forward-to localhost:3002/api/webhook
   ```

2. **Implementar RLS policies** (se necessário):
   - Editar `supabase/schema.sql`
   - Aplicar com `supabase db push`

3. **Criar migrations para alterações futuras:**
   ```powershell
   supabase migration new nome_da_migration
   ```

4. **Deploy para produção (quando pronto):**
   - Criar projeto no https://app.supabase.com
   - `supabase link --project-ref <project-id>`
   - `supabase db push` (aplica migrations)

---

## 📞 Suporte

- **Documentação oficial:** https://supabase.com/docs/guides/cli
- **Discord Supabase:** https://discord.supabase.com
- **Bulma (DevOps):** Para problemas de infra, Docker ou CI/CD

---

**⚡ Setup criado por Bulma — MGR Solutions Squad**  
*"Se tem Docker e internet, eu faço funcionar!" 🔧*
