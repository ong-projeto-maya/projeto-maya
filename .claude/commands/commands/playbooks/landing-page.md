---
description: "Playbook para criar uma landing page de produto completa: hero, features, pricing, FAQ, CTA, SEO e analytics. Use quando: novo produto, novo módulo com landing pública, redesign de landing, A/B test de copy."
allowed-tools: [Read, Write, Edit, Glob, Grep, TodoRead, TodoWrite]
---

# Playbook: Landing Page

Use este playbook como input para o `/lelouch` ao invés de descrever o escopo do zero.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/landing-page.md] para [Nome do Produto/Módulo]
```

## Escopo Padrão

- Seções: Hero + Value Prop + Features + Social Proof + Pricing + FAQ + CTA Final + Footer
- SEO on-page: title tag, meta description, OG tags, JSON-LD
- Analytics: eventos de scroll depth, CTA click, form submit
- Responsive (mobile-first)
- Performance: LCP < 2.5s, CLS < 0.1

## Fases e Agentes

### FASE 1 — Estratégia (paralelo)
| Agente | Entrega |
|--------|---------|
| **Holo** | Tamanho de mercado, dores rankeadas, canais de aquisição do nicho |
| **Erwin** | ICP, proposta de valor única (UVP), benefícios vs features |

### FASE 2 — Design e Copy (paralelo, após Erwin + Holo)
| Agente | Entrega |
|--------|---------|
| **Isabelle** | Paleta, tipografia, componentes visuais, wireframe de alta fidelidade |
| **Dio** | Headline, subheadline, copy de cada seção, CTAs, FAQ, pricing copy |

### FASE 3 — Implementação (após Isabelle + Dio)
| Agente | Entrega |
|--------|---------|
| **Link** | Landing page responsiva com todos os componentes e copy integrados |

### FASE 4 — Qualidade + SEO (paralelo, após Link)
| Agente | Entrega |
|--------|---------|
| **Snake** | Headers CSP, XSS, form security, LGPD (cookie banner se necessário) |
| **Dio** | Instrumentar PostHog/GA4: scroll events, CTA clicks, form submits |
| **Levi** | Revisão de correctness: formulários enviam dados corretos, analytics dispara nos eventos certos, responsividade nos breakpoints definidos |
| **Nami** | Revisar copy final, consistência de voz, meta tags preenchidas |

### FASE 5 — Deploy (após Fase 4)
| Agente | Entrega |
|--------|---------|
| **Bulma** | Deploy em produção + domínio + HTTPS + CDN |

### FASE 6 — Medição (após deploy, 7+ dias)
| Agente | Entrega |
|--------|---------|
| **Light** | Análise de funil: visitas → CTA click → conversão |
| **Korosensei** | Retrospectiva, hipóteses de A/B test para próxima iteração |

## Assunções padrão deste playbook

- Mobile-first — breakpoints: 375px / 768px / 1280px
- Imagens com lazy loading e formatos modernos (WebP/AVIF)
- Sem JavaScript pesado na above-the-fold
- Cookie banner apenas se analytics não-anônimo (GA4 requer consentimento LGPD)
- Formulário de captura de e-mail → integrar com lista de email existente

## Critérios de aceite mínimos

- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] OG tags corretos (testar com https://metatags.io)
- [ ] Eventos de analytics chegando no PostHog/GA4
- [ ] Formulário de captura funcionando em staging
- [ ] Dio aprovou copy final
- [ ] Levi sem findings 🔴 (correctness review aprovado)
