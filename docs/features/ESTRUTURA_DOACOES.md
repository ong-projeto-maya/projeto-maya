# 💰 Estrutura de Doações - Projeto Maya

## 📋 Visão Geral

O sistema de doações do Projeto Maya permite que doadores contribuam de **múltiplas formas simultaneamente**, oferecendo flexibilidade máxima e transparência total.

---

## 🎯 Tipos de Doações Possíveis

### 1. **Doação Geral** (Sem Campanha)

**Como Funciona:**
- Doador acessa `/doacoes`
- Escolhe valor e tipo (única ou mensal)
- **NÃO** seleciona campanha específica
- `campaignId` = `null` na API

**Destino:**
- Fundo geral do Projeto Maya
- Usado para despesas operacionais:
  - Alimentação diária
  - Cuidados veterinários rotineiros
  - Manutenção do abrigo
  - Salários da equipe
  - Contas (água, luz, etc)

**Exemplo:**
```
💰 R$ 100/mês → Fundo Geral
Uso livre pela organização conforme necessidade
```

---

### 2. **Doação para Campanha Específica**

**Como Funciona:**
- Doador acessa `/campanhas` ou `/campanhas/[id]`
- Escolhe uma campanha de interesse
- Define valor e tipo (única ou mensal)
- `campaignId` é enviado para a API

**Destino:**
- Fundo específico da campanha escolhida
- Usado APENAS para aquela finalidade:
  - Castração Solidária → apenas castrações
  - Reforma do Abrigo → apenas reforma
  - Alimentação de Inverno → apenas ração e suplementos

**Exemplo:**
```
🎯 R$ 50/mês → Campanha de Castração Solidária
Uso exclusivo para castrações gratuitas
```

---

## 🔄 Doador Pode Ter Múltiplas Doações?

### ✅ **SIM! Totalmente possível e incentivado!**

Um doador pode ter:
- ✅ **1 doação mensal geral** + **várias doações em campanhas**
- ✅ **Várias doações mensais** em diferentes campanhas
- ✅ **Doações únicas** em várias campanhas ao mesmo tempo
- ✅ **Qualquer combinação** das opções acima

---

## 📊 Exemplo Real - Doador "João Silva"

### Contribuições Ativas:

```
┌─────────────────────────────────────────────────────────┐
│ 💳 DOAÇÃO MENSAL GERAL                                  │
├─────────────────────────────────────────────────────────┤
│ Valor: R$ 100/mês                                       │
│ Início: 15/01/2026                                      │
│ Próxima: 15/04/2026                                     │
│ Total doado: R$ 300 (3 meses)                          │
│ Destino: Fundo geral da organização                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🎯 CAMPANHAS ESPECÍFICAS                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1️⃣ Castração Solidária                                 │
│    💰 R$ 50/mês (Mensal)                               │
│    📅 Início: 15/02/2026                               │
│    💵 Total doado: R$ 100 (2 meses)                    │
│    🔄 Status: Ativa                                    │
│                                                         │
│ 2️⃣ Reforma do Abrigo                                   │
│    💰 R$ 100 (Única)                                   │
│    📅 Data: 01/03/2026                                 │
│    💵 Total doado: R$ 100                              │
│    ✅ Status: Completa                                 │
│                                                         │
│ 3️⃣ Resgate de Emergência                              │
│    💰 R$ 25/mês (Mensal)                               │
│    📅 Início: 20/01/2026                               │
│    💵 Total doado: R$ 75 (3 meses)                     │
│    🔄 Status: Ativa                                    │
└─────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📈 RESUMO MENSAL                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Doação Geral:           R$ 100/mês                     ┃
┃ Campanhas:              R$ 75/mês (50 + 25)            ┃
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ┃
┃ TOTAL MENSAL:           R$ 175/mês                     ┃
┃                                                         ┃
┃ Total Doado (Histórico): R$ 575                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔧 Como Funciona Tecnicamente

### API: `/api/create-checkout-session`

```typescript
// Recebe na requisição
{
  amount: number,           // Valor da doação
  donationType: 'single' | 'monthly',  // Tipo
  campaignId?: string,      // OPCIONAL - se enviado, é doação para campanha
  campaignName?: string     // OPCIONAL - nome da campanha
}
```

### Fluxos:

#### 1️⃣ **Doação Geral**
```
/doacoes → Formulário → API (sem campaignId) → Stripe → Sucesso
```

#### 2️⃣ **Doação para Campanha**
```
/campanhas/[id] → Formulário → API (com campaignId) → Stripe → Sucesso
```

### Metadata Stripe:

**Doação Geral:**
```json
{
  "donationType": "monthly",
  "amount": "100"
}
```

**Doação para Campanha:**
```json
{
  "donationType": "monthly",
  "amount": "50",
  "campaignId": "1",
  "campaignName": "Castração Solidária"
}
```

---

## 📱 Dashboard do Doador

### Seções Exibidas:

#### 1. **Estatísticas Gerais** (topo)
- 💰 Total Doado (soma tudo)
- 🐾 Animais Ajudados
- ❤️ Doações Realizadas
- 📅 Doador Desde

#### 2. **Doação Mensal Geral** (se existir)
- Valor mensal
- Próxima cobrança
- Link para gerenciar assinatura

#### 3. **Minhas Campanhas** (se existir)
- Lista de todas as campanhas apoiadas
- Tipo (Mensal/Única)
- Status (Ativa/Completa)
- Progresso da campanha
- Total doado por campanha
- Resumo: campanhas apoiadas, doações ativas, total

#### 4. **Últimas Doações**
- Histórico completo (gerais + campanhas)
- Data, valor, status
- Link para ver todas

---

## ✅ Benefícios do Sistema Múltiplo

### Para o Doador:

1. **Flexibilidade**
   - Pode apoiar causas gerais E específicas
   - Não precisa escolher apenas uma
   - Liberdade para ajustar contribuições

2. **Transparência**
   - Vê exatamente onde cada real vai
   - Acompanha progresso de campanhas
   - Dashboard centralizado

3. **Engajamento**
   - Conexão emocional com campanhas específicas
   - Sensação de controle sobre a ajuda
   - Certificados por campanha (futuro)

### Para a Organização:

1. **Receita Previsível**
   - Doações mensais gerais = caixa base
   - Campanhas = recursos extras para projetos

2. **Captação Diversificada**
   - Diferentes perfis de doadores
   - Campanhas atraem público específico
   - Menor dependência de grandes doadores

3. **Planejamento Estratégico**
   - Campanhas para necessidades urgentes
   - Fundo geral para operação contínua
   - Metas claras por iniciativa

---

## 🎯 Estratégias de Captação

### Jornada do Doador:

```
1️⃣ PRIMEIRO CONTATO
   → Doação única em campanha específica
   → "Quero ajudar nessa causa!"

