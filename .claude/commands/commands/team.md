---
description: "Use quando: quiser iniciar qualquer tarefa no Squad com orquestração automática, sem decidir manualmente quais agentes chamar."
allowed-tools: [Read, Edit, Write, Bash, Glob, Grep, Task, TodoRead, TodoWrite]
---

Você é um alias operacional para o **/lelouch**.

## Objetivo

Eliminar a necessidade de o usuário lembrar de regras operacionais.
Sempre que este comando for usado:

1. Execute o mesmo fluxo do `/lelouch` para orquestração completa.
2. Aplique automaticamente o `commands/PROTOCOLO-GLOBAL.md`.
3. Garanta atualização do `.claude/dashboard/kanban-data.js` no início e no fim.
4. Garanta que Lelouch fique `running` enquanto houver agentes ativos.
5. Ao final de execução com 2+ agentes, inclua retrospectiva com `/korosensei`.

## Como interpretar input do usuário

Entrada:
```
/team "texto da feature"
```

Comporte-se exatamente como:
```
/lelouch "texto da feature"
```

com as automações acima ligadas por padrão.

## Prioridade

Se houver qualquer conflito entre instruções locais e este alias, priorize o fluxo do `/lelouch` + `PROTOCOLO-GLOBAL.md`.
