---
description: "Playbook de migração de dados — movimentação segura de dados entre schemas, bancos, ou estruturas. Pipeline: Edward (estratégia + script de migração) → Geralt (lógica de transformação, se necessário) → Snake (LGPD e PII durante migração) → L Lawliet (validação de integridade) → Bulma (execução monitorada + rollback). Use para mudanças de schema complexas, migração de banco, refatoração de modelo de dados, ou ETL crítico."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Migração de Dados

Use quando: mudança de schema que requer transformação de dados existentes, migração entre bancos ou plataformas (ex: Firebase → PostgreSQL, MySQL → Neon), refatoração de coluna com dados em produção, split/merge de tabelas, ou qualquer ETL que afete dados de usuários.

## Gatilho

```
/lelouch --playbook migracao "migrar campo status de string para enum no Animale OS"
/lelouch --playbook migracao "mover dados do Firebase para PostgreSQL no FitPlan"
/lelouch --playbook migracao "split da tabela users em users + profiles no FinPilot"
/lelouch --playbook migracao "adicionar coluna obrigatória orgId em todas as tabelas multi-tenant"
```

## Filosofia

> "Dados de usuário são sagrados. Cada byte apagado ou corrompido sem intenção é uma falha sem desculpa."

Toda migração de dados:
1. É **reversível** — rollback script pronto ANTES de executar
2. É **testada** — validada em staging com dump de produção anonimizado
3. É **monitorada** — executada com logs em tempo real, não em batch cego
4. É **idempotente** — pode ser reexecutada sem duplicar ou corromper dados

## Quando NÃO usar

- Adicionar novo campo opcional sem tocar dados existentes → Edward direto com Prisma migration
- Renomear coluna sem transformação de dados → migration simples sem playbook
- Seed data de novos registros → Edward direto

---

## FASE 0 — Análise e Estratégia (Edward)

```
Task → Edward: MIGRAÇÃO — STRATEGY
Migração: [descrição clara do que precisa ser movido/transformado]
Tabelas afetadas: [lista]
Volume estimado de rows: [N] em cada tabela
Plataforma atual: [ex: Neon PostgreSQL / Firebase / MySQL Railway]
Destino: [ex: Neon PostgreSQL / mesmo banco, nova estrutura]

Produzir:
1. Mapa de migração:
   | Campo origem | Tipo origem | Campo destino | Tipo destino | Transformação |
   |-------------|-------------|--------------|--------------|---------------|
   | user.name   | STRING      | profile.full_name | VARCHAR(200) | direto |
   | order.type  | STRING      | order.status | ENUM        | mapping manual |

2. Estratégia de execução:
   - [ ] Adicionar nova estrutura (nova coluna/tabela) com dados nulos
   - [ ] Backfill em batches (nunca toda a tabela de uma vez para > 10k rows)
   - [ ] Atualizar código para escrever em ambos (dual-write, se necessário)
   - [ ] Validar integridade
   - [ ] Remover estrutura antiga (DROP em sprint separado, após validação completa)

3. Script de rollback completo (deve existir antes do script de migração)

4. Estimativa de tempo para backfill:
   - [N] rows / [batch_size] por execução / [delay]ms entre batches = ~[tempo total]
   - Janela de manutenção necessária? [ ] Sim (> X min downtime) [ ] Não (zero-downtime)

5. Identificar se a migração é zero-downtime ou requer janela de manutenção:
   - Adicionar coluna nullable: zero-downtime
   - Renomear coluna com código em produção: requer dual-write ou manutenção
   - Mudar tipo de dado com incompatibilidade: pode exigir manutenção
```

---

## FASE 1 — Revisão de Segurança e LGPD (Snake)

**Execute em paralelo com FASE 1 de Geralt** quando há transformação de código.

```
Task → Snake: MIGRAÇÃO — SECURITY & LGPD REVIEW
Mapa de migração: [output do Edward]
Dados envolvidos: [quais campos e tabelas]

1. Identificar campos PII nos dados a migrar:
   | Campo | Tipo de PII | Tratamento na migração |
   |-------|------------|----------------------|
   | email | PII direta | mascarar nos logs de migração |
   | CPF   | PII sensível | nunca logar, nunca em staging sem anonimizar |

2. Verificar:
   - Logs do script de migração NÃO contêm PII (CPF, email, telefone, endereço)
   - Dump de staging é anonimizado (não clone direto de produção com dados reais)
   - Script de migração não expõe dados em variáveis de ambiente ou arquivos temp
   - Se dados são deletados: confirmar LGPD art. 16 (retenção) está sendo respeitado

3. Verificar permissões:
   - Usuário do banco que executa a migration — tem apenas o necessário (GRANT mínimo)
   - Sem credenciais de produção em código — apenas via env vars

Output: ✅ Migração segura | 🔴 Bloqueio: [descrição + correção necessária]
```

---

## FASE 1 — Lógica de Transformação (Geralt, se necessário)

Execute apenas se a migração exige lógica de negócio além de SQL puro.

```
Task → Geralt: MIGRAÇÃO — TRANSFORMATION LOGIC
Mapa de transformação (Edward): [campos que precisam de lógica além de SQL]

Exemplos de quando Geralt é necessário:
- status "ativo/inativo" precisa mapear para enum StatusEnum baseado em regras de negócio
- dados de texto livre precisam ser parseados e normalizados
- relacionamentos precisam ser recalculados com base em regras de domínio
- timestamps precisam ser convertidos entre fusos horários

Entregue:
- Função de transformação TypeScript/Python pura (sem side effects, testável)
- Casos de borda mapeados (o que fazer com null? com valor inválido? com duplicata?)
- Estratégia para dados que não se encaixam nas regras (quarentena? skip? log?)
```

