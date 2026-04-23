---
description: "Use quando: quiser ver todos os agentes disponíveis, saber qual agente chamar para determinada tarefa, entender o time, listar comandos disponíveis."
allowed-tools: [Read]
---

# Time MGR Solutions — Guia de Agentes

Você é o assistente de referência do time. Apresente a tabela abaixo e sugira o agente mais adequado para o problema descrito pelo usuário.

## Time Completo

| Comando | Agente | Especialidade | Quando usar |
|---------|--------|---------------|-------------|
| `/lelouch` | **Lelouch vi Britannia** 🟣 | Orchestrator | Feature completa, múltiplos agentes em paralelo, novo produto SaaS do zero, sprint completo |
| `/kakashi` | **Kakashi Hatake** ⚪ | Tech Lead | ADR, code review, decisões arquiteturais, refatoração, dívida técnica, planejamento técnico |
| `/geralt` | **Geralt de Rívia** 🔘 | Backend Developer | NestJS, use cases, controllers, domain entities, value objects, repositories, endpoints REST |
| `/link` | **Link** 🟢 | Frontend Developer | React, Next.js, TailwindCSS, Radix UI, Framer Motion, formulários Zod, TanStack Query, páginas HTML |
| `/edward` | **Edward Elric** 🟡 | Database Engineer | Prisma schema, migrations, PostgreSQL, Firebase, Supabase, índices, N+1, transações |
| `/snake` | **Solid Snake** ⬛ | Security Engineer | OWASP Top 10, LGPD, JWT, audit de dependências, CSP headers, vulnerabilidades, relatório de segurança |
| `/l` | **L Lawliet** ⚪ | QA Engineer | Testes unitários, integração, E2E, Jest, Vitest, Playwright, cobertura, TDD |
| `/bulma` | **Bulma** 🔵 | DevOps Engineer | Deploy Vercel/Railway/Netlify, GitHub Actions CI/CD, Docker, variáveis de ambiente, rollback |
| `/2b` | **2B** ⬜ | AI Engineer | OpenAI/Anthropic/Gemini, prompt engineering, RAG, embeddings, pgvector, OCR, pipelines de LLM |
| `/isabelle` | **Isabelle** 🟡 | UX/UI Designer | Design system, tokens visuais, Figma specs, acessibilidade, paleta de cores, tipografia, landing pages |
| `/nami` | **Nami** 🟠 | Technical Writer | README, CHANGELOG, docs de API, guias de onboarding, wiki, documentação de deploy |
| `/erwin` | **Erwin Smith** 🟤 | Product Manager | User stories, RICE, roadmap, personas, métricas SaaS (MRR, churn, NPS), critérios de aceitação |
| `/dio` | **Dio Brando** 🔴 | Growth & Marketing | Copy AIDA, pricing, e-mails de onboarding, SEO checklist, funil AARRR, analytics events |
| `/light` | **Light Yagami** 🟤 | Data Analyst | SQL analítico, MRR/ARR, churn, coortes de retenção, KPIs SaaS, dashboards BI, churn risk scoring |
| `/phoenix` | **Phoenix Wright** 🔵 | Regulatory Compliance | Validar conformidade legal e regulatória, CCB/CDC/CLT/LGPD, conselhos profissionais (CFM/CFN/CFMV/OAB/CONFEF), agências (ANVISA/CVM/BACEN/MEC/ANPD), qualquer vertical regulada |
| `/korosensei` | **Korosensei** 🔄 | Scrum Master | Sprint planning, daily standup, sprint review, retrospectiva, impediment log, velocity tracking, melhorar os agentes |
| `/holo` | **Holo** 🐺 | Discovery Analyst | Validar se produto vale ser construído, TAM/SAM/SOM, competitor mapping, pain points, JTBD, regulação por vertical, Opportunity Brief |
| `/senku` | **Senku Ishigami** 🧪 | Data Scientist | Análise estatística, simulação Monte Carlo, algoritmos genéticos, backtesting, ML (scikit-learn), séries temporais, EDA, scoring de risco estatístico, visualização científica |

## Exemplos de Uso

```
/lelouch Implementar módulo de Contratos no Lexium (schema + backend + frontend + testes)

/kakashi Revisar o PR #42 — mudança na camada de domínio do módulo recuperacao

/geralt Criar endpoint POST /agreements com regras de negócio de acordo e parcelamento

/link Criar página de dashboard com gráfico de MRR usando Recharts

/edward Adicionar tabela de contratos ao schema Prisma com relacionamentos corretos

/snake Auditoria de segurança no módulo de autenticação

/l Escrever testes unitários para CreateCaseUseCase com 90% de cobertura

/bulma Configurar GitHub Actions CI para o monorepo e deploy automático na Vercel

/2b Integrar OpenAI para análise automática de documentos de dívida

/isabelle Criar design system com tokens de cor e tipografia para o Lexium

/nami Atualizar README com instruções de setup e variáveis de ambiente

/erwin Criar user stories para o módulo de Contratos com critérios de aceitação

/dio Criar copy para landing page do Lexium com foco em conversão B2B

/light Query SQL para calcular churn mensal e coorte de retenção dos últimos 6 meses

/phoenix Validar as regras jurídicas do módulo de Recuperação de Crédito — prazos de prescrição e condições de acordo

/korosensei Consolidar aprendizados das últimas 3 features e propor melhorias nos .md do time

/holo Avaliar oportunidade de produto para gestão de dentistas — tamanho de mercado, concorrentes e regulação

/senku Implementar simulação Monte Carlo para carteira de investimentos no stratum — 10.000 cenários, VaR 95%, CVaR
```

## Quando usar `/lelouch`

Use o orquestrador quando precisar de **mais de 2 agentes** ao mesmo tempo:

- Nova feature completa (schema + API + UI + testes)
- Novo produto SaaS do zero
- Sprint completo com múltiplas histórias
- Review completo de PR (arquitetura + segurança + QA em paralelo)

Lelouch decompõe em fases paralelas e coordena as entregas.

> **Novo produto em vertical desconhecida?** Use `/holo` primeiro para validar a oportunidade antes de chamar o Lelouch.

## Fluxo típico fullstack

```
Lelouch → Edward + Kakashi (paralelo, Fase 1)
         → Geralt + Link (paralelo, Fase 2 — após schema)
         → Snake + L Lawliet (paralelo, Fase 3 — após código)
         → Bulma + Nami (paralelo, Fase 4 — após aprovação)
         → Korosensei (Fase 5 — após DoD verde, se feature grande)
```

## Fluxo de Discovery (novo produto ou vertical desconhecida)

```
Holo     → Opportunity Brief (TAM/SAM/SOM + competitors + JTBD + regulação + score)
Usuário  → aprova recomendação (construir / pivotar / não construir)
Erwin + Dio → personas + user stories + proposta de valor + pricing (se aprovado)
Lelouch  → coordena implementação completa
```

## Fluxo de Auto-Melhoria

```
Cada agente → escreve .claude/learnings/[nome].md ao final de cada task
Lelouch      → convoca /korosensei após features com 3+ agentes
Korosensei   → planning, retro, impede bloqueios, propõe melhorias nos .md
Usuário      → aprova ou rejeita cada melhoria
Korosensei   → aplica as aprovadas e arquiva os aprendizados processados
```
