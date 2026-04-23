---
description: "Playbook de auditoria de performance. Pipeline completo: Senku (métricas baseline e análise estatística) → Edward (queries N+1 e índices) → Link (Core Web Vitals e bundle) → Kakashi (arquitetura de gargalos) → Bulma (infra e CDN) → Korosensei (velocity + relatório). Use quando o sistema está lento, queries demorando, Lighthouse ruim, ou SLA de latência violado."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Auditoria de Performance

Use quando: sistema com latência alta em produção, queries lentas identificadas, Lighthouse score < 70, SLA de p95 > 500ms violado, relatório de usuário sobre lentidão confirmado por dados, ou revisão preventiva de performance antes de um launch importante.

## Gatilho

```
/lelouch --playbook performance "API de casos no FinPilot demora 8s — p95 acima do SLA"
/lelouch --playbook performance "Lighthouse da landing do Animale OS score 42 — precisa melhorar"
/lelouch --playbook performance "auditoria completa de performance antes do launch v2"
/lelouch --playbook performance "queries do módulo de carteiras demorando 12s em produção"
```

## Filosofia

> "Não otimize o que você não mediu. Não meça o que você não vai agir."

Cada agente atua em seu domínio. Ninguém otimiza às cegas. Todo achado precisa de evidência (número, query plan, trace) antes de ser recomendado.

## Quando NÃO usar

- Lentidão pontual não reproduzível → investigue primeiro se é infra (scale event, cold start)
- Bug funcional que parece performance → use fluxo normal com `/lelouch`
- Otimização prematura em feature não lançada → não otimize antes de medir em produção

---

## FASE 0 — Definição de Baseline (Lelouch)

Antes de delegar, estabeleça as métricas de referência:

```
BASELINE DE PERFORMANCE — [Projeto] — [YYYY-MM-DD]

Endpoints críticos (backend):
  [rota]: p50 = Xms | p95 = Xms | p99 = Xms | error rate = X%
  [rota]: p50 = Xms | p95 = Xms | p99 = Xms | error rate = X%

Frontend (Lighthouse):
  LCP: X.Xs | INP: Xms | CLS: X.XX | Score: X/100

Banco de dados:
  Queries lentas (> 1s): [N] queries identificadas
  Query mais lenta: [tempo] — [tabela]

SLA definido:
  Backend p95: [alvo]ms | Frontend LCP: [alvo]s | DB max query: [alvo]ms
```

Colete com: Datadog, Railway Metrics, Vercel Analytics, Neon query insights, `EXPLAIN ANALYZE` ad-hoc.

---

## FASE 1 — Análise Estatística de Gargalos (Senku) ‒ PARALELO

```
Task → Senku: PERFORMANCE ANALYSIS
Projeto: [nome] | Stack: [resumo]
Dados disponíveis: [logs, métricas, APM, sample de queries]

1. Análise da distribuição de latência por endpoint:
   - Histograma e percentis (p50/p95/p99) por rota
   - Identificar outliers e padrões (picos por hora, por tipo de usuário)
   - Hipótese: gargalo é CPU, I/O, DB, ou downstream?

2. Correlação entre picos de latência e:
   - Volume de requests (N usuários simultâneos)
   - Queries executadas (correlação query_count vs latência)
   - Erros 5xx e timeouts

3. Priorização estatística dos gargalos:
   - Calcular ganho esperado por otimização (impacto × dificuldade)
   - Recomendar ordem de ataque

Output: relatório priorizando os 3-5 gargalos com maior impacto esperado
```

---

## FASE 1 — Análise de Queries e Banco (Edward) — PARALELO

```
Task → Edward: PERFORMANCE AUDIT — DATABASE
Banco: [PostgreSQL/MySQL/SQLite] | ORM: [Prisma/TypeORM/SQLAlchemy]
Endpoints lentos identificados: [lista da FASE 0]

1. Rodar EXPLAIN ANALYZE nas top-5 queries mais lentas:
   - Identificar Seq Scan (> 10k rows sem índice = problema)
   - Identificar Nested Loop em tabelas grandes
   - Identificar queries N+1 (loop de queries em application code)

2. Verificar índices ausentes:
   - Colunas em WHERE, JOIN, ORDER BY sem índice cobrindo
   - Índices compostos desnecessários ou redundantes
   - Índices nunca usados (pg_stat_user_indexes)

3. Verificar uso de connection pool:
   - Pool size vs max_connections do PostgreSQL
   - Conexões em estado "idle in transaction" por muito tempo

4. Verificar paginação: offset vs cursor — offset > 10k rows é lento

Output: lista priorizada de índices a criar, queries a reescrever, N+1 a resolver
```

---

## FASE 1 — Análise Frontend (Link) — PARALELO (apenas se projeto tem frontend)

