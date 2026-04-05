# 🔐 Sistema de Login Administrativo

## 📋 Visão Geral

Foi implementado um sistema completo de autenticação para proteger o Dashboard Administrativo do Projeto Maya. Agora, apenas usuários autenticados podem acessar `/admin`.

---

## ✨ Funcionalidades Implementadas

### 🔒 Tela de Login

**URL:** `/admin/login`

#### Recursos:
- ✅ Design profissional e moderno
- ✅ Formulário responsivo (funciona em mobile/desktop)
- ✅ Toggle para mostrar/ocultar senha
- ✅ Validação de campos obrigatórios
- ✅ Feedback visual de erros
- ✅ Loading state durante autenticação
- ✅ Suporte completo ao dark mode
- ✅ Credenciais de demonstração visíveis
- ✅ Link para voltar ao site público

#### Campos:
- **Usuário:** Campo de texto para nome de usuário
- **Senha:** Campo de senha com toggle de visibilidade
- **Botão Entrar:** Submete o formulário

### 🛡️ Proteção de Rotas

**URL Protegida:** `/admin`

#### Como Funciona:
1. Usuário tenta acessar `/admin`
2. Sistema verifica se há sessão ativa
3. Se **NÃO autenticado** → Redireciona para `/admin/login`
4. Se **autenticado** → Mostra dashboard

#### Verificações:
- ✅ Validação de sessão ao carregar página
- ✅ Verificação de expiração (24 horas)
- ✅ Loading state durante verificação
- ✅ Redirecionamento automático

### 👤 Gestão de Sessão

#### Características:
- **Persistência:** localStorage
- **Duração:** 24 horas
- **Dados Salvos:**
  - Nome de usuário
  - Role (admin)
  - Timestamp de login

#### Segurança:
- ✅ Sessão expira automaticamente após 24h
- ✅ Logout limpa completamente a sessão
- ✅ Confirmação antes de logout
- ✅ Não expõe senhas no localStorage

### 📊 Dashboard Atualizado

#### Novo Header:
- **Info do Usuário:**
  - Nome do usuário (ex: "admin")
  - Badge "Administrador"
  - Visível em desktop (escondido em mobile para economizar espaço)

- **Botão de Logout:**
  - Ícone de saída (LogOut)
  - Cor vermelha para indicar ação destrutiva
  - Confirmação antes de deslogar
  - Redireciona para `/admin/login` após logout

---

## 🚀 Como Usar

### Para Desenvolvedores

#### 1. Acessar o Dashboard

```bash
# 1. Iniciar o servidor
npm run dev

# 2. Abrir navegador
# http://localhost:3000/admin
```

#### 2. Fazer Login

Você será redirecionado automaticamente para `/admin/login`

**Credenciais Disponíveis:**

```
Opção 1:
Usuário: admin
Senha: maya2024

Opção 2:
Usuário: projetomaya
Senha: admin123
```

#### 3. Acessar Dashboard

Após login bem-sucedido, você será redirecionado para `/admin` e verá:
- ✅ Seu nome de usuário no canto superior direito
- ✅ Badge "Administrador"
- ✅ Botão vermelho "Sair"
- ✅ Todas as funcionalidades do dashboard

#### 4. Fazer Logout

1. Clique no botão "Sair" (vermelho)
2. Confirme a ação
3. Será redirecionado para `/admin/login`

---

## 🔧 Arquitetura Técnica

### Estrutura de Arquivos

```
projeto-maya/
├── hooks/
│   └── useAuth.ts                 # Hook de autenticação
├── app/
│   └── admin/
│       ├── page.tsx               # Dashboard (protegido)
│       └── login/
│           └── page.tsx           # Tela de login
```

### Hook useAuth

**Arquivo:** `hooks/useAuth.ts`

```typescript
export function useAuth() {
  const { user, loading, isAuthenticated, login, logout } = useAuth()
  
  // user: { username: string, role: 'admin' } | null
  // loading: boolean (true durante verificação inicial)
  // isAuthenticated: boolean (atalho para !!user)
  // login(username, password): boolean
  // logout(): void
}
```

#### Métodos:

**`login(username: string, password: string): boolean`**
- Valida credenciais
- Salva sessão no localStorage
- Retorna true se sucesso, false se falha

**`logout(): void`**
- Remove dados de localStorage
- Limpa estado do usuário
- Invalida sessão

**`isAuthenticated: boolean`**
- true se usuário está logado
- false caso contrário

#### Estado:

**`user: User | null`**
```typescript
{
  username: "admin",
  role: "admin"
}
```

**`loading: boolean`**
- true: Verificando autenticação
- false: Verificação completa

---

## 🎨 Interface do Usuário

### Tela de Login

