---
description: "Playbook para implementar autenticação completa do zero: registro, login, JWT, refresh token, recuperação de senha, proteção de rotas. Use quando: projeto novo sem auth, migração de sessão para JWT, adicionar OAuth/SSO."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Autenticação Completa

Use este playbook como input para o `/lelouch` ao invés de descrever o escopo do zero.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/auth-completo.md] no projeto [Nome]
```

## Escopo Padrão

- Registro com verificação de e-mail
- Login (e-mail + senha) com brute-force protection
- JWT access token (15min) + refresh token (30 dias, rotation)
- Recuperação de senha (link seguro por e-mail, expira em 1h)
- Logout (invalidação de refresh token)
- Proteção de rotas (guards/middleware)
- Rate limiting nos endpoints de auth
- Audit log de eventos de autenticação

## Fases e Agentes

### FASE 1 — Arquitetura (paralelo)
| Agente | Entrega |
|--------|---------|
| **Kakashi** | ADR: JWT vs session, refresh token strategy (rotation vs sliding), cookie httpOnly vs localStorage |
| **Phoenix** | Requisitos LGPD: consentimento, finalidade de uso dos dados, política de privacidade |
| **Snake** | Threat model: STRIDE para endpoints de auth |

### FASE 2 — Banco de Dados (após Kakashi)
| Agente | Entrega |
|--------|---------|
| **Edward** | Schema: User + RefreshToken + EmailVerification + PasswordReset + AuthAuditLog |

### FASE 3 — Backend (após Edward)
| Agente | Entrega |
|--------|---------|
| **Geralt** | Use cases: Register, Login, RefreshToken, Logout, ForgotPassword, ResetPassword |

### FASE 4 — Frontend (paralelo com Geralt ou após)
| Agente | Entrega |
|--------|---------|
| **Isabelle** | Formulários de auth: design, estados, feedback de erro |
| **Link** | Páginas de auth, guards de rota, interceptors de token |

### FASE 5 — Segurança e Testes (paralelo, após Geralt + Link)
| Agente | Entrega |
|--------|---------|
| **Snake** | Auditoria completa: brute force, token leakage, CSRF, rate limiting, headers |
| **L Lawliet** | Testes: register flow, login/logout, refresh, expired token, invalid credentials |

### FASE 5.5 — Code Review (após Snake + L Lawliet)
| Agente | Entrega |
|--------|---------|
| **Levi** | Revisão de correctness: fluxo de refresh rotation, expiração de tokens, idempotência do reset de senha, ausência de bypass de rate limiting |

### FASE 6 — Deploy (após Levi)
| Agente | Entrega |
|--------|---------|
| **Bulma** | Envs seguras (JWT_SECRET, SMTP, etc.), deploy com secrets management |
| **Nami** | Documentar fluxo de auth, endpoints, variáveis de ambiente |

## Decisões que devem ser tomadas na FASE 1

| Decisão | Opções | Critério de escolha |
|---------|--------|---------------------|
| Armazenamento do access token | Cookie httpOnly / localStorage / memory | **Cookie httpOnly** se não há mobile; memory + cookie para SPAs |
| Refresh token rotation | Sim (mais seguro) / Não (mais simples) | **Sim** para qualquer produto com dados sensíveis |
| OAuth providers | Google / GitHub / nenhum | Apenas se o ICP usa regularmente (não adicionar por padrão) |
| 2FA | TOTP / SMS / nenhum | Apenas para dados sensíveis (saúde, financeiro, jurídico) |

## Especificações de segurança obrigatórias

```
- Senha: bcrypt com salt rounds ≥ 12
- JWT secret: ≥ 256 bits (openssl rand -base64 32)
- Access token TTL: 15 minutos
- Refresh token TTL: 30 dias, armazenado em httpOnly cookie
- Rate limiting: máx 5 tentativas de login por IP por 15min
- Audit log: login, logout, falha de login, reset de senha
- Email de verificação expira em 24h
- Link de reset de senha expira em 1h e é single-use
```

## Critérios de aceite mínimos

- [ ] Usuário não consegue logar com senha errada mais de 5 vezes seguidas
- [ ] Token expirado retorna 401 (não 403 ou 500)
- [ ] Refresh token rotation funcionando (token antigo invalidado após uso)
- [ ] Rota protegida retorna 401 sem token e 403 sem permissão
- [ ] Snake sem bloqueantes críticos
- [ ] L Lawliet com cobertura ≥ 80% nos use cases de auth
- [ ] Levi sem findings 🔴 (correctness review aprovado)
