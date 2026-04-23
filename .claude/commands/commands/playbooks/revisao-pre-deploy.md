---
description: "Playbook de revisão completa antes de qualquer deploy em produção. Pipeline sequencial de qualidade: Levi (correctness) → Snake (segurança) → Kakashi (arquitetura) → L Lawliet (cobertura de testes) → Korosensei (velocity + aprendizados). Use antes de releases importantes, hotfixes críticos ou primeira implantação de um módulo."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Revisão Pré-Deploy

Use quando: qualquer deploy de produção que envolva código novo ou modificado — especialmente releases de versão, hotfixes críticos, e primeira implantação de módulo novo. Não pule etapas mesmo sob pressão.

## Gatilho

```
/lelouch --playbook deploy "revisão pré-deploy da v2.1 no FinPilot"
/lelouch --playbook deploy "hotfix do bug de autenticação no Animale OS"
```

## Escopo Padrão

- Revisão de correctness e completeness dos arquivos modificados
- Auditoria de segurança focada nos endpoints expostos
- Revisão arquitetural de decisões feitas sob pressão
- Verificação de cobertura de testes dos caminhos críticos
- Registro de velocity e learnings da sprint
- Checklist de deploy validado linha a linha

## Quando NÃO usar

- Para code review de rotina em PRs pequenos (use Levi diretamente com `/levi`)
- Para planejamento de feature nova (use `/lelouch [feature]`)
- Para retrospectiva sem deploy iminente (use `/korosensei`)

---

## Fases

### FASE 0 — Inventário do Diff (Lelouch)

Antes de convocar qualquer agente, mapeie o que será deployado:

```bash
# Arquivos modificados desde a última tag/release
git diff --name-only HEAD~N  # ou git diff main...feature-branch
git log --oneline HEAD~N
```

Liste os arquivos modificados agrupados por tipo:
- **Modelo de dados** (schema, migrations) → impacto alto
- **Lógica de negócio** (use cases, services, hooks) → impacto alto
- **Endpoints expostos** (controllers, routes) → impacto médio-alto
- **Componentes UI** (pages, components) → impacto médio
- **Configuração** (env, CI, docker) → impacto variável
- **Documentação** → impacto baixo

**Se houver migrations:** alerta obrigatório — Edward deve validar antes do deploy.

---

### FASE 1 — Correctness Review (Levi)

**Tarefa:** revisar todos os arquivos de alto e médio impacto listados na FASE 0.

**Foco específico desta fase:**
- A lógica nova faz exatamente o que os critérios de aceitação dizem?
- Casos de borda em produção: valores nulos, usuários sem permissão, timeouts, payloads inesperados
- Race conditions em operações assíncronas de alta concorrência
- Soft delete está aplicado em todas as queries de listagem?
- Idempotência em operações que podem ser chamadas múltiplas vezes (webhooks, retries)

**Output esperado:**
```
🔎 Levi — Correctness Review Pré-Deploy

Arquivos revisados: [N]
🔴 Bloqueadores: [N]
🟡 Importantes: [N]
🟢 Observações: [N]

[lista de findings por severidade]

Veredito: ✅ Aprovado para Fase 2 | 🔴 BLOQUEADO — corrigir antes de prosseguir
```

**Regra:** qualquer finding 🔴 bloqueia todo o pipeline. Corrigir e re-executar a Fase 1 antes de continuar.

---

### FASE 2 — Auditoria de Segurança (Snake)

**Tarefa:** revisar os endpoints expostos e dados manipulados no diff.

**Foco específico desta fase:**
- Novos endpoints: autenticação, autorização, rate limiting
- Dados sensíveis (PII, senhas, tokens) estão mascarados nos logs?
- Validação de input em TODOS os campos de entrada (não confiar no frontend)
- Secrets hardcoded ou expostos acidentalmente no diff
- Dependências adicionadas: verificar CVEs com `pnpm audit`
- SQL injection em queries raw (se houver)
- CSRF em endpoints de mutação expostos publicamente

**Output esperado:**
```
🔐 Snake — Security Audit Pré-Deploy

Endpoints auditados: [N]
Críticos: [N] | Altos: [N] | Médios: [N] | Baixos: [N]

[findings por severidade com referência OWASP]

Veredito: ✅ Seguro para deploy | 🔴 BLOQUEADO — vulnerabilidade crítica encontrada
```

**Regra:** qualquer vulnerabilidade Crítica ou Alta bloqueia o deploy.

---

### FASE 3 — Revisão Arquitetural (Kakashi)

**Tarefa:** revisar se decisões tomadas sob pressão da sprint violam os padrões do projeto.

