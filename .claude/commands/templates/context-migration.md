# Contexto: [Nome da Feature]
**Projeto:** [nome]
**Tipo:** migration
**Iniciado em:** [YYYY-MM-DD HH:MM]
**Última atualização:** [YYYY-MM-DD HH:MM]

## Objetivo
[Descrever o que está sendo migrado e por quê — ex: "Migrar autenticação de sessão para JWT. Motivo: compatibilidade com app mobile futuro."]

## Estado antes da migração
- **De:** [ex: Express.js + sessão em memória]
- **Para:** [ex: NestJS + JWT via cookie httpOnly]
- **Banco:** [ex: Prisma schema já existe, apenas novas tabelas]

## Stack detectada
- [ex: NestJS 10, TypeScript 5.3, Prisma, PostgreSQL]

## Agentes convocados
| Agente | Fase | Status | Responsabilidade |
|--------|------|--------|-----------------|
| Kakashi | FASE 1 | pending | ADR + estratégia de migração |
| Edward | FASE 2 | pending | Schema changes (se houver) |
| Geralt | FASE 2 | pending | Implementar novo código |
| L | FASE 3 | pending | Testes de regressão |
| Snake | FASE 3 | pending | Segurança do novo fluxo |
| Bulma | FASE 4 | pending | Deploy com feature flag |

## Decisões tomadas
| Decisão | Motivo | Agente | Data |
|---------|--------|--------|------|

## Estado atual
- **Fase atual:** FASE 1
- **Agentes concluídos:** —
- **Próximo passo:** Kakashi — criar ADR de estratégia de migração

## Restrições críticas
- [ ] Zero downtime (não pode parar o serviço)
- [ ] Rollback plan definido antes de iniciar FASE 4
- [ ] Dados existentes não podem ser perdidos
- [ ] [restrição específica do projeto]

## Risco de breaking changes
| Área | Risco | Mitigação |
|------|-------|-----------|
| [ex: sessões ativas de usuários] | [ex: serão invalidadas] | [ex: comunicar usuários antes do deploy] |
