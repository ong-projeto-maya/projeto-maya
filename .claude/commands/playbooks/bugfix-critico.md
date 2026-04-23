---
description: "Playbook de hotfix crítico — modo emergência para bugs em produção. Pipeline enxuto e sequencial: Levi (diagnóstico + correctness) → Snake (segurança do fix) → Bulma (deploy). Agentes de produto, UX e discovery são automaticamente excluídos. Use para bugs P0 que afetam usuários em produção agora."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Bugfix Crítico (Hotfix)

Use quando: bug em produção que afeta usuários agora — perda de dados, autenticação quebrada, pagamentos falhos, erros 500 em fluxos críticos, vazamento de dados. Velocidade e segurança acima de cobertura completa.

## Gatilho

```
/lelouch --hotfix "usuários não conseguem fazer login após o deploy"
/lelouch --hotfix "pagamentos Stripe retornando 500 em produção"
/lelouch --hotfix "migration quebrou tabela de orders — rollback necessário"
/lelouch --playbook hotfix "API de scoring retornando null para todos os casos"
```

## Filosofia

> "Primeiro pare o sangramento. Depois entenda o porquê. Nunca misture as duas etapas."

Modo emergência significa:
- **Menos agentes** — sem Holo, Erwin, Isabelle, Nami, Dio, Light, Senku, Korosensei, Phoenix (a menos que o bug seja regulatório)
- **Sem fases de produto** — nenhum story mapping, nenhum discovery, nenhuma documentação primeiro
- **Pipeline sequencial** — Levi diagnostica → Snake valida segurança do fix → Bulma faz deploy e monitora
- **Fix mínimo e reversível** — patch cirúrgico, não refatoração. O fix deve ser revertível em < 5 min

## Quando NÃO usar

- Bug relatado mas não confirmado em produção → confirme primeiro, depois ative o hotfix
- Bug de experiência do usuário não crítico (UI quebrada, label errado) → use fluxo normal
- Performance degradada mas serviço operacional → use fluxo normal com `/lelouch`
- Refatoração preventiva → use `/lelouch --playbook refatoracao`

---

## FASE 0 — Triagem (Lelouch, < 3 minutos)

Antes de qualquer coisa, responda:

1. **Qual é o comportamento observado?** (ex: "login retorna 401 para todos os usuários")
2. **Qual o impacto?** (% de usuários afetados, fluxos críticos bloqueados, dados em risco?)
3. **Quando começou?** (após qual deploy, qual horário?)
4. **Há rollback disponível?** (variável de feature flag, reverter último deploy?)

```
🚨 TRIAGEM — [nome do bug]

Comportamento: [o que está quebrando]
Impacto:       [quem, quantos, o quê]
Início:        [HH:MM após deploy de [commit/versão]]
Rollback:      [disponível / não disponível — motivo]

Decisão: [ ] Rollback imediato  [ ] Fix direto  [ ] Feature flag off
```

**Regra:** se rollback está disponível e o impacto é Alto → faça rollback PRIMEIRO, depois investigue. Nunca tente corrigir sob pressão quando reverter é fácil.

---

## FASE 1 — Diagnóstico + Fix (Levi)

Levi entra em **modo diagnóstico forçado** — não apenas revisa código, mas invest​iga a causa raiz.

```
Task → Levi: HOTFIX MODE
Bug reportado: [descrição exata]
Impacto: [quem e o quê]
Commits suspeitos: [git log --oneline HEAD~5]
Arquivos modificados no último deploy: [lista]

Diagnosticar:
1. Leia os arquivos modificados no último deploy
2. Trace o fluxo do bug (qual endpoint → qual use case → qual linha)
3. Identifique a causa raiz (não o sintoma)
4. Produza o fix mínimo e cirúrgico

Entregue:
- Causa raiz identificada (linha + arquivo)
- Patch mínimo (diff exato — sem refatorações extras)
- Teste de regressão básico que captura o bug antes do fix
- Confirmação de que nenhuma outra funcionalidade é afetada pelo patch
```