**Foco específico desta fase:**
- Violações da arquitetura hexagonal (dependência invertida, import errado)
- Duplicação de lógica que deveria estar em use case compartilhado
- Breaking changes em interfaces públicas sem versioning
- ADR necessário para alguma decisão nova não documentada
- Tech debt gerado que deve ser registrado

**Output esperado:**
```
🎯 Kakashi — Architecture Review Pré-Deploy

Violações críticas: [N]
Tech debt gerado: [N items] → registrar no backlog
ADR necessário: Sim/Não

[findings]

Veredito: ✅ Arquitetura ok | ⚠️ Prosseguir com ressalvas (registrar debt) | 🔴 BLOQUEADO
```

**Regra:** violações arquiteturais críticas (ex: domínio importando infraestrutura) bloqueiam o deploy.

---

### FASE 4 — Cobertura de Testes (L Lawliet)

**Tarefa:** verificar a cobertura dos caminhos críticos modificados.

**Foco específico desta fase:**
- Use cases novos têm testes unitários? Cobertura ≥ 80%?
- Happy path + pelo menos 2 edge cases testados por use case
- Testes de integração para os endpoints novos?
- Os testes existentes continuam passando? (`pnpm test`)
- Caminhos críticos (pagamento, autenticação, dados sensíveis) têm cobertura ≥ 90%

**Output esperado:**
```
🔍 L Lawliet — Test Coverage Pré-Deploy

Cobertura geral: [X]%
Caminhos críticos: [X]%
Testes novos adicionados: [N]
Testes falhando: [N]

Veredito: ✅ Cobertura adequada | ⚠️ Cobertura baixa em [área] — risco | 🔴 Testes falhando
```

**Regra:** testes falhando bloqueiam o deploy. Cobertura < 60% em área crítica é risco alto — alertar usuário.

---

### FASE 5 — Deploy Checklist (Lelouch)

Após todas as fases aprovadas, o Lelouch valida o checklist final:

```
## ✅ Checklist Pré-Deploy — [Feature/Release] — [Data]

### Qualidade
[ ] Levi: zero findings 🔴 (correctness aprovado)
[ ] Snake: zero vulnerabilidades Críticas/Altas (segurança aprovada)
[ ] Kakashi: zero violações arquiteturais críticas
[ ] L Lawliet: testes passando, cobertura ≥ 80%

### Código
[ ] Build passa sem erros (pnpm build)
[ ] Lint e formatação OK (pnpm lint && pnpm format)
[ ] Variáveis de ambiente de produção documentadas e configuradas
[ ] migrations revisadas e testadas em staging antes de produção

### Deploy
[ ] Rollback plan definido (como reverter se falhar?)
[ ] Horário de deploy definido (evitar horário de pico)
[ ] Monitoramento ativo (Sentry, Uptime Kuma, logs)
[ ] Stakeholders comunicados (se for mudança visível ao usuário)

### Pós-deploy
[ ] Teste de smoke manual em produção após deploy
[ ] Korosensei convocado para registrar velocity e learnings
```

Apresente o checklist ao usuário. Se todos os itens estiverem marcados: `🚀 Aprovado para deploy`.

Se algum bloqueio permanecer: **não prossiga** — descreva o que precisa ser corrigido.

---

### FASE 6 — Velocity + Learnings (Korosensei)

**Tarefa:** registrar a sprint pré-deploy no histórico e coletar aprendizados.

- Executar `velocity.md` extraction a partir do `history[]` do kanban
- Solicitar a cada agente envolvido: registrar `.claude/learnings/[nome].md`
- Identificar se algum finding de Levi/Snake/Kakashi é recorrente → propor melhoria nos `.md`

**Output esperado:**
```
🔄 Korosensei — Sprint Review Pré-Deploy

Velocity: [N] agentes, [N] bloqueios, cobertura Levi ✅ / Snake ✅
Learnings coletados de: [agentes]
Melhorias propostas: [N diffs nos .md — aguardando aprovação]
```

---

## Critérios de Aceitação

```
✅ Levi: zero findings 🔴 (correctness aprovado)
✅ Snake: zero vulnerabilidades Críticas/Altas
✅ Kakashi: zero violações arquiteturais críticas
✅ L Lawliet: testes passando + cobertura ≥ 80%
✅ Build e lint passando
✅ Rollback plan documentado
✅ Korosensei: velocity e learnings registrados
```

## Tempo Estimado

| Projeto pequeno (< 10 arquivos no diff) | ~30 min |
| Projeto médio (10-30 arquivos) | ~60 min |
| Release grande (> 30 arquivos) | ~90-120 min — considerar deploy faseado |
