---
description: "Playbook para pagar dívida técnica — refatorar código existente sem adicionar features. Cobre: análise de impacto, testes como rede de segurança, migração incremental, validação de não-regressão. Use quando: extrair módulo, trocar biblioteca, reorganizar pasta, melhorar tipagem, eliminar code smells graves."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Refatoração Técnica

Use quando: o time precisa pagar dívida técnica sem adicionar features — reorganizar estrutura, trocar biblioteca, melhorar tipagem, extrair responsabilidades acopladas, eliminar código morto.

**Regra de ouro deste playbook:** ao final, o comportamento observável do sistema deve ser **idêntico** ao início. A única diferença é a qualidade interna do código.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/refatoracao-tecnica.md] para [descrever o problema / área a refatorar] no projeto [Nome do Projeto]
```

## Exemplos de Uso

- "extrair o módulo de pagamentos do serviço monolítico de pedidos"
- "trocar axios por fetch nativo e remover o wrapper legado"
- "reorganizar estrutura hexagonal — controllers estão misturados com use cases"
- "eliminar 14 instâncias de `any` no módulo de contratos"
- "migrar validação manual de DTOs para class-validator"

## Fases

### FASE 0 — Análise de Impacto (obrigatória antes de qualquer alteração)

```
Task → Kakashi: análise arquitetural da área a refatorar
  - Identificar EXATAMENTE quais arquivos serão tocados
  - Mapear dependências: quais módulos importam o que vai mudar?
  - Avaliar risco: quão crítico é o código afetado?
  - Estimar escopo real: é uma tarde? uma semana? um sprint?
  - Propor estratégia: big-bang vs migração incremental
  - Definir critérios de "refatoração concluída" — como saber que terminou?

Task → L Lawliet: auditoria de cobertura de testes atual
  - Qual é a cobertura atual da área a refatorar?
  - Existem testes de integração ou e2e que cobrem o comportamento externo?
  - Identificar gaps: o que PRECISA estar coberto antes de refatorar (rede de segurança)?
  - Se cobertura < 60% da área crítica → L Lawliet escreve testes ANTES da refatoração
```

> ⚠️ **AGUARDAR** relatório do Kakashi + L Lawliet antes de avançar  
> ⚠️ **Se cobertura insuficiente** → Inserir FASE 0.5 antes de continuar

### FASE 0.5 — Rede de Segurança (apenas se L Lawliet identificar gaps)

```
Task → L Lawliet: escrever testes de comportamento existente
  - Foco: testar o comportamento observável, não a implementação
  - Esses testes NÃO devem mudar durante a refatoração
  - São a rede de segurança: se quebrarem, a refatoração introduziu regressão
  - Meta: cobertura ≥ 70% dos casos de uso da área afetada
```

### FASE 1 — Estratégia e ADR (após Kakashi)

```
Task → Kakashi: criar ADR da decisão de refatoração
  - Por que estamos mudando? (custo de manter o código atual)
  - O que vamos mudar? (escopo preciso)
  - O que NÃO vamos mudar? (limite de escopo — evitar scope creep)
  - Como vamos validar que não introduzimos regressão?
  - Plano de rollback: se der errado, como reverter?
```

### FASE 2 — Refatoração (pode ser incremental em múltiplas iterações)

```
Task → [agente especialista da área — Geralt para backend, Link para frontend, Edward para schema]:

  Refatorar seguindo a estratégia aprovada pelo Kakashi.
  
  Regras invioláveis durante a refatoração:
  - NÃO adicionar features novas — se descobrir algo que precisa ser feito, abrir TODO
  - NÃO alterar interfaces públicas (endpoints, props de componente) sem aprovação de Kakashi
  - Fazer commits pequenos e frequentes — um commit por transformação lógica
  - Rodar testes após cada commit
  - Se um teste quebrar → PARAR e entender POR QUÊ antes de continuar
  - Manter o sistema funcionando em cada commit intermediário (sem WIP que quebra o build)
  
  Estratégia incremental (preferida sobre big-bang):
  1. Criar a nova estrutura ao lado da antiga (não deletar ainda)
  2. Migrar caso por caso, redirecionando chamadas para a nova estrutura
  3. Quando tudo estiver migrado, remover a estrutura antiga
  4. Confirmar build + testes verdes antes de deletar
