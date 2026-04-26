<div align="center">

# Projeto Maya

**Plataforma de adocao responsavel de animais**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Sobre

**Projeto Maya** conecta animais resgatados com familias amorosas. A plataforma permite que ONGs e protetores cadastrem animais para adocao, e que adotantes encontrem seu companheiro ideal — com processo transparente, rastreavel e seguro.

## Funcionalidades

- **Catalogo de animais** — busca por especie, porte, cidade e comportamento
- **Processo de adocao** — formulario, triagem e acompanhamento
- **Doacoes online** — integracao com Stripe para suporte financeiro as ONGs
- **Painel do protetor** — cadastro e gestao de animais resgatados
- **Autenticacao** — login seguro via Supabase Auth

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Pagamentos | Stripe |
| Testes | Playwright (e2e) |

## Comecando

### Pre-requisitos

- Node.js 20+, pnpm
- Conta Supabase e Stripe (para pagamentos)

### Instalacao

```bash
git clone https://github.com/marcelogourod/projeto-maya.git
cd projeto-maya
pnpm install
cp .env.example .env.local   # configurar SUPABASE_URL, STRIPE_KEY
pnpm dev
```

---

<div align="center">Desenvolvido por <strong><a href="https://mgrsolutions.com.br">MGR Solutions</a></strong></div>
