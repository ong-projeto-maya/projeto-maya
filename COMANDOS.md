# 🛠️ Comandos Úteis - Projeto Maya

Referência rápida de comandos para gerenciar o projeto.

---

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Instalar Stripe (para doações)
npm install stripe

# Criar arquivo de ambiente (copie .env.example)
cp .env.example .env.local
```

---

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar site
# http://localhost:3000
```

### Portas Alternativas

```bash
# Rodar em porta diferente
npm run dev -- -p 3001
```

---

## 🏗️ Build e Produção

```bash
# Criar build de produção
npm run build

# Testar build localmente
npm run start

# Verificar erros de TypeScript
npx tsc --noEmit

# Lint (verificar código)
npm run lint
```

---

## 💳 Stripe (Desenvolvimento Local)

```bash
# Instalar Stripe CLI
# Windows (Scoop)
scoop install stripe

# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Login no Stripe
stripe login

# Escutar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhook

# Testar evento específico
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.created

# Ver logs de webhooks
stripe logs tail
```

---

## 🗃️ Git

```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - Projeto Maya MVP"

# Renomear branch para main
git branch -M main

# Adicionar remote (GitHub)
git remote add origin https://github.com/seu-usuario/projeto-maya.git

# Push
git push -u origin main

# Ver status
git status

# Ver diferenças
git diff
```

---

## 🚀 Deploy - Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primeira vez)
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains

# Adicionar variável de ambiente
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## 📝 Edição de Conteúdo

### Adicionar/Editar Animais

```bash
# Editar arquivo
code data/animals.ts
# ou
notepad data/animals.ts
```

### Mudar Cores

```bash
# Editar configuração do Tailwind
code tailwind.config.ts
```

### Editar Textos da Home

```bash
# Hero
code components/home/Hero.tsx

# Sobre
code components/home/About.tsx

# Como Ajudar
code components/home/HowToHelp.tsx

# Depoimentos
code components/home/Testimonials.tsx
```

---

## 🔍 Debug e Logs

```bash
# Ver logs do Next.js (terminal onde rodou npm run dev)
# Os logs aparecem automaticamente

# Limpar cache do Next.js
rm -rf .next
# Windows PowerShell:
Remove-Item -Recurse -Force .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

## 🧪 Testes

### Testar Doações

```bash
# Cartões de teste Stripe:

# Sucesso
4242 4242 4242 4242

# Requer autenticação 3D Secure
4000 0025 0000 3155

# Pagamento negado
4000 0000 0000 9995

# Data: qualquer futura (ex: 12/34)
# CVC: qualquer 3 dígitos (ex: 123)
```

### Verificar Responsividade

```bash
# No navegador:
# F12 (DevTools) → Toggle device toolbar
# Ou: Ctrl+Shift+M (Windows) / Cmd+Shift+M (Mac)

# Testar em:
# - iPhone SE (375px)
# - iPad (768px)
# - Desktop (1920px)
```

---

## 📊 Stripe Dashboard

```bash
# Acessar dashboards:

# Modo Teste
https://dashboard.stripe.com/test/payments
https://dashboard.stripe.com/test/subscriptions
https://dashboard.stripe.com/test/webhooks

# Modo Produção
https://dashboard.stripe.com/payments
https://dashboard.stripe.com/subscriptions
https://dashboard.stripe.com/webhooks
```

---

## 🔧 Utilitários

```bash
# Verificar versão do Node
node -v

# Verificar versão do npm
npm -v

# Atualizar npm
npm install -g npm@latest

# Limpar cache do npm
npm cache clean --force

# Ver pacotes instalados
npm list --depth=0

# Ver pacotes desatualizados
npm outdated

# Atualizar pacotes
npm update
```

---

## 📱 URLs Importantes

```bash
# Desenvolvimento
http://localhost:3000

# Páginas
http://localhost:3000/              # Home
http://localhost:3000/adocao        # Listagem de animais
http://localhost:3000/adocao/1      # Animal específico
http://localhost:3000/doacoes       # Página de doações

# APIs (não acesse diretamente no navegador)
http://localhost:3000/api/create-checkout-session
http://localhost:3000/api/webhook
```

---

## 🎯 Workflow Recomendado

### Desenvolvimento Diário

```bash
# 1. Atualizar código (se usando Git)
git pull

# 2. Instalar novas dependências (se houver)
npm install

# 3. Iniciar servidor
npm run dev

# 4. Fazer alterações...

# 5. Testar

# 6. Commit
git add .
git commit -m "Descrição das mudanças"
git push
```

### Deploy

```bash
# 1. Testar localmente
npm run build
npm run start

# 2. Se tudo OK, fazer deploy
vercel --prod

# 3. Testar em produção
# Acessar URL da Vercel
```

---

## 🆘 Solução de Problemas

```bash
# Servidor não inicia
# → Verificar se porta 3000 está em uso
# → Tentar porta diferente: npm run dev -- -p 3001

# Mudanças não aparecem
# → Limpar cache: rm -rf .next
# → Reiniciar servidor

# Erro de módulo não encontrado
# → Reinstalar dependências:
rm -rf node_modules package-lock.json
npm install

# Erro de TypeScript
# → Verificar: npx tsc --noEmit
# → Corrigir erros mostrados

# Stripe não funciona
# → Verificar .env.local
# → Verificar se código foi descomentado
# → Ver logs no terminal
```

---

## 📚 Documentação

```bash
# Abrir documentações

# Este projeto
code README.md
code CONFIGURACAO_STRIPE.md
code INICIO_RAPIDO.md

# Externas
# Next.js: https://nextjs.org/docs
# Stripe: https://stripe.com/docs
# Tailwind: https://tailwindcss.com/docs
```

---

## 💡 Dicas de Produtividade

```bash
# Atalhos VSCode úteis
# Ctrl+P: Buscar arquivo
# Ctrl+Shift+F: Buscar em todos os arquivos
# F2: Renomear variável/função
# Ctrl+`: Abrir terminal integrado

# Alias úteis (adicione ao .bashrc ou .zshrc)
alias dev="npm run dev"
alias build="npm run build"
alias stripe-listen="stripe listen --forward-to localhost:3000/api/webhook"
```

---

**Referência rápida sempre à mão!** 📖✨
