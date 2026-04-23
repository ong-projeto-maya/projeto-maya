---
description: "Playbook para scaffoldar um novo módulo SaaS B2B completo: autenticação multi-tenant, billing, onboarding, analytics e deploy. Use quando: novo produto SaaS do zero, novo módulo com subscription, feature com paywall."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Novo Módulo SaaS

Use este playbook como input para o `/lelouch` ao invés de descrever o escopo do zero.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/novo-modulo-saas.md] para o módulo [Nome do Módulo]
```

## Escopo Padrão

- Autenticação multi-tenant (JWT + Organization/Workspace)
- CRUD do domínio principal com soft delete
- Controle de acesso por papel (RBAC: admin / member / viewer)
- Endpoint de billing (Stripe checkout session + webhook)
- Onboarding flow (steps guiados, completude %)
- Analytics: eventos de ativação, retenção 7/30 dias
- Deploy com CI/CD + health check + rollback

## Fases e Agentes

### FASE 1 — Definição (paralelo)
| Agente | Entrega |
|--------|---------|
| **Erwin** | PRD: personas, user stories, critérios de aceite, roadmap v1 |
| **Holo** | Opportunity Brief: TAM/SAM, concorrentes, gaps a explorar (se vertical nova) |
| **Phoenix** | Checklist legal: LGPD, CCB, regulação específica do setor |

### FASE 2 — Arquitetura (sequencial: após Erwin)
| Agente | Entrega |
|--------|---------|
| **Kakashi** | ADR: estrutura de módulo, multi-tenancy, RBAC pattern |
| **Isabelle** | Design tokens, componentes do módulo, fluxo de onboarding |

### FASE 3 — Dados (após Kakashi)
| Agente | Entrega |
|--------|---------|
| **Edward** | Schema: entidades do módulo + Organization + Subscription + AuditLog |

### FASE 4 — Implementação (paralelo, após Edward + Isabelle)
| Agente | Entrega |
|--------|---------|
| **Geralt** | Use cases, controllers, guards RBAC, webhook Stripe |
| **2B** | Integração LLM (se houver feature de IA no módulo) |

### FASE 5 — Frontend (após Geralt + Isabelle)
| Agente | Entrega |
|--------|---------|
| **Link** | Páginas do módulo, componentes, onboarding wizard |
| **Dio** | Copy landing page, CTAs, pricing, funil |

### FASE 6 — Qualidade (paralelo, após Geralt + Link)
| Agente | Entrega |
|--------|---------|
| **L Lawliet** | Testes unitários (use cases), integração (endpoints), e2e (fluxo crítico) |
| **Snake** | Auditoria OWASP: RBAC, webhook signature, rate limiting, LGPD |

### FASE 6.5 — Code Review (após L Lawliet + Snake)
| Agente | Entrega |
|--------|---------|
| **Levi** | Revisão de correctness/completeness: lógica de RBAC, casos de borda do billing, isolamento de tenant, idempotência do webhook |

### FASE 7 — Entrega (paralelo, após Levi)
| Agente | Entrega |
|--------|---------|
| **Bulma** | CI/CD, envs, health check, deploy em staging |
| **Nami** | README do módulo, CHANGELOG, docs de API |

### FASE 8 — Pós-launch (após deploy)
| Agente | Entrega |
|--------|---------|
| **Light** | Dashboard de KPIs (ativação, retenção, MRR), alertas |
| **Korosensei** | Retrospectiva, learnings, velocity |

## Assunções padrão deste playbook

- Usar UUID como PK em todas as entidades
- Soft delete via `deletedAt: DateTime?` — nunca `DELETE` físico
- Multi-tenancy via `organizationId` em todas as tabelas do módulo
- JWT com `userId` + `organizationId` + `role` no payload
- Stripe Checkout + webhook para billing (não integração direta de card)
- PostHog para analytics de produto

## Critérios de aceite mínimos

- [ ] Usuário consegue criar conta → completar onboarding → acessar módulo em < 5 min
- [ ] Usuário de um tenant não vê dados de outro tenant (teste de isolamento obrigatório)
- [ ] Webhook Stripe processa pagamento sem duplicar (idempotency key)
- [ ] Build CI passando, deploy em staging aprovado
- [ ] Snake sem bloqueantes críticos (severidade 🔴)
- [ ] Levi sem findings 🔴 (correctness review aprovado)
