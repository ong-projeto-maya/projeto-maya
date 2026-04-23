---
description: "Playbook para adicionar um novo módulo CRUD a um projeto existente — sem billing, sem multi-tenant. Ideal para a maioria das features internas: novo recurso de dados com listagem, criação, edição, exclusão e permissões básicas."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Novo CRUD de Módulo

Use quando: adicionar um novo recurso de dados a um sistema já existente (ex: módulo de Contratos, Fornecedores, Eventos, Campanhas). Sem subscription, sem billing, sem multi-tenant específico — foco em entregar a funcionalidade corretamente dentro da stack existente.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/novo-crud-modulo.md] para o módulo [Nome do Módulo] no projeto [Nome do Projeto]
```

## Escopo Padrão

- Model Prisma + migration (ou equivalente na stack detectada)
- Domain entity + value objects + repository port
- Use cases: ListarXxx, CriarXxx, AtualizarXxx, DeletarXxx (soft delete por padrão)
- Controller REST com DTOs validados (NestJS) ou Route Handler (Next.js API routes)
- Páginas: listagem com filtros + paginação, formulário create/edit, detalhe
- Permissões: verificar se projeto tem RBAC e aplicar guard equivalente
- Testes unitários dos use cases (cobertura ≥ 80%)
- Documentação: README atualizado + Swagger anotado (se API)

## Fases

### FASE 0 — Escopo (obrigatória, sem código)

```
Task → Erwin: definir user stories e critérios de aceitação
  - Quais campos são obrigatórios vs opcionais?
  - Quais são as regras de negócio de validação?
  - Quem pode criar / editar / excluir?
  - Há paginação? filtros? busca por texto livre?
```

### FASE 1 — Schema e Arquitetura (paralelo)

```
Task → Edward: criar model Prisma (ou tabela/collection equivalente)
  - Seguir convenções de nomenclatura do projeto
  - Adicionar índices para campos de filtro
  - Usar soft delete (deletedAt) se o projeto já adota
  - Gerar migration e validar no banco local

Task → Kakashi: revisar arquitetura do módulo
  - Verificar se segue o mesmo padrão dos módulos existentes
  - Criar ADR se houver decisão nova (ex: novo padrão de ID, nova validação)
  - Confirmar que não há conflito com módulos vizinhos
```

### FASE 2 — Backend (após Edward concluir)

```
Task → Geralt: implementar o módulo completo
  - Domain entity com readonly properties
  - Value objects para campos com regra de validação
  - Repository port (interface) + Prisma Adapter
  - Use cases: Listar, Criar, Atualizar, Deletar
  - Controller com DTOs class-validator + Swagger @ApiProperty
  - Guard de permissões (reutilizar padrão existente)
  - Injeção de dependência no Module NestJS
```

### FASE 3 — Frontend (paralelo ao backend, após Isabelle)

```
Task → Isabelle: especificar componentes de UI necessários
  - Verificar quais componentes já existem no design system
  - Especificar apenas o que é novo (não redesenhar o que já existe)
  - Layout da listagem: tabela ou cards? filtros no topo ou sidebar?

Task → Link: implementar páginas e componentes (após Isabelle OU em paralelo com mock)
  - Página de listagem: tabela com paginação + filtros
  - Formulário: create/edit com validação Zod
  - Conectar com a API via TanStack Query (ou equivalente)
  - Loading states + error states + empty states
```

### FASE 4 — Qualidade (paralelo após FASE 2+3)

```
Task → L Lawliet: testes unitários dos use cases
  - Um describe por use case
  - Cobrir: caminho feliz, validação de input inválido, recurso não encontrado
  - Mockar repository com jest.fn()

Task → Snake: revisão de segurança
  - Verificar autorização (quem pode excluir? precisa ser dono do recurso?)
  - Verificar inputs: sem SQL injection, sem XSS nos campos text
  - Verificar que IDs não são enumeráveis (use UUID se projeto usa UUID)
```

### FASE 4.5 — Code Review (após L Lawliet + Snake)

```
Task → Levi: revisão de correctness/completeness
  - Percorrer os use cases: lógica de negócio corresponde aos critérios do Erwin?
  - Verificar casos de borda: recurso não encontrado, permissão negada, input vazio
  - Verificar que soft delete filtra registros em todas as queries de listagem
  - Verificar que paginação não retorna dados de outros tenants
```

### FASE 5 — Finalização (paralelo, após Levi)

```
Task → Nami: atualizar README.md e CHANGELOG.md
  - Documentar o novo endpoint na seção de API (se houver)
  - Adicionar entry no CHANGELOG
  - Atualizar swagger se há arquivo separado

Task → Bulma: verificar build e deploy
  - Build sem erros e sem warnings novos
  - Variáveis de ambiente necessárias documentadas
```

## Critérios de Aceitação Mínimos

```
✅ Migration aplicada sem erro em banco local
✅ Todos os use cases com teste passando (cobertura ≥ 80%)
✅ CRUD completo funcional no frontend (criar, editar, listar, deletar)
✅ Permissões respeitadas (usuário sem permissão recebe 403)
✅ Snake aprovou (sem vulns críticas)
✅ Levi sem findings 🔴 (correctness review aprovado)
✅ Build passa sem erros
✅ CHANGELOG.md atualizado
```

## Adaptações por Stack

| Sinal | Adaptação |
|-------|-----------|
| Next.js sem backend separado | Geralt usa Route Handlers em `app/api/` em vez de NestJS |
| Firebase / Supabase (sem Prisma) | Edward cria schema Firestore / tabela SQL no Supabase Studio + RLS |
| Projeto sem testes | L Lawliet cria a estrutura inicial de testes + documenta o padrão para o time |
| Projeto sem RBAC | Snake e Erwin definem o modelo de permissão mínimo antes de FASE 2 |
| Projeto React sem Next.js (SPA pura) | Link usa React Router, formulários com React Hook Form + Zod |

## Armadilhas Comuns

- **Não pular FASE 0** — sem critérios claros do Erwin, o Geralt vai implementar baseado em suposições e o Link vai implementar outra coisa
- **Não deixar Edward e Geralt trabalharem em paralelo** — Geralt depende do schema. Sempre FASE 1 → FASE 2
- **Soft delete por padrão** — a menos que o projeto já use hard delete explicitamente, use `deletedAt`
- **Reutilizar componentes** — Link não deve criar uma nova tabela se o projeto já tem `<DataTable>`. Isabelle mapeia o que existe antes de especificar
