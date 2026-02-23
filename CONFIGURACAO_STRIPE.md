# 💳 Guia Completo de Configuração do Stripe

Este guia explica passo a passo como configurar o Stripe para aceitar doações no Projeto Maya.

---

## 📋 Pré-requisitos

- Conta criada no Stripe (https://dashboard.stripe.com/register)
- Node.js instalado
- Projeto Maya rodando localmente

---

## 🔑 Parte 1: Obter Chaves da API

### 1. Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Preencha seus dados
3. Confirme seu email
4. Complete o onboarding

### 2. Ativar Modo de Teste

- O Stripe automaticamente começa em modo de teste
- Você verá um banner "Viewing test data" no topo
- Use este modo para testar sem cobranças reais

### 3. Obter as Chaves

1. No dashboard, vá em: **Developers** → **API keys**
2. Você verá duas chaves:

   **Publishable key (Chave Pública)**
   ```
   pk_test_51ABC...xyz
   ```
   - Pode ser exposta no frontend
   - Usada para inicializar o Stripe.js

   **Secret key (Chave Secreta)**
   ```
   sk_test_51ABC...xyz
   ```
   - NUNCA exponha esta chave
   - Usada apenas no backend

3. Copie ambas as chaves

### 4. Adicionar ao Projeto

Abra o arquivo `.env.local` (crie se não existir) e adicione:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Importante**: Reinicie o servidor após alterar `.env.local`

---

## 🎣 Parte 2: Configurar Webhooks

Webhooks são necessários para que o Stripe notifique seu site sobre eventos 
(pagamentos concluídos, assinaturas criadas, etc).

### Opção A: Desenvolvimento Local (Stripe CLI)

Recomendado para testar localmente.

#### 1. Instalar Stripe CLI

**Windows (via Scoop)**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**macOS (via Homebrew)**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

#### 2. Fazer Login

```bash
stripe login
```

- Isso abrirá seu navegador
- Autorize o acesso
- Volte ao terminal

#### 3. Escutar Webhooks

Com seu servidor Next.js rodando (`npm run dev`), execute:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Você verá algo como:

```
> Ready! Your webhook signing secret is whsec_abc123xyz... (^C to quit)
```

#### 4. Copiar o Webhook Secret

Copie o `whsec_...` e adicione ao `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz...
```

#### 5. Testar Webhooks

Em outro terminal, simule um evento:

```bash
stripe trigger checkout.session.completed
```

Você deve ver logs no terminal onde rodou `stripe listen`.

---

### Opção B: Produção (Webhook no Dashboard)

Para deploy em produção (Vercel, Netlify, etc).

#### 1. Fazer Deploy do Site

Primeiro, faça deploy do seu site e anote a URL, exemplo:
```
https://projeto-maya.vercel.app
```

#### 2. Criar Webhook no Dashboard

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. Preencha:
   - **Endpoint URL**: `https://projeto-maya.vercel.app/api/webhook`
   - **Description**: "Projeto Maya - Webhook de Doações"
   - **Events to send**: Selecione:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Clique em **Add endpoint**

#### 3. Obter o Signing Secret

1. Após criar, clique no webhook
2. Na seção **Signing secret**, clique em **Reveal**
3. Copie o secret (começa com `whsec_`)

#### 4. Adicionar às Variáveis de Ambiente (Produção)

No seu provedor de hosting (Vercel, Netlify, etc):

1. Vá em **Settings** → **Environment Variables**
2. Adicione todas as variáveis:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
   ```
3. Faça redeploy

---

## 🔓 Parte 3: Habilitar o Código do Stripe

Por padrão, o código do Stripe está comentado. Você precisa descomentá-lo.

### 1. Instalar o SDK do Stripe

```bash
npm install stripe
```

### 2. Descomentar Código em `create-checkout-session/route.ts`

Abra: `app/api/create-checkout-session/route.ts`

**Descomente** as linhas 4-47:

```typescript
// REMOVA OS COMENTÁRIOS:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const { amount, donationType } = await request.json()

    if (!amount || amount < 5) {
      return NextResponse.json(
        { error: 'Valor mínimo de R$ 5,00' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      // ... resto do código
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    // ...
  }
}
```

**REMOVA** o bloco temporário (linhas 50-54):

```typescript
// REMOVA ESTAS LINHAS:
return NextResponse.json({
  error: 'Configuração do Stripe pendente...'
}, { status: 400 })
```

### 3. Descomentar Código em `webhook/route.ts`

Abra: `app/api/webhook/route.ts`

**Descomente** as linhas 6-90:

```typescript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      // ...
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // ... seu código aqui
        break
      // ...
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    // ...
  }
}
```

### 4. Reiniciar o Servidor

```bash
# Ctrl + C para parar
npm run dev
```

---

## ✅ Parte 4: Testar o Sistema

### 1. Acessar Página de Doações

```
http://localhost:3000/doacoes
```

### 2. Fazer uma Doação de Teste

1. Selecione um valor (ex: R$ 50)
2. Escolha "Doação Única" ou "Doação Mensal"
3. Clique em "Doar"

### 3. Usar Cartão de Teste

O Stripe fornece cartões de teste. Use:

**Cartão de Sucesso:**
```
Número: 4242 4242 4242 4242
Data: Qualquer data futura (ex: 12/34)
CVC: Qualquer 3 dígitos (ex: 123)
CEP: Qualquer (ex: 12345)
```

**Outros Cartões de Teste:**
- `4000 0025 0000 3155` - Requer autenticação 3D Secure
- `4000 0000 0000 9995` - Pagamento negado

Lista completa: https://stripe.com/docs/testing#cards

### 4. Verificar Webhook

Se você rodou `stripe listen`, deve ver logs no terminal:

```
[200] POST /api/webhook
checkout.session.completed
```

### 5. Verificar no Dashboard

1. Acesse: https://dashboard.stripe.com/test/payments
2. Você deve ver o pagamento de teste
3. Em **Eventos**: https://dashboard.stripe.com/test/events
4. Você verá o evento `checkout.session.completed`

---

## 🚀 Parte 5: Ir para Produção

Quando estiver pronto para aceitar doações reais:

### 1. Ativar Conta do Stripe

1. No dashboard, complete o cadastro da empresa
2. Forneça informações bancárias para receber pagamentos
3. Envie documentação necessária

### 2. Obter Chaves de Produção

1. No dashboard, **desative** o modo de teste (toggle no topo)
2. Vá em **Developers** → **API keys**
3. Copie as chaves de produção (começam com `pk_live_` e `sk_live_`)

### 3. Atualizar Variáveis de Ambiente (Produção)

No seu provedor de hosting:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave
STRIPE_SECRET_KEY=sk_live_sua_chave
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_de_producao
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

### 4. Criar Webhook de Produção

Repita o processo da **Opção B** acima, mas com as chaves de produção.

### 5. Testar com Pagamento Real

⚠️ **Atenção**: Agora os pagamentos são reais!

Faça um teste com um valor pequeno (R$ 5) para garantir que tudo funciona.

---

## 🔍 Monitoramento e Logs

### Ver Pagamentos

- Teste: https://dashboard.stripe.com/test/payments
- Produção: https://dashboard.stripe.com/payments

### Ver Assinaturas (Doações Mensais)

- Teste: https://dashboard.stripe.com/test/subscriptions
- Produção: https://dashboard.stripe.com/subscriptions

### Ver Eventos e Webhooks

- Teste: https://dashboard.stripe.com/test/webhooks
- Produção: https://dashboard.stripe.com/webhooks

### Logs do Webhook

No Next.js, os logs aparecem no terminal onde você rodou `npm run dev`.

Em produção (Vercel), veja em: **Deployments** → **Functions** → **Logs**

---

## 🛠️ Troubleshooting

### "No webhook signing secret found"

- Certifique-se de que `STRIPE_WEBHOOK_SECRET` está no `.env.local`
- Reinicie o servidor

### "Invalid API Key"

- Verifique se copiou as chaves corretas (test vs live)
- Não deixe espaços em branco

### Webhook não está sendo chamado (local)

- Certifique-se de que `stripe listen` está rodando
- Verifique se a porta é 3000 (`localhost:3000/api/webhook`)
- Use `stripe listen --log-level debug` para mais detalhes

### Pagamento funciona mas webhook não

- Verifique se o webhook está ativo no dashboard
- Confirme a URL do webhook
- Veja os logs de erro no dashboard: **Developers** → **Webhooks** → (seu webhook) → **Recent events**

### "Customer email is null"

Isso é normal em modo de teste. Em produção, o Stripe coleta o email.

---

## 📚 Recursos Úteis

- **Documentação Stripe**: https://stripe.com/docs
- **Dashboard**: https://dashboard.stripe.com
- **Cartões de Teste**: https://stripe.com/docs/testing
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
- **Status do Stripe**: https://status.stripe.com

---

## 🔐 Segurança

- ✅ NUNCA exponha `STRIPE_SECRET_KEY` no frontend
- ✅ NUNCA commite `.env.local` no Git
- ✅ Use HTTPS em produção (obrigatório pelo Stripe)
- ✅ Valide webhooks com o signing secret
- ✅ Use modo de teste até estar 100% pronto

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do terminal
2. Consulte o dashboard do Stripe
3. Leia a documentação do Stripe
4. Abra uma issue no GitHub do projeto

---

**Pronto!** 🎉 Seu sistema de doações está configurado e funcionando!
