# Projeto de teste do Supabase

O site tem dois bancos no Supabase, os dois na organização "Projeto Maya":

| Projeto | Para quê | Dados |
|---|---|---|
| `projeto-maya` | **Produção.** O site no ar lê daqui | Reais: animais, doadores, doações |
| `teste-funcionarios-projeto-maya` | Desenvolver e testar sem risco | **Só de mentira.** Os 8 animais fictícios do `supabase/seed.sql` e uma admin de teste |

Criado em 17/11/2026 para o painel financeiro (Bruno) e para o Eduardo e o João trabalharem em cima do mesmo banco de teste.

## Regras

- **Nunca** copiar dado real da ONG, de doador ou do Mercado Pago para o projeto de teste.
- **Nunca** rodar `supabase/seed.sql` em produção: ele tem animais e uma campanha inventados.
- Antes de rodar qualquer SQL ou script de banco, conferir o nome do projeto no alto do painel do Supabase. O token pessoal do Supabase (`sbp_...`) vale para **todos** os projetos da conta, inclusive produção.
- Mudança de estrutura entra primeiro como migration em `supabase/migrations/`, roda no teste e só depois em produção.

## Como o banco de teste foi montado

1. Todas as migrations de `supabase/migrations/`, em ordem, e depois o `supabase/seed.sql`, coladas num arquivo só no SQL Editor do projeto de teste. O arquivo começava com uma trava que parava se a tabela `animais` já existisse.
2. Admin de teste criada em Authentication > Users (com Auto Confirm) e cadastrada em `admin_users` com `username = 'admin-teste'`.

Para aplicar uma migration nova no teste: colar o arquivo no SQL Editor do teste, ou rodar `npm run db:migrate` com `SUPABASE_URL` do **teste**.

## Testes ponta a ponta com login

- Arquivos `e2e/admin-*.spec.ts`, no projeto `admin` do `playwright.config.ts`.
- No CI rodam no job "E2E com login (projeto de teste)", com quatro segredos do repositório: `TESTE_SUPABASE_URL`, `TESTE_SUPABASE_PUBLISHABLE_KEY`, `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD`. Todos do projeto de teste.
- O job de e2e comum continua usando um Supabase falso e pula esses testes.

Para rodar na sua máquina, com o site apontando para o projeto de teste no `.env.local`:

```bash
E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... npx playwright test --project=admin
```

O Playwright não lê o `.env.local`; as duas variáveis precisam estar no terminal.
