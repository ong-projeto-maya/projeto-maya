---
description: "Playbook para integrar uma API ou serviço externo (REST, GraphQL, webhook ou SDK) ao projeto. Cobre: contrato de dados, secrets, retry/circuit-breaker, testes com mock, documentação. Use quando: Stripe, SendGrid, OpenAI, Twilio, ViaCEP, SEFAZ, qualquer provedor de terceiros."
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TodoRead, TodoWrite]
---

# Playbook: Integração com API Externa

Use quando: o projeto precisa consumir um serviço externo — pagamento, e-mail, SMS, IA, geolocalização, consulta fiscal, assinatura eletrônica, CRM, ERP, qualquer provedor via HTTP ou SDK.

## Gatilho

```
/lelouch [usar playbook .claude/commands/playbooks/api-integracao-externa.md] para integrar [Nome do Serviço] no projeto [Nome do Projeto]
```

## Escopo Padrão

- Mapeamento do contrato de dados (request/response da API externa)
- Configuração segura de secrets (variáveis de ambiente, sem hardcode)
- Adapter/Wrapper isolado (infraestrutura — não vazar o SDK para o domínio)
- Retry com backoff exponencial + circuit breaker para falhas de rede
- DTOs de resposta com validação (não confiar cegamente na API externa)
- Testes unitários com mock do HTTP client (sem chamadas reais nos testes)
- Documentação: como configurar, variáveis necessárias, exemplos de uso

## Fases

### FASE 0 — Contrato e Segurança (obrigatória antes de qualquer código)

```
Task → Erwin: definir o contrato de uso
  - Qual caso de uso aciona essa integração?
  - Quais dados enviamos para a API? Quais recebemos?
  - A API tem rate limits? Qual o SLA declarado?
  - Precisamos de webhook de retorno (async) ou é só request/response?

Task → Snake: avaliação de segurança da integração
  - Como os secrets (API Key, Client Secret, Bearer Token) serão armazenados?
  - A API retorna dados sensíveis (PII, dados financeiros)? Como vamos tratar?
  - Os dados do usuário são enviados para um terceiro — há implicação de LGPD?
  - O SDK da API é seguro? Verificar CVEs conhecidos e última atualização
```

> ⚠️ **AGUARDAR** Snake e Erwin antes de avançar — não instale o SDK sem essa análise

### FASE 1 — Contrato de Dados e Configuração (paralelo, após FASE 0)

```
Task → Kakashi: definir a camada de abstração
  - Criar interface/port para o serviço externo (ex: IPaymentGateway, IEmailService)
  - O domínio depende da interface, NÃO do SDK
  - Definir onde o adapter vive (infrastructure/ ou core/integrations/)
  - ADR se for decisão nova de arquitetura

Task → Edward: mapear impacto no schema de dados
  - A integração precisa persistir IDs externos? (ex: stripe_customer_id)
  - Adicionar campos necessários no model (ex: externalId, webhookStatus)
  - Migration se necessário
```

### FASE 2 — Implementação do Adapter (após FASE 1)

```
Task → Geralt: implementar o adapter de infraestrutura
  - Ler secrets EXCLUSIVAMENTE de process.env / ConfigService — nunca hardcode
  - Implementar a interface definida pelo Kakashi (FASE 1)
  - Retry com backoff exponencial (máximo 3 tentativas, delays: 1s, 2s, 4s)
  - Circuit breaker: após N falhas consecutivas, fail fast com erro claro
  - Timeout configurável (padrão razoável: 10s REST, 30s para IA)
  - Parsear e validar o response com DTOs tipados — não retornar `any`
  - Log estruturado: registrar cada chamada com método, status e duração
  - NUNCA logar a API Key ou dados sensíveis do usuário

  Se webhook:
  - Criar endpoint de recebimento separado
  - Validar assinatura do webhook (ex: Stripe-Signature header)
  - Processar de forma idempotente (duplicate webhook = mesma resposta)
```

### FASE 3 — Testes (após FASE 2)