```
Task → Link: PERFORMANCE AUDIT — FRONTEND
Framework: [Next.js/Nuxt/Vite] | Deploy: [Vercel/Netlify/Cloudflare]
Lighthouse atual: LCP=[X] INP=[X] CLS=[X] Score=[X]

1. Lighthouse CI completo com análise de causas:
   - LCP > 2.5s: imagem sem preload? font blocking? SSR lento?
   - INP > 200ms: hidration blocking? event handlers pesados? JS no main thread?
   - CLS > 0.1: imagens sem dimensões? ads sem reserva de espaço? fonts swap?
   - TBT: bundle JS excessivo? polyfills desnecessários?

2. Análise do bundle:
   - @next/bundle-analyzer ou vite-bundle-visualizer
   - Identificar módulos duplicados (lodash, date-fns, etc.)
   - Identificar imports pesados que deveriam ser lazy

3. Verificar estratégia de dados:
   - Server Components vs Client Components — dados sendo buscados no servidor?
   - TanStack Query: staleTime configurado? cache sendo reutilizado?
   - Waterfalls de requests em cascata

4. Images: next/image com width/height? formats modernos (webp/avif)?

Output: lista priorizada de fixes de frontend com impacto estimado no score
```

---

## FASE 2 — Revisão Arquitetural dos Gargalos Prioritários (Kakashi)

```
Task → Kakashi: ARCHITECTURE REVIEW — PERFORMANCE
Gargalos identificados (Senku + Edward + Link): [resumo dos achados]
Stack atual: [resumo]

Para cada gargalo prioritário:
1. A causa é arquitetural (ex: N+1 por design do domínio, ausência de cache layer, sync onde deveria ser async)?
2. O fix é cirúrgico (index, query) ou requer mudança de design?
3. Existe padrão já estabelecido no projeto que resolve? (ex: já tem Redis, já tem job queue)
4. Algum fix proposto viola a arquitetura existente (hexagonal, SOLID, DRY)?

Entregue:
- Aprovação ou rejeição de cada fix proposto por Edward/Link
- Alternativas arquiteturais quando o fix proposto é inadequado
- ADR necessário se a solução mudar a arquitetura do sistema
```

---

## FASE 3 — Infra e CDN (Bulma)

```
Task → Bulma: PERFORMANCE AUDIT — INFRA
Deploy: [Vercel/Railway/Fly.io/AWS] | DB: [Neon/Supabase/Railway]
Baseline: [resumo do FASE 0]

1. Cold starts: função serverless vs instância persistente?
   - Ajustar timeout e instâncias mínimas se necessário

2. Edge vs Regional: API e assets estão no edge adequado ao público?
   - Latência América do Sul vs US East — onde os usuários estão?

3. CDN e cache de assets:
   - Headers Cache-Control corretos para estáticos?
   - Imagens no CDN (Cloudinary/Vercel Image Optimization)?

4. DB connection pooling:
   - Neon serverless: usando @neondatabase/serverless com pool?
   - Supabase: pool mode habilitado?
   - Railway: DB no mesmo datacenter que a API?

5. Monitoramento: alertas de latência p95 configurados?
   - Uptime Kuma ou equivalente com threshold de latência?

Output: fixes de infra aplicáveis sem mudança de código
```

---

## FASE 4 — Aplicação dos Fixes e Validação

Execute os fixes priorizados por Senku e aprovados por Kakashi. Ordem recomendada:

1. **DB indexes** (Edward) — menor risco, maior ganho imediato
2. **N+1 queries** (Geralt, se precisar de código) — schema de Prisma/ORM
3. **Frontend bundle** (Link) — code splitting, lazy loading, bundle analysis
4. **Infra adjustments** (Bulma) — CDN, pool, edge
5. **Cache layer** (Geralt/Bulma) — apenas se Kakashi aprovou a arquitetura

Após cada fix, rode o benchmark da FASE 0 novamente e registre a melhoria:

```
MELHORIA DOCUMENTADA — [fix aplicado]
Antes:  p95 = Xms | Lighthouse = X/100
Depois: p95 = Xms | Lighthouse = X/100
Ganho:  -X% latência | +X pontos Lighthouse
```

---

## FASE 5 — Relatório Final (Korosensei)

```
Task → Korosensei: PERFORMANCE REPORT
Baseline: [dados do FASE 0]
Fixes aplicados: [lista com antes/depois de cada um]

Produzir:
1. Relatório consolidado em .claude/analysis/performance-[YYYY-MM-DD].md:
   - Baseline vs resultado final (tabela)
   - Top-3 melhorias com maior impacto
   - Fixes não aplicados e motivo (fora do escopo, risco alto, etc.)
   - Debt técnico de performance remanescente (priorizado)

2. Registrar aprendizados em learnings/:
   - O que causou o problema (prevenção futura)
   - Padrões que funcionaram vs que não funcionaram

3. Propor alertas proativos para evitar recorrência:
   - threshold de latência no CI (k6 com /lelouch --playbook test)
   - query plan check no PR review (Edward deve incluir nas próximas features)
```

---

## Critérios de Sucesso

```
[ ] Backend: p95 dentro do SLA definido ([X]ms)
[ ] Frontend: Lighthouse ≥ 80 (ou meta definida)
[ ] DB: zero queries > 1s nos endpoints críticos
[ ] Nenhum N+1 confirmado nos fluxos principais
[ ] Alerts de latência configurados para capturar regressão futura
[ ] Relatório de performance arquivado em .claude/analysis/
```
