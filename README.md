# 🐶 Projeto Maya - Site de Adoção de Animais

![Projeto Maya](https://img.shields.io/badge/Status-MVP-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

Site completo para ONG de adoção de animais com sistema de doações integrado ao Stripe.

---

## ✨ Funcionalidades

### 🏠 Página Inicial
- Hero principal com frase de impacto
- Seção "Sobre o Projeto" com missão e valores
- Animais em destaque para adoção
- Como ajudar (doação, voluntariado, apadrinhamento)
- Depoimentos de adotantes
- CTA final para doações
- Barra de progresso de meta mensal

### 🐾 Página de Adoção
- Listagem de todos os animais disponíveis
- Filtros por tipo (cães/gatos) e idade (filhotes)
- Cards com foto, nome, idade, temperamento
- Página individual de cada animal
- Galeria de fotos
- História detalhada
- Botão WhatsApp para contato direto

### 💚 Sistema de Doações
- **Doação única ou recorrente (mensal)**
- Valores pré-definidos (R$ 25, R$ 50, R$ 100, R$ 250)
- Campo para valor personalizado
- Integração completa com Stripe
- Checkout seguro
- Webhooks para registro de doações
- Página de agradecimento pós-doação

---

## 🎨 Identidade Visual

### Paleta de Cores
- **Marrom Quente** (`#5D4037`) - Tipografia principal
- **Verde Oliva** (`#8FBC8F`) - Fundos e CTAs
- **Verde Oliva Claro** (`#A8D5A8`) - Hover states
- **Azul Suave** (`#87CEEB`) - Destaques e elementos secundários
- **Bege** (`#F5F5DC`) - Background principal
- **Bege Escuro** (`#E8E8D0`) - Backgrounds alternativos

### Tipografia
- **Títulos**: Playfair Display (serif arredondada)
- **Corpo**: Inter (sans humanizada)

### Estilo
- Cantos arredondados (border-radius generoso)
- Cards com sombra suave
- Elementos orgânicos e acolhedores
- Animações sutis (hover, transitions)

---

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Pagamentos**: Stripe
- **Imagens**: Next/Image com otimização automática

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Conta no Stripe (para pagamentos)

### Passo a Passo

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Stripe Keys (obtenha em: https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui

# Webhook Secret (configure após criar webhook no Stripe)
STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui

# URL do site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Instalar Stripe SDK** (para habilitar pagamentos)
```bash
npm install stripe
```

4. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

5. Acesse: `http://localhost:3000`

---

## 💳 Configuração do Stripe

### 1. Criar Conta no Stripe
- Acesse: https://dashboard.stripe.com/register
- Complete o cadastro
- Ative o modo de teste

### 2. Obter as Chaves da API
1. Vá em **Developers** → **API keys**
2. Copie a **Publishable key** (começa com `pk_test_`)
3. Copie a **Secret key** (começa com `sk_test_`)
4. Cole no arquivo `.env.local`

### 3. Configurar Webhooks

Os webhooks permitem que o Stripe notifique sua aplicação sobre eventos (pagamentos, assinaturas, etc).

#### Desenvolvimento Local (Stripe CLI)

1. **Instalar Stripe CLI**
   - Windows: `scoop install stripe`
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: https://stripe.com/docs/stripe-cli#install

2. **Login**
```bash
stripe login
```

3. **Escutar webhooks localmente**
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

4. O CLI vai exibir um `webhook signing secret` (começa com `whsec_`). Copie e cole no `.env.local`

#### Produção

1. No dashboard do Stripe, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** e adicione ao `.env.local` em produção

### 4. Habilitar Código do Stripe

Nos arquivos:
- `app/api/create-checkout-session/route.ts`
- `app/api/webhook/route.ts`

**Descomente** as seções marcadas com `// IMPORTANT: Uncomment...`

---

## 🚀 Deploy

### Vercel (Recomendado)

1. **Faça push do código para GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Projeto Maya MVP"
git branch -M main
git remote add origin https://github.com/seu-usuario/projeto-maya.git
git push -u origin main
```

2. **Deploy na Vercel**
   - Acesse: https://vercel.com
   - Conecte seu repositório GitHub
   - Configure as variáveis de ambiente (.env.local)
   - Deploy!

3. **Atualizar URL no Stripe**
   - Após o deploy, pegue a URL do Vercel
   - Atualize a variável `NEXT_PUBLIC_SITE_URL`
   - Configure o webhook com a URL de produção

### Outras Plataformas
- **Netlify**: Suporta Next.js com plugin
- **Railway**: Deploy direto do GitHub
- **AWS Amplify**: Para projetos maiores

---

## 📁 Estrutura do Projeto

```
projeto-maya/
├── app/
│   ├── adocao/               # Página de adoção
│   │   ├── [id]/            # Página individual do animal
│   │   └── page.tsx
│   ├── api/
│   │   ├── create-checkout-session/  # API Stripe checkout
│   │   └── webhook/         # Webhook Stripe
│   ├── doacoes/             # Página de doações
│   │   ├── sucesso/         # Página de agradecimento
│   │   └── page.tsx
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Home page
├── components/
│   ├── home/                # Componentes da home
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Animals.tsx
│   │   ├── HowToHelp.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTAFinal.tsx
│   ├── Footer.tsx
│   └── Header.tsx
├── data/
│   └── animals.ts           # Dados dos animais (mock)
├── public/                  # Arquivos estáticos
├── .env.local.example       # Exemplo de variáveis de ambiente
├── next.config.js           # Configuração Next.js
├── package.json
├── tailwind.config.ts       # Configuração Tailwind
└── tsconfig.json
```

---

## 🐾 Gerenciar Animais

Atualmente, os animais são gerenciados no arquivo `data/animals.ts`.

### Adicionar Novo Animal

Edite `data/animals.ts` e adicione um novo objeto:

```typescript
{
  id: '9',
  name: 'Rex',
  type: 'dog', // ou 'cat'
  age: '2 anos',
  gender: 'male', // ou 'female'
  size: 'large', // 'small', 'medium', 'large'
  temperament: ['Leal', 'Protetor', 'Carinhoso'],
  story: 'Rex foi resgatado...',
  image: 'https://exemplo.com/imagem.jpg',
  images: ['url1', 'url2', 'url3'],
  isAdopted: false,
  isPuppy: false
}
```

### Futuro: Banco de Dados

Para produção, recomenda-se migrar para um banco de dados:

**Opções:**
- **Supabase** (PostgreSQL, fácil setup)
- **Firebase** (NoSQL, Google)
- **MongoDB Atlas** (NoSQL, grátis)
- **Prisma + PostgreSQL** (ORM TypeScript)

---

## 📊 Próximos Passos (Roadmap Pós-MVP)

### Curto Prazo
- [ ] Conectar banco de dados (Supabase)
- [ ] Painel administrativo para gerenciar animais
- [ ] Sistema de login para doadores
- [ ] Envio automático de emails (confirmação, agradecimento)
- [ ] Integração com Instagram (feed na home)

### Médio Prazo
- [ ] Sistema de apadrinhamento específico por animal
- [ ] Área do doador (histórico, recibos)
- [ ] Blog de resgates e novidades
- [ ] Dashboard de transparência financeira
- [ ] Sistema de voluntariado online

### Longo Prazo
- [ ] App mobile (React Native)
- [ ] Gamificação (badges, conquistas)
- [ ] CRM para gestão de doadores
- [ ] Integração com outras ONGs
- [ ] Sistema de eventos online

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte e Contato

- **Email**: contato@projetomaya.org
- **WhatsApp**: (11) 9 9999-9999
- **Instagram**: @projetomaya

---

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

---

## 💚 Agradecimentos

Obrigado por fazer parte dessa causa! Cada linha de código escrita aqui 
representa uma vida animal que pode ser transformada.

**Feito com 💚 para os animais**

---

## 🔧 Troubleshooting

### Erro: "Module not found: Can't resolve 'stripe'"
```bash
npm install stripe
```

### Erro: Variáveis de ambiente não encontradas
- Certifique-se de ter criado o arquivo `.env.local`
- Reinicie o servidor após alterar variáveis de ambiente

### Imagens não carregam
- Verifique se as URLs das imagens em `data/animals.ts` são válidas
- Para imagens locais, coloque em `public/` e use `/nome-da-imagem.jpg`

### Stripe checkout não funciona
- Verifique se descomentou o código nos arquivos de API
- Confirme que as chaves estão corretas no `.env.local`
- Use as chaves de **test mode** (começam com `pk_test_` e `sk_test_`)

---

## 📱 Contatos para Customização

Se precisar de ajuda para customizar ou expandir o projeto:

1. **Adicionar logo personalizada**: Substitua o ícone `<Heart />` nos componentes
2. **Mudar cores**: Edite `tailwind.config.ts`
3. **Adicionar mais seções**: Crie novos componentes em `components/`
4. **Integrar banco de dados**: Siga tutoriais do Supabase ou Firebase

---

**Versão**: 1.0.0 (MVP)  
**Última atualização**: Fevereiro 2026
