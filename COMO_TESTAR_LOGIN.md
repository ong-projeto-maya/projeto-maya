# 🚀 Como Testar o Sistema de Login Admin

## ⚡ Início Rápido (3 Passos)

### 1️⃣ Iniciar o Servidor
```bash
cd "C:\Users\mrodrigues7\Downloads\Projeto Maya"
npm run dev
```

### 2️⃣ Acessar o Dashboard
Abra no navegador: http://localhost:3000/admin

✅ Você será redirecionado automaticamente para a tela de login

### 3️⃣ Fazer Login

Use uma das credenciais:

```
Usuário: admin
Senha: maya2024
```

**OU**

```
Usuário: projetomaya
Senha: admin123
```

Clique em **"Entrar"** e você será redirecionado para o dashboard! 🎉

---

## 🧪 Testes Completos

### ✅ Teste 1: Login Bem-Sucedido

1. Vá para: http://localhost:3000/admin/login
2. Digite: **admin** / **maya2024**
3. Clique **"Entrar"**
4. **Resultado esperado:**
   - ✅ Redireciona para `/admin`
   - ✅ Mostra "admin" no canto superior direito
   - ✅ Mostra badge "Administrador"
   - ✅ Botão vermelho "Sair" visível

---

### ❌ Teste 2: Login com Senha Errada

1. Vá para: http://localhost:3000/admin/login
2. Digite: **admin** / **senhaerrada**
3. Clique **"Entrar"**
4. **Resultado esperado:**
   - ❌ Mostra erro vermelho "Usuário ou senha incorretos"
   - ❌ Campo senha é limpo
   - ❌ Permanece na tela de login

---

### 🔒 Teste 3: Acesso Sem Login

1. Abra DevTools (F12)
2. Vá para **Application** → **Local Storage**
3. Delete `maya_admin_user` e `maya_admin_login_time`
4. Acesse: http://localhost:3000/admin
5. **Resultado esperado:**
   - 🔒 Redireciona automaticamente para `/admin/login`

---

### 🔄 Teste 4: Persistência de Sessão

1. Faça login com sucesso
2. Pressione **F5** (recarregar página)
3. **Resultado esperado:**
   - ✅ Continua logado
   - ✅ Dashboard carrega normalmente
   - ✅ Nome de usuário ainda visível

---

### 🚪 Teste 5: Logout

1. Estando logado no dashboard
2. Clique no botão vermelho **"Sair"**
3. Confirme "Tem certeza que deseja sair?"
4. **Resultado esperado:**
   - 🚪 Redireciona para `/admin/login`
   - 🚪 Sessão é limpa
5. Tente acessar `/admin` novamente
6. **Resultado esperado:**
   - 🔒 Pede login novamente

---

### ⏰ Teste 6: Expiração de Sessão

1. Faça login
2. Abra DevTools (F12) → Console
3. Cole e execute:
```javascript
localStorage.setItem('maya_admin_login_time', '0')
```
4. Recarregue a página (F5)
5. **Resultado esperado:**
   - ⏰ Sessão expira automaticamente
   - 🔒 Redireciona para `/admin/login`

---

### 🌙 Teste 7: Dark Mode

1. No site principal, clique no botão de lua (dark mode)
2. Acesse: http://localhost:3000/admin/login
3. **Resultado esperado:**
   - 🌙 Tela de login em modo escuro
   - 🌙 Formulário com fundo cinza escuro
4. Faça login
5. **Resultado esperado:**
   - 🌙 Dashboard também em modo escuro

---

### 📱 Teste 8: Mobile

1. Abra DevTools (F12)
2. Pressione **Ctrl+Shift+M** (toggle device emulation)
3. Selecione **iPhone 12** ou **Galaxy S20**
4. Acesse: http://localhost:3000/admin/login
5. **Resultado esperado:**
   - 📱 Formulário responsivo
   - 📱 Campos grandes e tocáveis
   - 📱 Botões acessíveis
6. Faça login e acesse dashboard
7. **Resultado esperado:**
   - 📱 Botão "Sair" visível
   - 📱 Nome de usuário escondido (economia de espaço)

---

## 🔍 Debug & Inspeção

### Ver Dados da Sessão

Abra DevTools (F12) → Console:

