# Contexto: [Nome da Feature]
**Projeto:** [nome]
**Tipo:** frontend-only
**Iniciado em:** [YYYY-MM-DD HH:MM]
**Última atualização:** [YYYY-MM-DD HH:MM]

## Objetivo
[O que essa feature entrega ao usuário final — 1-2 frases]

## Stack detectada
- **Framework:** [ex: Next.js 14 App Router / React + Vite / HTML+CSS puro]
- **Styling:** [ex: TailwindCSS 3.4 / CSS Modules / SCSS]
- **UI Library:** [ex: Radix UI / shadcn/ui / nenhuma]
- **Data Fetching:** [ex: TanStack Query / SWR / fetch nativo]
- **API consumida:** [ex: REST https://api.exemplo.com / mock data]

## Agentes convocados
| Agente | Fase | Status | Desbloqueado por |
|--------|------|--------|-----------------|
| Erwin | FASE 1 | pending | — |
| Isabelle | FASE 1 | pending | — |
| Link | FASE 2 | pending | Erwin + Isabelle |
| L | FASE 3 | pending | Link |
| Snake | FASE 3 | pending | Link |
| Nami | FASE 4 | pending | Link |
| Bulma | FASE 4 | pending | L + Snake |

## Decisões tomadas
| Decisão | Motivo | Agente | Data |
|---------|--------|--------|------|

## Estado atual
- **Fase atual:** FASE 1
- **Agentes concluídos:** —
- **Próximo passo:** Erwin + Isabelle em paralelo

## Assunções que os agentes devem respeitar
- [ex: usar `cn()` de `lib/utils` para classes condicionais]
- [ex: componentes com named exports, sem default export]
- [ex: sem Server Components — projeto é SPA puro]

## Critérios de aceite
- [ ] [critério 1]
- [ ] Responsivo mobile/desktop
- [ ] Sem warnings de acessibilidade (axe ou Lighthouse)
- [ ] Build passa
