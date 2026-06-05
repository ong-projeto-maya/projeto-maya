---
description: "Use when: qualquer tarefa deste repositorio for executada com o Squad MGR Solutions. Garante uso de /team como alias de /lelouch, atualizacao do portal Axiom Delivery AI no inicio/fim e registro de aprendizados."
applyTo: "**"
---

# Squad Automation - Guardrails Obrigatorios

- Se a tarefa envolver mais de um dominio (backend + frontend, codigo + testes, codigo + seguranca) ou se o usuario invocar `/team`, usar orquestracao com `/team` (alias operacional de `/lelouch`).
- Ao receber `/team`, direcionar os agentes especialistas aplicaveis e registrar a execucao no portal Axiom Delivery AI via API REST (http://localhost:3000).
- NUNCA atualizar `.claude/dashboard/kanban-data.js` — esse arquivo e o dashboard antigo e nao e mais utilizado.
- Ao iniciar execucao de agente: chamar `POST http://localhost:3000/api/agent/run` com `{agentId, projectId, taskTitle, idempotencyKey}`.
- Ao concluir: chamar `PATCH http://localhost:3000/api/agent/run/:ikey` com `{status: "done", output: [...]}`.
- Ao iniciar tasks do sprint: chamar `PATCH http://localhost:3000/api/tasks/:projectId/:taskId` com `{status: "in-progress"}`.
- Ao concluir tasks: chamar `PATCH http://localhost:3000/api/tasks/:projectId/:taskId` com `{status: "done"}`.
- Se qualquer agente estiver `running`, lelouch deve estar registrado como `running` no portal.
- Se houver surpresa ou erro nao previsto, registrar em `.claude/learnings/[agente].md`.
- Ao final de feature com 2+ agentes, executar retrospectiva com `/korosensei`.