**Critério de bloqueio:** se Levi encontrar causa raiz ambígua ou fix que exija mudança estrutural → escalar para Kakashi antes de continuar.

---

## FASE 2 — Revisão de Segurança do Fix (Snake)

Snake revisa **apenas o patch** — não o codebase inteiro.

```
Task → Snake: HOTFIX SECURITY REVIEW
Patch a revisar: [diff do fix do Levi]
Contexto: bugfix em produção — revisar apenas o patch, não o sistema completo

Verificar:
1. O fix não introduz nova vulnerabilidade (injection, auth bypass, expose de dados)
2. O fix não expõe PII nos logs durante o diagnóstico
3. Se o bug envolvia dados sensíveis: confirmar que nenhum dado vazou durante o período
4. Se o bug era de autenticação: confirmar que sessões comprometidas foram invalidadas

Output: ✅ Fix seguro — aprovar deploy | 🔴 Fix bloquado — [motivo]
```

**Regra:** Snake tem veto de deploy. 🔴 bloqueia completamente — fix volta para Levi.

---

## FASE 3 — Deploy de Emergência (Bulma)

Deploy apenas após Levi ✅ e Snake ✅.

```
Task → Bulma: EMERGENCY DEPLOY
Fix aprovado por: Levi ✅ Snake ✅
Patch: [lista de arquivos modificados]

1. Confirmar que os testes de regressão passam localmente
2. Deploy em staging primeiro (se disponível) — smoke test < 2 minutos
3. Deploy em produção com observação ativa por 15 minutos
4. Monitorar logs em tempo real durante os primeiros 5 minutos após deploy
5. Confirmar que o comportamento reportado está resolvido
6. Registrar no CHANGELOG.md: [hotfix][YYYY-MM-DD] descrição + root cause
```

**Monitoramento pós-deploy obrigatório:**
- [ ] Erro 500 zerado no endpoint afetado
- [ ] Taxa de erro nos logs dentro do normal (< 0.1%)
- [ ] Stakeholders notificados da resolução
- [ ] Incident report iniciado (mesmo que breve)

---

## FASE 4 — Post-Mortem e Prevenção (assíncrono, após estabilização)

Esta fase é **não urgente** — executa depois que a produção voltou ao normal.

```
Task → Korosensei: POST-MORTEM do hotfix
Bug: [descrição]
Root cause (Levi): [causa raiz]
Fix aplicado: [resumo]
Duração do incidente: [HH:MM a HH:MM]

Produzir:
1. Post-mortem de 1 página em .claude/incidents/YYYY-MM-DD-[slug].md
   - Timeline do incidente
   - Root cause (técnica + processo)
   - Impacto quantificado
   - Ações corretivas (prevenção)
   - Lição aprendida (registrar em learnings/)

2. Propor 1-2 melhorias para evitar recorrência:
   - ex: adicionar teste de regressão ao CI
   - ex: ajustar alerta de monitoramento para capturar mais cedo
   - ex: melhorar instrução do agente que gerou o bug
```

---

## Checklist de Hotfix

```
[ ] Triagem completa (comportamento, impacto, início, rollback)
[ ] Rollback avaliado — se possível e adequado, executar primeiro
[ ] Levi: causa raiz identificada e patch produzido
[ ] Levi: teste de regressão básico criado
[ ] Snake: fix revisado e aprovado (🔴 bloqueia deploy)
[ ] Bulma: deploy em staging + smoke test
[ ] Bulma: deploy em produção + monitoramento 15 min
[ ] Stakeholders notificados
[ ] CHANGELOG atualizado com [hotfix]
[ ] Post-mortem agendado (Korosensei) — max 24h após resolução
```

## Protocolo de Rollback

Se a Fase 1 ou 2 revelar que o fix é muito complexo ou arriscado:

```
1. Execute rollback imediato do último deploy (reverta via Vercel/Railway/Fly UI)
2. Confirme que o sistema voltou ao estado anterior (testes de smoke)
3. Abra uma issue/task com a análise do Levi
4. Trate como feature normal com /lelouch — sem pressão de emergência
```

> Rollback bem executado > fix arriscado sob pressão.
