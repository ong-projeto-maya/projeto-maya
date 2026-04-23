# Contexto: [Nome da Feature]
**Projeto:** [nome]
**Tipo:** fullstack
**Iniciado em:** [YYYY-MM-DD HH:MM]
**Última atualização:** [YYYY-MM-DD HH:MM]

## Objetivo
[O que essa feature entrega ao usuário final — 1-2 frases]

## Stack detectada
- **Frontend:** [ex: Next.js 14 App Router + TailwindCSS]
- **Backend:** [ex: NestJS 10 + Prisma + PostgreSQL]
- **Monorepo:** [ex: pnpm + Turborepo]
- **IA:** [ex: OpenAI GPT-4o via openai SDK / N/A]

## Agentes convocados
| Agente | Fase | Status | Desbloqueado por |
|--------|------|--------|-----------------|
| Erwin | FASE 1 | pending | — |
| Kakashi | FASE 1 | pending | — |
| Isabelle | FASE 1 | pending | Erwin |
| Edward | FASE 2 | pending | Kakashi |
| Geralt | FASE 2 | pending | Edward |
| Link | FASE 3 | pending | Geralt + Isabelle |
| 2B | FASE 3 | pending | Geralt |
| L | FASE 4 | pending | Geralt + Link |
| Snake | FASE 4 | pending | Geralt + Link |
| Bulma | FASE 5 | pending | L + Snake |
| Nami | FASE 5 | pending | Bulma |

## Decisões tomadas
| Decisão | Motivo | Agente | Data |
|---------|--------|--------|------|

## Estado atual
- **Fase atual:** FASE 1
- **Agentes concluídos:** —
- **Próximo passo:** Erwin + Kakashi em paralelo

## Assunções que os agentes devem respeitar
- [ex: usar UUID como PK — decidido por Edward em FASE 2]
- [ex: JWT via cookie httpOnly, não Authorization header]
- [ex: seguir padrão de módulos existentes em apps/api/src/modules/]

## Critérios de aceite da feature
- [ ] [critério 1]
- [ ] [critério 2]
- [ ] Build passa (`pnpm build`)
- [ ] Testes passam (`pnpm test`)
- [ ] Snake auditoria concluída sem bloqueantes