```javascript
// Ver usuário atual
console.log(JSON.parse(localStorage.getItem('maya_admin_user')))
// Resultado: { username: "admin", role: "admin" }

// Ver timestamp de login
const loginTime = parseInt(localStorage.getItem('maya_admin_login_time'))
console.log(new Date(loginTime))

// Ver tempo restante de sessão
const elapsed = Date.now() - loginTime
const hoursLeft = 24 - (elapsed / (1000 * 60 * 60))
console.log(`Sessão expira em ${hoursLeft.toFixed(2)} horas`)
```

### Limpar Sessão Manualmente

```javascript
// Limpar tudo
localStorage.removeItem('maya_admin_user')
localStorage.removeItem('maya_admin_login_time')
location.reload()
```

### Simular Usuário Logado

```javascript
// Login manual via console
const user = { username: 'admin', role: 'admin' }
localStorage.setItem('maya_admin_user', JSON.stringify(user))
localStorage.setItem('maya_admin_login_time', String(Date.now()))
location.reload()
```

---

## 🎯 Fluxo Visual

```
┌─────────────────────────────────────────┐
│  1. Usuário acessa /admin               │
└───────────────┬─────────────────────────┘
                │
                │ Tem sessão?
        ┌───────┴────────┐
        │                │
      SIM               NÃO
        │                │
        ▼                ▼
┌───────────┐    ┌──────────────┐
│ Dashboard │    │ /admin/login │
│   (Admin) │    │              │
└───────────┘    └──────┬───────┘
                        │
                        │ Login OK?
                 ┌──────┴──────┐
                 │             │
               SIM           NÃO
                 │             │
                 ▼             ▼
         ┌───────────┐   ┌─────────┐
         │ Dashboard │   │  Erro   │
         └───────────┘   └─────────┘
```

---

## ⚡ Atalhos Úteis

### Navegação Rápida

```
Login:     http://localhost:3000/admin/login
Dashboard: http://localhost:3000/admin
Home:      http://localhost:3000
```

### DevTools

```
Abrir DevTools:        F12
Console:               Ctrl+Shift+J
Application Tab:       F12 → Application
Device Emulation:      Ctrl+Shift+M
Recarregar (cache):    Ctrl+Shift+R
```

---

## 📊 Checklist de Testes

Marque conforme testa:

- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Acesso sem login redireciona
- [ ] Sessão persiste após reload
- [ ] Logout funciona corretamente
- [ ] Expiração de sessão (24h)
- [ ] Dark mode funciona
- [ ] Responsivo em mobile
- [ ] Botão mostrar/ocultar senha
- [ ] Loading state durante login
- [ ] Nome de usuário visível no dashboard
- [ ] Botão de sair funcional

---

## 🎓 Credenciais de Teste

### Opção 1 (Recomendada)
```
Usuário: admin
Senha: maya2024
```

### Opção 2
```
Usuário: projetomaya
Senha: admin123
```

⚠️ **Nota:** Estas credenciais estão hardcoded apenas para demonstração. Em produção, você deve remover e implementar autenticação real!

---

## 🆘 Problemas Comuns

### ❌ "Não consigo fazer login"

**Solução:**
1. Verifique se digitou as credenciais exatamente como mostrado
2. Senhas são case-sensitive: `maya2024` ≠ `Maya2024`
3. Limpe o cache: Ctrl+Shift+R

### ❌ "Redirecionamento infinito"

**Solução:**
```javascript
// No Console do DevTools:
localStorage.clear()
location.reload()
```

### ❌ "Sessão não persiste"

**Solução:**
1. Verifique se localStorage está habilitado
2. Modo anônimo pode não persistir dados
3. Algumas extensões bloqueiam localStorage

### ❌ "Dark mode não funciona"

**Solução:**
1. Limpe o cache do navegador
2. Verifique se o script de dark mode está carregando
3. Tente em modo anônimo

---

## 🎉 Pronto!

Agora você tem um sistema de login completo e funcional!

**Próximos passos:**
1. Teste todas as funcionalidades
2. Customize conforme necessário
3. **Antes do deploy:** Implemente autenticação real!

**Dúvidas?** Consulte:
- `SISTEMA_LOGIN_ADMIN.md` - Documentação completa
- `ADMIN_SETUP.md` - Guia de setup produção