```
Task → L Lawliet: testes unitários e de integração
  - Mockar o HTTP client ou SDK — zero chamadas reais para a API externa nos testes
  - Testar caminho feliz (success response)
  - Testar timeout / rede indisponível → deve lançar erro tipado
  - Testar retry: confirmar que a lógica de backoff é acionada
  - Testar circuit breaker: após N falhas → fail fast
  - Se webhook: testar validação de assinatura (válida e inválida)
  - Testar que a interface do domínio está corretamente isolada
```

### FASE 3.5 — Code Review (após L Lawliet)

```
Task → Levi: revisão de correctness do adapter
  - O adapter implementa corretamente a interface (não vaza tipos do SDK)?
  - A lógica de retry tem backoff correto (delays crescentes, não fixos)?
  - O circuit breaker reseta após período de cooldown?
  - A validação do response da API externa cobre campos obrigatórios?
  - Webhook é processado de forma idempotente (mesmo eventId = mesma resposta)?
```

### FASE 4 — Documentação e Configuração de Deploy (paralelo após Levi)

```
Task → Nami: documentar a integração
  - README: seção "Integrações" com nome do serviço, link para docs oficiais
  - Variáveis de ambiente necessárias (template .env.example atualizado)
  - Como testar localmente (sandbox / test mode do provedor)
  - O que monitorar em produção (taxa de erro, latência)

Task → Bulma: configurar em produção
  - Adicionar secrets no provedor de deploy (Vercel, Railway, Fly.io)
  - Configurar alertas se a integração for crítica (pagamento, e-mail transacional)
  - Verificar que o .env.example está atualizado sem valores reais
  - Confirmar que CI/CD não expõe secrets em logs
```

## Critérios de Aceitação Mínimos

```
✅ Nenhuma API Key ou secret no código-fonte (git grep para secrets)
✅ Snake aprovou LGPD e segurança de dados (FASE 0)
✅ Adapter implementa a interface — domínio não importa o SDK diretamente
✅ Levi sem findings 🔴 (correctness review aprovado)
✅ Retry + timeout implementados e testados
✅ Testes passando sem chamadas reais para a API externa
✅ .env.example atualizado com as novas variáveis
✅ Build passa sem erros
✅ CHANGELOG.md atualizado
```

## Padrões de Implementação por Tipo de Integração

### REST API simples (fetch/axios)

```typescript
// ✅ Porta no domínio — independente do provedor
export interface IEmailService {
  sendTransactional(to: string, template: string, data: Record<string, unknown>): Promise<void>;
}

// ✅ Adapter na infraestrutura — sabe sobre o provedor
export class SendGridAdapter implements IEmailService {
  constructor(private readonly config: ConfigService) {}

  async sendTransactional(to: string, template: string, data: Record<string, unknown>): Promise<void> {
    // retry + timeout aqui, não no use case
  }
}
```

### SDK com tipos opacos (Stripe, Twilio)

- Criar um Wrapper que converte os tipos do SDK para os tipos do domínio
- Jamais deixar o tipo do SDK vazar para fora do adapter

### Webhook assíncrono

- Processar de forma idempotente: checar se o evento já foi processado (usar eventId único)
- Confirmar recebimento rapidamente (200 imediato) e processar em background queue se pesado

## Armadilhas Comuns

- **SDK no use case** — se o use case importa o SDK diretamente, o domínio vaza para a infraestrutura. Sempre intermediar com interface
- **Sem retry** — APIs externas falham. Todo adapter precisa de retry com backoff
- **Hardcode de secret** — use process.env SEMPRE. Revisão do Snake antes do merge
- **Sem mock nos testes** — testes que chamam APIs reais são lentos, instáveis e custam dinheiro
- **Confiar no response da API externa sem validar** — APIs externas mudam schema sem aviso. Use DTOs com class-validator ou Zod para parsear o response
- **LGPD ignorada** — enviar dados de usuário para terceiros sem base legal é infração. Snake verifica isso na FASE 0
