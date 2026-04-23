---
description: "Use when: qualquer tarefa deste repositorio for executada com o Squad MGR Solutions. Garante uso de /team como alias de /lelouch, atualizacao de kanban no inicio/fim e registro de aprendizados."
applyTo: "**"
---

# Squad Automation - Guardrails Obrigatorios

- Se a tarefa envolver mais de um dominio (backend + frontend, codigo + testes, codigo + seguranca) ou se o usuario invocar `/team`, usar orquestracao com `/team` (alias operacional de `/lelouch`).
- Ao receber `/team`, direcionar os agentes especialistas aplicaveis e refletir essa execucao no `.claude/dashboard/kanban-data.js`.
- Antes de iniciar mudancas relevantes, atualizar `.claude/dashboard/kanban-data.js`.
- Ao iniciar execucao de agente: `status: "running"`, `task`, `startedAt`, `updatedAt`.
- Ao concluir: `status: "done"` (ou `"blocked"`), preencher `output[]`, `log` especifico e `updatedAt`.
- Se qualquer agente estiver `running`, `lelouch` deve estar `running`.
- Se houver surpresa ou erro nao previsto, registrar em `.claude/learnings/[agente].md`.
- Ao final de feature com 2+ agentes, executar retrospectiva com `/korosensei`.