2️⃣ ENGAJAMENTO
   → Recebe updates da campanha
   → Vê o impacto da sua doação
   → Conhece mais sobre o projeto

3️⃣ CONVERSÃO
   → Vira doador mensal da campanha
   → "Quero continuar ajudando!"

4️⃣ FIDELIZAÇÃO
   → Adiciona doação mensal geral
   → Apoia múltiplas campanhas
   → Torna-se embaixador
```

---

## 💡 Casos de Uso Reais

### Caso 1: **Doador Iniciante**
```
Maria descobriu o projeto via Instagram
→ Fez doação única de R$ 30 na Castração
→ Recebeu fotos dos animais castrados
→ Virou doadora mensal de R$ 50
```

### Caso 2: **Doador Engajado**
```
Pedro é voluntário
→ Doação mensal geral: R$ 100
→ + Doação mensal Resgate: R$ 30
→ + Doações únicas em emergências
→ Total: ~R$ 200/mês
```

### Caso 3: **Doador Corporativo**
```
Empresa XYZ
→ Apadrinhou campanha Reforma: R$ 5.000 (única)
→ Doação mensal geral: R$ 500
→ Matching de doações dos funcionários
```

---

## 📊 Métricas Importantes

### Para Análise:

1. **Taxa de Conversão**
   - Doação única → Doação mensal
   - Campanha específica → Doação geral
   - Primeiro contato → Doador recorrente

2. **Lifetime Value (LTV)**
   - Quanto cada doador contribui no total
   - Tempo médio de permanência
   - Crescimento de contribuição ao longo do tempo

3. **Engajamento por Campanha**
   - Qual tipo de campanha converte mais
   - Ticket médio por categoria
   - Taxa de retenção por campanha

---

## 🔐 Gestão de Assinaturas

### Doador Pode:

✅ Pausar doação mensal geral (mantém campanhas)  
✅ Pausar doação em campanha específica (mantém geral)  
✅ Alterar valor de qualquer doação mensal  
✅ Cancelar uma ou várias assinaturas  
✅ Reativar assinaturas pausadas  

### Independência Total:

- Cada doação mensal é uma assinatura Stripe separada
- Cancelar uma NÃO afeta as outras
- Doador tem controle granular

---

## 🚀 Futuras Melhorias

### Em Desenvolvimento:

1. **Limite por Campanha**
   - Impedir doações acima da meta
   - Redirecionar excedente para outras causas

2. **Recomendações Inteligentes**
   - Sugerir campanhas baseado em histórico
   - "Pessoas que apoiaram X também apoiaram Y"

3. **Gamificação**
   - Badges por número de campanhas apoiadas
   - Níveis especiais para doadores multi-campanha
   - Certificados personalizados

4. **Relatórios Personalizados**
   - PDF mensal com impacto total
   - Breakdown por campanha
   - Declaração para imposto de renda

---

## 📞 FAQs

**P: Posso ter várias doações mensais ativas?**  
R: Sim! Você pode ter quantas quiser (geral + campanhas).

**P: Se cancelar uma doação mensal, as outras são afetadas?**  
R: Não! Cada assinatura é independente.

**P: Como sei quanto estou doando no total por mês?**  
R: No dashboard há um resumo claro com o total mensal.

**P: Posso mudar o valor de uma doação mensal específica?**  
R: Sim! Acesse "Gerenciar Assinatura" para cada doação.

**P: A doação geral pode ser usada em campanhas?**  
R: Não. Doações gerais vão para o fundo operacional. Para campanhas específicas, faça uma doação direta na campanha.

**P: Recebo recibo de todas as doações?**  
R: Sim! Cada transação gera um recibo separado, disponível no dashboard.

---

**Última atualização:** 06 de Março de 2026  
**Versão:** 1.0.0