---

## FASE 2 — Script de Migração + Rollback (Edward)

```
Task → Edward: MIGRAÇÃO — SCRIPTS
Estratégia (FASE 0): [aprovada]
Transformação (Geralt, se houver): [função aprovada]
Review Snake: ✅ aprovado

Produzir:
1. Script de migração em batches (TypeScript/Node ou SQL puro):
   - batch_size recomendado: 500-1000 rows por vez para tabelas grandes
   - delay entre batches: 50-100ms para não saturar a DB em produção
   - log de progresso: "Batch N/X concluído — Y rows processados em Zms"
   - checkpoint: salvar progresso para poder retomar se cair

2. Script de validação (rodar após migração):
   - count de rows origem vs destino (deve bater)
   - sample de N rows: comparar valores origem vs destino
   - integridade referencial: nenhuma FK quebrada
   - valores NULL onde não deveria = zero

3. Script de rollback:
   - Deve reverter EXATAMENTE o que o script de migração fez
   - Testado em staging ANTES da execução em produção
   - Tempo estimado de rollback: [X minutos]

4. Prisma migration (se aplicável):
   - Migration de schema separada da migration de dados
   - Schema migration: `prisma migrate deploy`
   - Data migration: script separado executado depois do schema
```

---

## FASE 3 — Testes de Integridade (L Lawliet)

```
Task → L Lawliet: MIGRAÇÃO — INTEGRITY TESTS
Script de migração: [path do script]
Script de validação: [path do script]

1. Testar script de migração em banco de desenvolvimento com dados reais anonimizados:
   - Executar migração completa do zero
   - Confirmar que script de validação passa 100%
   - Testar rollback: executar rollback e confirmar que dados voltam ao estado original

2. Testar edge cases identificados por Geralt:
   - Rows com null nos campos origem
   - Rows com valores fora do range esperado
   - Rows duplicados (se a migração de-duplique)

3. Testar idempotência:
   - Executar migração 2x — resultado deve ser idêntico

4. Performance do script:
   - Medir tempo real para N=staging_row_count
   - Extrapolar para produção: staging tem X% do volume real?
   - Confirmar que batch_size e delay são adequados

Output: ✅ Testes passando | 🔴 [issue] encontrado — bloquear execução em produção
```

---

## FASE 4 — Execução em Produção (Bulma)

Apenas após: Edward ✅ + Snake ✅ + L Lawliet ✅

```
Task → Bulma: MIGRAÇÃO — PRODUÇÃO
Todos os checks de pré-requisito: ✅
Script de migração: [path]
Script de rollback: [path pronto para executar em < 5 min]
Janela de manutenção: [ ] necessária — [horário] | [ ] zero-downtime

PRÉ-EXECUÇÃO:
1. Backup do banco de dados (automático na plataforma ou snapshot manual)
2. Confirmar que rollback foi testado e funciona em staging
3. Notificar stakeholders se houver janela de manutenção
4. Verificar que não há jobs/crons ativos que tocam as tabelas afetadas

EXECUÇÃO:
1. Executar schema migration primeiro (Prisma migrate deploy)
2. Executar script de data migration com logs ativos
3. Monitorar: CPU, conexões, locks na DB durante a execução
4. Executar script de validação ao final — deve passar 100%

PÓS-EXECUÇÃO:
5. Smoke test nos endpoints que usam os dados migrados
6. Monitorar logs por 30 minutos — zero erros relacionados
7. Confirmar com o produto que os dados aparecem corretos na UI

ROLLBACK (se necessário):
- Critério: validação falhou | erros 500 nos endpoints | dado corrompido detectado
- Ação: executar rollback script imediatamente, notificar time
- Documentar: o que falhou e por quê antes de tentar novamente
```

---

## Checklist de Migração

```
PRÉ-MIGRAÇÃO
[ ] Mapa de migração documentado e aprovado
[ ] Snake: sem PII exposta nos logs e permissões corretas
[ ] Script de migração testado em staging com dados anonimizados
[ ] Script de rollback testado e funcionando
[ ] L Lawliet: testes de integridade e idempotência passando
[ ] Backup de produção confirmado
[ ] Stakeholders notificados (se janela de manutenção)

EXECUÇÃO
[ ] Schema migration executada sem erros
[ ] Data migration executada com log de progresso
[ ] Script de validação passou 100%
[ ] Smoke test nos endpoints afetados ✅

PÓS-MIGRAÇÃO
[ ] Monitoramento 30 min sem erros relacionados
[ ] Estrutura antiga marcada para remoção (próximo sprint) — NÃO remover imediatamente
[ ] Korosensei: learnings registrados
[ ] Coluna/tabela antiga: remover apenas após 1 sprint sem rollback
```

---

## Princípios de Segurança de Dados

1. **Nunca DROP imediato** — sempre marque a estrutura antiga como deprecated e remova no sprint seguinte após confirmar que o rollback não será mais necessário
2. **Batch obrigatório** para > 5.000 rows — nunca `UPDATE tabela SET ...` sem WHERE em produção
3. **Staging primeiro** — sempre validar com dump anonimizado de produção antes de executar em produção
4. **Rollback primeiro** — o script de rollback é escrito e testado ANTES do script de migração
5. **Zero PII em logs** — logs do script em produção são auditados por Snake antes da execução
