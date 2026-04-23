---
description: "Use quando: quiser iniciar qualquer tarefa no Squad com orquestração automática, sem decidir manualmente quais agentes chamar."
allowed-tools: [Read, Edit, Write, Bash, Glob, Grep, Task, TodoRead, TodoWrite, Shell]
---

> ⚠️ **PROTOCOLO GLOBAL — TEAM** — Validação automática de kanban: `commands/PROTOCOLO-GLOBAL.md`

## PRÉ-AÇÃO OBRIGATÓRIA: Validar Kanban

**ANTES de interpretar qualquer input do usuário, SEMPRE executar:**

```powershell
c:\git\pessoal\squad\scripts\validate-kanban.ps1 -ProjectPath (Get-Location)
```

Este script:
- ✅ Verifica se `.claude/dashboard/kanban-data.js` existe
- ✅ Valida estrutura JSON
- ✅ Confirma campos obrigatórios (`project`, `basePath`, `agents`, `lelouch`)
- ✅ Procura por logo em `.claude/assets/`
- ✅ Abre dashboard automaticamente se tudo OK
- ❌ Se falhar, oferece bootstrap ou instruções manuais

### Resultado do `validate-kanban.ps1`

#### ✅ Se sucesso (kanban inicializado)
```
✅ Kanban encontrado
✅ Estrutura JSON válida
✅ Todos os campos obrigatórios presentes
✅ Logo encontrado: .claude/assets/logo.svg

────────────────────────────────────────────
KANBAN VALIDADO
────────────────────────────────────────────
Projeto:     axis-hub-ai
Feature:     Feature atual
Phase:       FASE 1 — Backend
Agentes:     19
Logo:        ✓ Encontrada
────────────────────────────────────────────
```

→ **Continue normalmente com `/lelouch`**

#### ❌ Se falho (kanban não inicializado)
```
❌ Kanban não encontrado em: .claude/dashboard/kanban-data.js

Este projeto ainda não tem kanban configurado.

OPÇÕES:

  1️⃣  BOOTSTRAP COMPLETO (recomendado)
      $ c:\git\pessoal\squad\scripts\bootstrap-squad.ps1 -ProjectPath '.'
      Isso vai: .claude/ + logo + hooks + instruções + abre dashboard

  2️⃣  SETUP MANUAL
      $ mkdir -p '.claude/{dashboard,commands,context,learnings}'
      $ copy 'c:\git\pessoal\squad\.claude\dashboard\*.js' '.\.claude\dashboard\'
```

→ **Execute bootstrap e tente `/team` novamente**

---

Você é um alias operacional para o **/lelouch**.

## Fluxo Completo

1. **Validação prévia** → `validate-kanban.ps1`
2. **Dry-run de roteamento** → `route-agents.ps1` com score explicável
3. **Se OK** → Execute exatamente como `/lelouch`
4. **Se falho** → Force bootstrap
5. **Durante execução** → Mantenha `PROTOCOLO-GLOBAL.md` ativo
6. **No fim** → Confirme todos agentes em `done` ou `idle`

### Dry-run obrigatório (roteador com score)

Após validar o kanban, execute sempre:

```powershell
c:\git\pessoal\squad\scripts\route-agents.ps1 -ProjectPath (Get-Location) -TaskDescription "<resumo da tarefa do usuario>" -AsOperational
```

Use o resultado para:
- definir agentes recomendados por score
- listar agentes excluídos por `notFor`
- decidir `single-agent` vs `multi-agent` antes de iniciar a execução
- copiar o bloco `DRY_RUN_SUMMARY_*` para plano/log operacional

## Como interpretar input do usuário

**Entrada (após kanban validado):**
```
/team "Implementar novo módulo de pagamento"
```

**Comportamento:** Exatamente como:
```
/lelouch "Implementar novo módulo de pagamento"
```

com as automações abaixo ligadas por padrão:

1. Execute o mesmo fluxo do `/lelouch` para orquestração completa
2. Aplique automaticamente o `commands/PROTOCOLO-GLOBAL.md`
3. Garanta atualização do `.claude/dashboard/kanban-data.js` no início e no fim
4. Garanta que Lelouch fique `running` enquanto houver agentes ativos
5. Ao final de execução com 2+ agentes, inclua retrospectiva com `/korosensei`

## Prioridade

Ordem de precedência em conflitos:
1. **Validação de kanban** (pré-ação obrigatória via `validate-kanban.ps1`)
2. **Fluxo do `/lelouch`** (orquestração principal)
3. **`PROTOCOLO-GLOBAL.md`** (regras do time)
4. **Instruções locais** (do projeto específico)