#### Elementos Visuais:
- **Logo:** Círculo verde oliva com ícone de cadeado
- **Título:** "Acesso Administrativo"
- **Subtítulo:** "Projeto Maya Dashboard"
- **Formulário:** Fundo branco/cinza escuro (dark mode)
- **Campos:** Bordas arredondadas, ícones internos
- **Botão:** Verde oliva, efeito hover
- **Box de Credenciais:** Fundo verde claro com credenciais de teste

#### Estados:
1. **Normal:** Campos editáveis, botão clicável
2. **Loading:** Spinner no botão, campos desabilitados
3. **Erro:** Alert vermelho acima do formulário
4. **Sucesso:** Redirecionamento imediato

### Dashboard Header

#### Layout Desktop:
```
┌────────────────────────────────────────────────────────┐
│ Dashboard Administrativo    │  admin         │ [Sair] │
│ Gerencie animais...         │  Administrador │        │
└────────────────────────────────────────────────────────┘
```

#### Layout Mobile:
```
┌──────────────────────────────┐
│ Dashboard Administrativo     │
│ Gerencie...          [Sair]  │
└──────────────────────────────┘
```

---

## 🔒 Segurança

### ⚠️ Avisos Importantes

#### Em Desenvolvimento (Atual):

✅ **O que está seguro:**
- Proteção básica de rotas
- Sessão com expiração
- Redirecionamento de não-autenticados

⚠️ **O que NÃO está seguro:**
- Credenciais hardcoded no código
- Sem hashing de senhas
- Sessão apenas no localStorage (vulnerável a XSS)
- Sem rate limiting
- Sem proteção CSRF
- Sem logs de auditoria

#### Para Produção:

🔴 **OBRIGATÓRIO antes do deploy:**

1. **Remover Credenciais Hardcoded**
   ```typescript
   // ❌ NÃO fazer:
   if (username === 'admin' && password === 'maya2024')
   
   // ✅ FAZER:
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     body: JSON.stringify({ username, password })
   })
   ```

2. **Backend Real**
   - API de autenticação
   - Banco de dados de usuários
   - Hash de senhas (bcrypt, argon2)
   - Tokens JWT ou sessions

3. **HTTPS Obrigatório**
   - Nunca envie credenciais por HTTP
   - Use certificado SSL/TLS

4. **Rate Limiting**
   ```typescript
   // Limite de 5 tentativas por minuto
   import rateLimit from 'express-rate-limit'
   ```

5. **Tokens Seguros**
   ```typescript
   // Use httpOnly cookies
   res.setHeader('Set-Cookie', `token=${jwt}; HttpOnly; Secure; SameSite=Strict`)
   ```

6. **Logs de Auditoria**
   - Registre todas as tentativas de login
   - IP, timestamp, sucesso/falha
   - Alertas de tentativas suspeitas

---

## 🧪 Testes

### Casos de Teste

#### ✅ Teste 1: Login com Credenciais Válidas
```
1. Acesse /admin/login
2. Digite: admin / maya2024
3. Clique em "Entrar"
4. ✅ Deve redirecionar para /admin
5. ✅ Deve mostrar nome "admin" no header
```

#### ✅ Teste 2: Login com Credenciais Inválidas
```
1. Acesse /admin/login
2. Digite: admin / senhaerrada
3. Clique em "Entrar"
4. ✅ Deve mostrar erro "Usuário ou senha incorretos"
5. ✅ Campo senha deve limpar
6. ✅ Não deve redirecionar
```

#### ✅ Teste 3: Acesso Direto ao Dashboard (Sem Login)
```
1. Limpe localStorage (DevTools > Application > Clear)
2. Acesse /admin diretamente
3. ✅ Deve redirecionar para /admin/login
```

#### ✅ Teste 4: Persistência de Sessão
```
1. Faça login
2. Recarregue a página (F5)
3. ✅ Deve continuar logado
4. ✅ Não deve pedir login novamente
```

#### ✅ Teste 5: Logout
```
1. Estando logado no dashboard
2. Clique no botão "Sair"
3. Confirme a ação
4. ✅ Deve redirecionar para /admin/login
5. ✅ Tente acessar /admin novamente
6. ✅ Deve pedir login novamente
```

#### ✅ Teste 6: Expiração de Sessão
```
1. Faça login
2. No DevTools Console, execute:
   localStorage.setItem('maya_admin_login_time', '0')
3. Recarregue a página
4. ✅ Deve ser deslogado automaticamente
5. ✅ Deve redirecionar para /admin/login
```

#### ✅ Teste 7: Dark Mode
```
1. Ative dark mode no site
2. Acesse /admin/login
3. ✅ Tela de login deve estar no modo escuro
4. Faça login
5. ✅ Dashboard deve estar no modo escuro
```

