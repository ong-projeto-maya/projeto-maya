# 🚀 Início Rápido - Projeto Maya

Guia rápido para você rodar o projeto em **5 minutos**!

---

## ⚡ Setup Rápido (Sem Stripe)

Se você quer apenas ver o site funcionando sem configurar pagamentos:

### 1. Instalar Dependências

```bash
npm install
```

### 2. Criar Arquivo de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Iniciar o Servidor

```bash
npm run dev
```

### 4. Abrir no Navegador

```
http://localhost:3000
```

**Pronto!** ✅ O site está funcionando!

**Nota**: A página de doações mostrará uma mensagem de "Stripe pendente". 
Para habilitar doações, siga o próximo passo.

---

## 💳 Habilitar Doações (Com Stripe)

### Passo 1: Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Complete o cadastro
3. Confirme seu email

### Passo 2: Obter as Chaves

1. No dashboard, vá em **Developers** → **API keys**
2. Copie a **Publishable key** (pk_test_...)
3. Copie a **Secret key** (sk_test_...)

### Passo 3: Atualizar .env.local

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Passo 4: Instalar Stripe SDK

```bash
npm install stripe
```

### Passo 5: Descomentar Código

**Arquivo 1**: `app/api/create-checkout-session/route.ts`
- Descomente a linha 4: `const stripe = require('stripe')(...)`
- Descomente as linhas 14-47 (todo o bloco do stripe.checkout.sessions.create)
- **REMOVA** as linhas 50-54 (bloco temporário com erro)

**Arquivo 2**: `app/api/webhook/route.ts`
- Descomente a linha 6: `const stripe = require('stripe')(...)`
- Descomente as linhas 15-89 (todo o bloco de webhook)
- **REMOVA** as linhas 92-94 (bloco temporário)

### Passo 6: Reiniciar Servidor

```bash
# Ctrl + C para parar
npm run dev
```

### Passo 7: Testar Doação

1. Acesse: http://localhost:3000/doacoes
2. Escolha um valor
3. Clique em "Doar"
4. Use cartão de teste: `4242 4242 4242 4242`
5. Data: qualquer futura (ex: 12/34)
6. CVC: 123

**Pronto!** 🎉 Sistema de doações funcionando!

---

## 📱 Próximos Passos

### Personalizar o Site

1. **Logo**: Substitua o ícone `<Heart />` pela sua logo
2. **Cores**: Edite `tailwind.config.ts`
3. **Animais**: Adicione/edite em `data/animals.ts`
4. **Contatos**: Atualize números de WhatsApp e email

### Adicionar Seus Animais

Edite `data/animals.ts`:

```typescript
{
  id: '9',
  name: 'Seu Animal',
  type: 'dog', // ou 'cat'
  age: '3 anos',
  gender: 'male', // ou 'female'
  size: 'medium', // 'small', 'medium', 'large'
  temperament: ['Dócil', 'Carinhoso'],
  story: 'História do animal...',
  image: 'URL da imagem',
  images: ['URL1', 'URL2'],
  isAdopted: false,
  isPuppy: false
}
```

### Configurar Webhooks (Opcional para desenvolvimento)

Para receber notificações de pagamentos:

```bash
# Instalar Stripe CLI
scoop install stripe  # Windows
brew install stripe/stripe-cli/stripe  # Mac

# Login
stripe login

# Escutar webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

Copie o `whsec_...` e adicione ao `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

---

## 🚀 Deploy (Vercel)

### 1. Criar Repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/projeto-maya.git
git push -u origin main
```

### 2. Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em "New Project"
3. Importe seu repositório
4. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (criar novo no Stripe)
   - `NEXT_PUBLIC_SITE_URL` (URL da Vercel)
5. Deploy!

### 3. Configurar Webhook de Produção

1. No Stripe dashboard: **Developers** → **Webhooks**
2. Adicione endpoint: `https://seu-site.vercel.app/api/webhook`
3. Copie o signing secret
4. Atualize a variável `STRIPE_WEBHOOK_SECRET` na Vercel

**Pronto!** Seu site está no ar! 🎉

---

## 📚 Documentação Completa

- **README.md**: Documentação completa do projeto
- **CONFIGURACAO_STRIPE.md**: Guia detalhado do Stripe
- **data/animals.ts**: Gerenciar animais

---

## 🆘 Problemas Comuns

### Erro: "Module not found: stripe"
```bash
npm install stripe
```

### Erro: Variáveis de ambiente não encontradas
- Crie o arquivo `.env.local`
- Reinicie o servidor após editar

### Página de doações mostra erro
- Verifique se descomentou o código nos arquivos de API
- Confirme que as chaves do Stripe estão corretas

### Imagens não aparecem
- Use URLs válidas em `data/animals.ts`
- Para imagens locais, coloque em `public/`

---

## 💡 Dicas

✅ Comece simples: rode sem Stripe primeiro  
✅ Use modo de teste do Stripe (chaves pk_test_ e sk_test_)  
✅ Teste com cartão 4242 4242 4242 4242  
✅ Configure webhooks depois do deploy  
✅ Personalize cores, textos e imagens  

---

## 📞 Ajuda

Precisa de ajuda? Consulte:
- README.md (documentação completa)
- CONFIGURACAO_STRIPE.md (guia do Stripe)
- https://stripe.com/docs (documentação Stripe)

---

**Boa sorte com o Projeto Maya!** 🐶💚
