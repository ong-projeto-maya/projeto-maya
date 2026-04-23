# Contexto: [Nome da Feature]
**Projeto:** [nome]
**Tipo:** backend-only
**Iniciado em:** [YYYY-MM-DD HH:MM]
**Última atualização:** [YYYY-MM-DD HH:MM]

## Objetivo
[O que essa API/serviço entrega — 1-2 frases]

## Stack detectada
- **Runtime:** [ex: Node 20 / Python 3.12 / Go 1.22]
- **Framework:** [ex: NestJS 10 / FastAPI 0.110 / Echo / Express]
- **ORM/DB:** [ex: Prisma + PostgreSQL / SQLAlchemy + MySQL / GORM + SQLite]
- **Auth:** [ex: JWT + Passport / OAuth2 / API Key]
- **Fila/Jobs:** [ex: Bull + Redis / Celery / N/A]
- **IA:** [ex: OpenAI GPT-4o / Anthropic Claude / N/A]
- **Deploy:** [ex: Railway / Fly.io / AWS Lambda / Docker]
- **Package manager:** [ex: pnpm / npm / poetry / cargo]

## Agentes convocados
| Agente | Fase | Status | Desbloqueado por |
|--------|------|--------|-----------------|
| Kakashi | FASE 1 | pending | — |
| Edward | FASE 1 | pending | — |
| Geralt | FASE 2 | pending | Edward + Kakashi |
| 2B | FASE 2 | pending | Geralt (se IA) |
| L Lawliet | FASE 3 | pending | Geralt |
| Snake | FASE 3 | pending | Geralt |
| Levi | FASE 3 | pending | Geralt |
| Bulma | FASE 4 | pending | L Lawliet + Snake |
| Nami | FASE 4 | pending | Bulma |

**Agentes não convocados neste contexto:**
- Link, Isabelle — sem interface frontend nesta feature
- Erwin, Holo — escopo já definido (adicione se feature é nova para o produto)
- Dio — sem impacto de marketing/growth direto
- Light — métricas serão coletadas se feature tiver analytics endpoint

## Decisões tomadas
| Decisão | Motivo | Agente | Data |
|---------|--------|--------|------|

## Estado atual
- **Fase atual:** FASE 1
- **Agentes concluídos:** —
- **Próximo passo:** Kakashi + Edward em paralelo

## Assunções que os agentes devem respeitar
- [ex: usar UUID como PK — decidido por Edward em FASE 1]
- [ex: autenticação via JWT no header Authorization, não cookie]
- [ex: hexagonal architecture — domain sem importar infra]
- [ex: todos os endpoints versionados em /api/v1/]

## Arquivos de referência do projeto
- Schema Prisma: `[path/schema.prisma]`
- Módulo exemplo: `[path/modules/auth/]`
- DTO exemplo: `[path/dtos/]`
- Swagger configurado em: `[path/main.ts]`

## Endpoints a implementar
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /api/v1/[recurso] | JWT | Criar |
| GET | /api/v1/[recurso] | JWT | Listar |
| GET | /api/v1/[recurso]/:id | JWT | Buscar por ID |
| PATCH | /api/v1/[recurso]/:id | JWT | Atualizar |
| DELETE | /api/v1/[recurso]/:id | JWT | Remover (soft delete) |

## Critérios de aceite
- [ ] Todos os endpoints respondem com status codes corretos
- [ ] Validação com class-validator em todos os DTOs de input
- [ ] Swagger documentado para todos os endpoints
- [ ] Testes unitários dos use cases (cobertura ≥ 80%)
- [ ] Snake: nenhuma vulnerabilidade crítica ou alta
- [ ] Levi: correctness review aprovado
- [ ] Build passa (`pnpm build` ou equivalente)
- [ ] Testes passam (`pnpm test` ou equivalente)