#### ✅ Teste 8: Responsividade Mobile
```
1. Abra DevTools (F12)
2. Toggle device emulation (Ctrl+Shift+M)
3. Selecione iPhone 12
4. Acesse /admin/login
5. ✅ Formulário deve ser responsivo
6. ✅ Botões devem ser tocáveis
```

### Debug

#### Ver Estado da Sessão

Abra DevTools (F12) > Console:

```javascript
// Ver dados do usuário
JSON.parse(localStorage.getItem('maya_admin_user'))

// Ver tempo de login
new Date(parseInt(localStorage.getItem('maya_admin_login_time')))

// Calcular tempo restante (em horas)
const elapsed = Date.now() - parseInt(localStorage.getItem('maya_admin_login_time'))
const hoursLeft = 24 - (elapsed / (1000 * 60 * 60))
console.log(`Sessão expira em ${hoursLeft.toFixed(2)} horas`)

// Limpar sessão manualmente
localStorage.removeItem('maya_admin_user')
localStorage.removeItem('maya_admin_login_time')
```

---

## 🔄 Fluxo Completo

### Diagrama de Fluxo

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       │ 1. Acessa /admin
       ▼
┌─────────────────┐
│   useAuth()     │ 2. Verifica localStorage
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 Sim│         │Não
    │         │
    ▼         ▼
┌─────┐   ┌──────────┐
│Admin│   │  /login  │ 3. Redireciona
└─────┘   └────┬─────┘
              │
              │ 4. Insere credenciais
              ▼
         ┌────────────┐
         │  login()   │ 5. Valida
         └─────┬──────┘
               │
          ┌────┴────┐
          │         │
    Válido│         │Inválido
          │         │
          ▼         ▼
      ┌─────┐   ┌───────┐
      │Admin│   │ Erro  │
      └─────┘   └───────┘
```

---

## 📝 Próximos Passos

### Melhorias Recomendadas

#### Curto Prazo (Antes do Deploy)

1. **Integrar com Backend Real**
   - [ ] Criar API `/api/auth/login`
   - [ ] Criar API `/api/auth/logout`
   - [ ] Criar API `/api/auth/verify`

2. **Implementar Tokens JWT**
   - [ ] Gerar token no login
   - [ ] Validar token em cada request
   - [ ] Refresh tokens

3. **Adicionar Rate Limiting**
   - [ ] Limitar tentativas de login
   - [ ] Bloquear IPs suspeitos temporariamente

#### Médio Prazo

4. **Sistema de Recuperação de Senha**
   - [ ] Página "Esqueci minha senha"
   - [ ] Email de recuperação
   - [ ] Link temporário de reset

5. **Autenticação de Dois Fatores (2FA)**
   - [ ] TOTP (Google Authenticator)
   - [ ] SMS (opcional)
   - [ ] Códigos de backup

6. **Logs de Auditoria**
   - [ ] Registrar todos os logins
   - [ ] IP, device, browser
   - [ ] Alertas de login suspeito

#### Longo Prazo

7. **Sistema de Permissões**
   - [ ] Roles: Admin, Moderador, Visualizador
   - [ ] Permissões granulares por feature
   - [ ] Interface de gestão de usuários

8. **OAuth/SSO**
   - [ ] Login com Google
   - [ ] Login com Microsoft
   - [ ] SAML (para organizações)

---

## 📚 Recursos Adicionais

### Bibliotecas Recomendadas

**Autenticação Completa:**
- [NextAuth.js](https://next-auth.js.org/) - Sistema completo
- [Clerk](https://clerk.com/) - Mais fácil, pago
- [Supabase Auth](https://supabase.com/auth) - Open source

**Segurança:**
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Hash de senhas
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT tokens
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) - Rate limiting

**2FA:**
- [speakeasy](https://www.npmjs.com/package/speakeasy) - TOTP
- [qrcode](https://www.npmjs.com/package/qrcode) - QR codes

---

## ✅ Checklist Final

Antes de considerar o sistema de login completo:

### MVP (Atual) ✅
- [x] Tela de login funcional
- [x] Proteção de rota /admin
- [x] Gestão de sessão básica
- [x] Logout funcional
- [x] UI profissional
- [x] Dark mode
- [x] Responsivo

### Produção (TODO) ⚠️
- [ ] Backend real
- [ ] Hash de senhas
- [ ] Tokens JWT
- [ ] HTTPS obrigatório
- [ ] Rate limiting
- [ ] Logs de auditoria
- [ ] Recuperação de senha
- [ ] Testes automatizados
- [ ] Documentação de API
- [ ] Monitoramento

---

**Status Atual:** 🟢 Funcional para Desenvolvimento / 🔴 NÃO PRONTO para Produção

**Última Atualização:** 2026-02-20
