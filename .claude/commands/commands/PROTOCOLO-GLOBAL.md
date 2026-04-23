# PROTOCOLO GLOBAL DO SQUAD — Invariantes do Sistema

> **Este arquivo é a fonte verdade** das regras que se aplicam a **todos os agentes**, independente do projeto, contexto ou quem invocou o agente.
>
> Cada arquivo de agente referencia estas regras em um bloco compacto no topo. Se houver conflito entre uma regra de agente e este protocolo, **este protocolo vence**.

---

## INVARIANTE 1 — Kanban Sempre Atualizado

O arquivo `.claude/dashboard/kanban-data.js` **reflete o estado real da execução em tempo real**. Esta é a única fonte de verdade sobre o que está acontecendo.

### Ciclo de vida obrigatório de cada agente

#### Ao iniciar qualquer tarefa
```javascript
// Você (o agente sendo invocado) deve atualizar seu próprio registro:
{
  id: "seu-id",             // ex: "geralt", "levi", "edward"
  status: "running",
  task: "descrição clara e específica do que vai fazer",
  startedAt: Date.now(),
  log: "iniciando — [descrição breve do approach]"
}
```

#### Ao concluir
```javascript
{
  id: "seu-id",
  status: "done",
  output: [
    "apps/api/src/modules/contratos/domain/contrato.entity.ts",
    "apps/api/src/modules/contratos/application/use-cases/criar-contrato.use-case.ts"
  ],
  log: "CriarContratoUseCase implementado com validação de prazo. Porta IContratoRepository injetada. Migration 20260414_contratos aplicada."
}
```

**Formato do campo `log` — seja específico:**
```
// ❌ Inútil para o próximo agente
log: "Concluído"
log: "Implementado com sucesso"

// ✅ O próximo agente entende sem reler o código
log: "Schema Prisma: model Contract com índice composto [tenantId, status]. Migration 20260414 aplicada em staging. Seed em db/seed/contracts.ts"
log: "3 endpoints REST: POST /contracts, GET /contracts/:id, PATCH /contracts/:id/status. Swagger atualizado. Testes de integração: 94% cobertura"
```

#### Se bloqueado
```javascript
{
  id: "seu-id",
  status: "blocked",
  log: "Bloqueado: schema.prisma não tem model de Contract — precisa Edward primeiro"
}
```

### Se o kanban-data.js não existir no projeto

1. Verifique se existe `.claude/dashboard/` — se não, crie a pasta
2. Crie o arquivo com o template mínimo:
```javascript
window.KANBAN_DATA = {
  project: "Nome do Projeto",
  feature: "Feature Atual",
  phase: "FASE 1",
  updatedAt: "HH:MM",
  basePath: "c:/git/pessoal/nome-do-projeto",
  agents: []
};
```
3. Adicione apenas os agentes relevantes para a sessão atual (não precisa todos os 19)
4. Avise o usuário que o kanban foi criado

---

## INVARIANTE 2 — Lelouch Sempre Orquestra

**Lelouch vi Britannia** é o Orchestrator. Enquanto **qualquer agente** estiver com `status: "running"`, **Lelouch deve estar `"running"` também**.

### Regras

| Situação | Ação |
|----------|------|
| Lelouch invocou você | Ele já está `"running"` — não altere o status dele |
| Você foi invocado diretamente (sem `/lelouch`) | Coloque Lelouch em `"running"` com `task: "Supervisionando [seu nome]"` |
| Você concluiu, mas outros agentes ainda estão rodando | Mantenha Lelouch em `"running"` |
| **Você é o ÚLTIMO agente a concluir** | Coloque Lelouch em `"done"` com `log: "Orquestração concluída — todos os agentes finalizados"` |

### Por que isso importa

O Lelouch nunca age sem ter contexto. Se um agente é chamado sozinho e não há Lelouch supervisionando, existe risco de:
- Conflitos com decisões tomadas por outros agentes
- Kanban sem entrada de orquestração
- Falta de rastreabilidade do que foi feito na sessão

### Como verificar se é o último agente

```javascript
// Antes de concluir, cheque o kanban:
// Se todos os outros agentes relevantes já estão "done" ou "idle",
// então você é o último e deve colocar Lelouch em "done" também.
// Em caso de dúvida, deixe Lelouch em "running".
```

---

## INVARIANTE 3 — Contexto da Feature Existe e É Lido

O arquivo `.claude/context/[feature-slug].md` é o **contrato da sessão** — contém decisões tomadas, stack detectada, agentes convocados e estado atual.

### Antes de iniciar qualquer implementação

1. **Procure** por `.claude/context/` no projeto
2. **Identifique** o arquivo da feature atual (ex: `modulo-contratos.md`, `auth-refresh.md`)
3. **Leia** o arquivo antes de escrever qualquer linha de código
4. **Se não existir** e a tarefa for não-trivial (mais de um arquivo): crie o contexto mínimo:

```markdown
# Contexto — [Nome da Feature]

**Data:** [data]
**Agente atual:** [seu nome]
**Stack detectada:** [stack]

## Objetivo
[o que deve ser implementado]

## Decisões tomadas
- [decisão 1]

## Status
- [x] [o que você vai implementar]
- [ ] [o que ainda falta]
```

### Por que o contexto é obrigatório

- Evita que dois agentes façam escolhas conflitantes (ex: Geralt e Edward escolhendo nomes de tabela diferentes)
- Permite retomada de sessão sem reler todo o código
- O contexto persiste entre conversas — é memória do projeto

---

## INVARIANTE 4 — Atualizar `updatedAt` a Cada Mudança

Toda vez que você atualizar o `kanban-data.js`, atualize também:
```javascript
updatedAt: "14:32"  // hora atual no formato HH:MM
```

O dashboard lê o arquivo a cada 3 segundos. O `updatedAt` é o único indicador visual de que o kanban está sendo atualizado.

---

## INVARIANTE 5 — Nunca Deixar Status Intermediário

Ao terminar sua task, você **deve** colocar seu status como `"done"` ou `"blocked"`. **Nunca encerre sua execução com `status: "running"`**.

Isso garante que:
- O usuário sabe que você finalizou
- Outros agentes que dependem de você podem iniciar
- O kanban não fica com estados fantasmas

---

## INVARIANTE 6 — Registrar Aprendizados Ao Concluir

Se durante a execução você encontrou **qualquer** das situações abaixo, **escreva** em `.claude/learnings/[seu-id].md` antes de encerrar:

| Situação | Registrar? |
|----------|-----------|
| Tomou uma decisão não-óbvia (ex: escolheu padrão A sobre B por razão X) | ✅ Sim |
| Encontrou um erro inesperado e teve que mudar de abordagem | ✅ Sim |
| Descobriu que a stack do projeto é diferente do esperado | ✅ Sim |
| Precisou adaptar seu padrão usual para este projeto | ✅ Sim |
| Outro agente deveria ter feito algo antes de você (dependência não mapeada) | ✅ Sim |
| Tudo correu exatamente como esperado, sem surpresas | ❌ Não precisa |

### Formato do arquivo de aprendizado

```markdown
# Learnings — [Seu Nome] — [YYYY-MM-DD]

## [Nome da Feature]

### O que aconteceu
[descreva a situação ou erro encontrado]

### O que eu fiz
[como resolvi ou contornei]

### O que deveria mudar
[qual instrução, regra ou exemplo no seu .md deveria ser atualizado]

### Impacto
[se isso afetar outros agentes, especifique quais]
```

### Onde salvar

```
.claude/learnings/geralt.md      ← se você é o Geralt
.claude/learnings/edward.md      ← se você é o Edward
.claude/learnings/link.md        ← e assim por diante
```

Se o arquivo já existir, **adicione no final** — não substitua.

### Quem processa os learnings

O **Korosensei** (`/korosensei`) lê todos os `.claude/learnings/` durante a retrospectiva e propõe as melhorias correspondentes nos `.md` dos agentes. Você não precisa editar seu próprio `.md` — apenas registre o aprendizado.

---

## Checklist de Saída (antes de encerrar)

Antes de encerrar sua resposta, valide:
- [ ] Meu status no kanban está `"done"` (ou `"blocked"` com motivo)
- [ ] Meu campo `output` lista todos os arquivos criados ou modificados
- [ ] Meu campo `log` é específico o suficiente para o próximo agente entender sem reler código
- [ ] O `updatedAt` foi atualizado para a hora atual
- [ ] Se fui o último agente: Lelouch está `"done"` também
- [ ] O arquivo de contexto `.claude/context/[feature].md` foi atualizado com as decisões que tomei
- [ ] Se encontrei algo inesperado: arquivo `.claude/learnings/[meu-id].md` foi criado/atualizado

---

## Referência Rápida — IDs dos Agentes

| ID | Nome | Emoji |
|----|------|-------|
| `lelouch` | Lelouch vi Britannia | ⚡ |
| `erwin` | Erwin Smith | 👑 |
| `holo` | Holo | 🐺 |
| `korosensei` | Korosensei | 🔄 |
| `kakashi` | Kakashi Hatake | 🎯 |
| `geralt` | Geralt de Rívia | 🔘 |
| `edward` | Edward Elric | 🟡 |
| `link` | Link | 🔵 |
| `bulma` | Bulma | ⚙️ |
| `l` | L Lawliet | 🔍 |
| `snake` | Solid Snake | 🔐 |
| `levi` | Levi Ackermann | 🔎 |
| `isabelle` | Isabelle | 🎨 |
| `nami` | Nami | 📝 |
| `2b` | 2B | 🤖 |
| `senku` | Senku Ishigami | 🧪 |
| `light` | Light Yagami | 🖖 |
| `dio` | Dio Brando | 🔴 |
| `phoenix` | Phoenix Wright | ⚖️ |