```

### FASE 3 — Validação (após FASE 2 completa)

```
Task → L Lawliet: rodar suíte completa de testes
  - Todos os testes da rede de segurança (FASE 0.5) devem passar
  - Nenhum teste novo deve ter sido removido ou comentado
  - Cobertura não deve ter caído em relação ao início
  - Se houver testes e2e: rodar o fluxo crítico manualmente ou automatizado

Task → Snake: verificar se a refatoração não introduziu vulnerabilidades
  - Foco especial se a área refatorada lida com autenticação, permissões ou dados sensíveis
  - Verificar que os limites de segurança foram preservados

Task → Levi: revisão de correctness pós-refatoração
  - O comportamento observável é idêntico ao pré-refatoração?
  - Alguma interface pública foi alterada sem aprovação do Kakashi?
  - Há `any`, cast forçado ou `// @ts-ignore` introduzido durante a refatoração?
  - Algum TODO ou HACK deixado sem registro no kanban?
```

### FASE 4 — Documentação e Comunicação (após FASE 3 verde)

```
Task → Nami: documentar o que mudou
  - CHANGELOG.md: entrada clara do que foi refatorado e por quê
  - Se houve mudança de convenção: atualizar o README ou CONTRIBUTING.md
  - Se houve mudança de estrutura de pastas: atualizar diagrama de arquitetura (se existir)
  - Registrar a decisão no ADR do Kakashi como "implementada"
```

## Critérios de Aceitação Mínimos

```
✅ Build passa sem erros novos
✅ Todos os testes passando (nenhum removido ou comentado)
✅ Cobertura ≥ cobertura pré-refatoração (não degradou)
✅ Nenhuma interface pública alterada sem aprovação (endpoint, props, tipos exportados)
✅ ADR criado e registrado
✅ CHANGELOG.md atualizado
✅ Code review do Kakashi aprovado
✅ Snake validou se área sensível foi tocada
✅ Levi sem findings 🔴 (correctness review aprovado)
```

## Estratégias de Migração por Tipo de Refatoração

### Extrair módulo (ex: separar pagamentos de pedidos)

1. Kakashi define a interface do novo módulo (FASE 1)
2. Geralt cria o novo módulo com a interface (FASE 2)
3. Um ponto de chamada por vez é migrado para o novo módulo
4. Após todos migrados, remover o código legado
5. L Lawliet confirma cobertura em cada etapa

### Trocar biblioteca (ex: axios → fetch)

1. Kakashi cria o wrapper agnóstico (ex: `httpClient.ts`) que abstrai a biblioteca
2. Geralt substitui todas as chamadas diretas para o wrapper
3. Só então trocar a implementação interna do wrapper de axios para fetch
4. Vantagem: se fetch der problema, reverter apenas o wrapper

### Reorganizar estrutura de pastas

1. L Lawliet garante cobertura antes de mover
2. Mover os arquivos e atualizar imports (use IDE refactor ou sed cuidadoso)
3. Confirmar build imediatamente após mover — não acumular moves
4. Verificar que não há imports relativos quebrados (especialmente ../../..)

### Eliminar `any` / melhorar tipagem

1. Geralt audita todos os `any` com `grep -r "any"` — lista antes de iniciar
2. Resolver do mais simples para o mais complexo (não fazer tudo de uma vez)
3. Nunca substituir `any` por `unknown` + cast forçado — encontrar o tipo correto
4. Se encontrar bug real durante a tipagem, abrir TODO e não misturar com a refatoração

## Armadilhas Comuns

- **Scope creep** — "já que vou mexer aqui, vou melhorar aquele outro lugar também". Não. Criar uma task separada e não misturar
- **Refatorar sem rede de segurança** — código sem testes é código que vai quebrar em produção de forma invisível
- **Big-bang em código crítico** — refatorar autenticação ou pagamentos de uma vez é arriscado. Migrar incrementalmente
- **Renomear sem atualizar todas as referências** — sempre rodar o build e verificar imports antes de commitar
- **Melhorar enquanto refatora** — a tentação de "já que vou mudar, vou otimizar também". Não. Duas PRs diferentes
- **Sem ADR** — a equipe futura vai desfazer a refatoração por não entender o motivo. Kakashi documenta o porquê
