# 🎯 Sistema de Campanhas - Projeto Maya

## 📋 Visão Geral

O sistema de campanhas permite que o Projeto Maya crie **causas específicas** para arrecadação de fundos, oferecendo aos doadores transparência total sobre onde sua doação será aplicada.

---

## ✨ Funcionalidades

### Para Usuários (Doadores)

- ✅ **Listagem de campanhas ativas** com filtros por categoria
- ✅ **Página detalhada** de cada campanha com informações completas
- ✅ **Doação única ou recorrente** para campanhas específicas
- ✅ **Barra de progresso visual** mostrando meta e valor arrecadado
- ✅ **Contador de dias restantes** para cada campanha
- ✅ **Compartilhamento** de campanhas via redes sociais
- ✅ **Lista de benefícios** que a doação proporcionará
- ✅ **História de impacto** mostrando o que cada valor pode fazer

### Para Administradores

- ✅ Sistema de dados preparado para fácil gerenciamento
- ✅ Categorização automática (Saúde, Resgate, Infraestrutura, Alimentação)
- ✅ Sistema de urgência (Baixa, Média, Alta, Urgente)
- ✅ Controle de datas de início e fim
- ✅ Status ativo/inativo

---

## 📁 Estrutura de Arquivos

```
projeto-maya/
├── data/
│   └── campaigns.ts              # Dados das campanhas
├── app/
│   ├── campanhas/
│   │   ├── page.tsx              # Listagem de todas as campanhas
│   │   └── [id]/
│   │       └── page.tsx          # Página individual da campanha
│   └── api/
│       └── create-checkout-session/
│           └── route.ts          # API Stripe (atualizada para campanhas)
└── components/
    └── home/
        └── CampaignsCTA.tsx      # Card de destaque na home
```

---

## 🎨 Categorias de Campanhas

| Categoria | Descrição | Cor de Badge |
|-----------|-----------|--------------|
| **Saúde** | Castrações, tratamentos, vacinas | Verde (`maya-green`) |
| **Resgate** | Operações de resgate emergencial | Rosa (`maya-pink`) |
| **Infraestrutura** | Reforma do abrigo, equipamentos | Laranja (`maya-orange`) |
| **Alimentação** | Ração, suplementos, alimentação especial | Areia (`maya-sand`) |

---

## 🚨 Níveis de Urgência

| Nível | Cor | Uso |
|-------|-----|-----|
| **Baixa** | Verde (`maya-green`) | Campanhas de longo prazo |
| **Média** | Azul (`maya-blue`) | Campanhas importantes mas não críticas |
| **Alta** | Laranja (`maya-orange`) | Campanhas com prazo definido |
| **Urgente** | Rosa (`maya-pink`) | Emergências que precisam de atenção imediata |

---

## 📊 Campanhas Pré-Cadastradas

### 1. Campanha de Castração Solidária ⭐
- **Meta**: R$ 15.000
- **Categoria**: Saúde
- **Urgência**: Alta
- **Benefícios**: 50 castrações, controle populacional, prevenção de doenças

### 2. Reforma do Abrigo
- **Meta**: R$ 25.000
- **Categoria**: Infraestrutura
- **Urgência**: Urgente
- **Benefícios**: Capacidade para 30+ animais, área externa ampliada

### 3. Alimentação de Inverno
- **Meta**: R$ 8.000
- **Categoria**: Alimentação
- **Urgência**: Média
- **Benefícios**: Ração premium para 100 animais durante o inverno

### 4. Resgate de Emergência
- **Meta**: R$ 10.000
- **Categoria**: Resgate
- **Urgência**: Urgente
- **Benefícios**: Fundo 24/7 para resgates críticos

### 5. Programa de Apadrinhamento
- **Meta**: R$ 12.000
- **Categoria**: Saúde
- **Urgência**: Baixa
- **Benefícios**: Acompanhamento mensal, fotos exclusivas, certificado

### 6. Tratamento de Pets Especiais
- **Meta**: R$ 18.000
- **Categoria**: Saúde
- **Urgência**: Alta
- **Benefícios**: Consultas especializadas, fisioterapia, medicação contínua

---

## 🔧 Como Adicionar uma Nova Campanha

### Editar o arquivo `data/campaigns.ts`

```typescript
{
  id: '7',
  title: 'Nome da Campanha',
  slug: 'nome-da-campanha',
  description: 'Descrição curta (para cards)',
  longDescription: 'Descrição detalhada completa',
  goal: 10000, // Meta em reais
  raised: 0,   // Valor arrecadado
  startDate: '2026-03-15',
  endDate: '2026-06-30',
  isActive: true,
  image: 'https://link-da-imagem.jpg',
  icon: 'Heart', // Nome do ícone Lucide
  category: 'saude', // saude | resgate | infraestrutura | alimentacao
  urgency: 'alta',   // baixa | media | alta | urgente
  benefits: [
    'Benefício 1',
    'Benefício 2',
    'Benefício 3'
  ],
  impactStory: 'História de impacto que explica o valor de cada doação'
}
```

---

## 💳 Integração com Stripe

### Doações para Campanhas

O sistema está preparado para enviar ao Stripe:
- **Valor da doação**
- **Tipo** (única ou recorrente)
- **ID da campanha**
- **Nome da campanha**

### Metadados Stripe

```javascript
metadata: {
  donationType: 'single' | 'monthly',
  amount: '100.00',
  campaignId: '1',
  campaignName: 'Campanha de Castração Solidária'
}
```

### URLs de Retorno

**Sucesso:**
```
/doacoes/sucesso?session_id={CHECKOUT_SESSION_ID}&campaign={campaignId}
```

**Cancelamento:**
```
/campanhas/{campaignId}
```

---

## 🎯 Funcionalidades Técnicas

### Funções Auxiliares

```typescript
// Buscar campanha por ID
getCampaignById(id: string): Campaign | undefined

// Buscar campanha por slug
getCampaignBySlug(slug: string): Campaign | undefined

// Listar apenas campanhas ativas
getActiveCampaigns(): Campaign[]

// Calcular progresso (0-100%)
getCampaignProgress(campaign: Campaign): number

// Calcular dias restantes
getCampaignDaysLeft(campaign: Campaign): number
```

---

## 📱 Responsividade

Todas as páginas são **100% responsivas**:
- ✅ Mobile-first design
- ✅ Grid adaptativo (1 → 2 → 3 colunas)
- ✅ Cards otimizados para toque
- ✅ Sidebar sticky no desktop
- ✅ Imagens otimizadas (Next/Image)

---

## 🎨 Design System

### Cores Conforme Brandbook

Todas as cores seguem o **Brandbook Projeto Maya**:
- Verde principal: `#B2C09D`
- Azul: `#96B6D3`
- Laranja: `#D5934F`
- Rosa: `#DA5F75`
- Marrom: `#564334`

### Tipografia

- **Títulos**: Caprasimo (conforme brandbook)
- **Textos**: Nunito (conforme brandbook)

### Tom de Voz

Seguindo as diretrizes do brandbook:
- ✅ **Verdadeiro** - Transparência total
- ✅ **Ativista** - Engajado na causa
- ✅ **Carinhoso** - Linguagem acolhedora e democrática

**Exemplos no código:**
- *"Nossos amiguinhos..."*
- *"Contribua pra causas específicas..."*
- *"Veja exatamente o impacto da sua doação!"*

---

## 📈 Estatísticas na Home

O componente `CampaignsCTA` mostra:
- Número de campanhas ativas
- Progresso geral (%)
- Total arrecadado (R$)
- Preview das 3 primeiras campanhas

---

## 🔗 Navegação

### Menu Principal

Link "**Campanhas**" adicionado ao Header entre "Doar" e "Quiz"

### Breadcrumbs

```
Início > Campanhas
Início > Campanhas > Campanha de Castração Solidária
```

---

## 🚀 Próximos Passos (Futuro)

### Backend (Quando conectar banco de dados)

- [ ] Tabela `campaigns` no banco
- [ ] Sistema de atualização automática de `raised`
- [ ] Webhook do Stripe para atualizar progresso
- [ ] Painel admin para criar/editar campanhas
- [ ] Sistema de notificações quando campanha atinge meta
- [ ] Relatórios de transparência por campanha

### Features Adicionais

- [ ] Timeline de updates da campanha
- [ ] Galeria de fotos/vídeos
- [ ] Comentários de apoiadores
- [ ] Sistema de recompensas por nível de doação
- [ ] Certificados digitais para doadores
- [ ] Ranking de top apoiadores (opcional)
- [ ] Integração com redes sociais (Open Graph)

---

## 📊 SEO e Performance

### Meta Tags Recomendadas

```typescript
// Em cada página de campanha
export const metadata = {
  title: `${campaign.title} - Projeto Maya`,
  description: campaign.description,
  openGraph: {
    title: campaign.title,
    description: campaign.description,
    images: [campaign.image],
    type: 'website',
  },
}
```

### Performance

- ✅ Images otimizadas com Next/Image
- ✅ Lazy loading automático
- ✅ Code splitting por rota
- ✅ Componentes client-side apenas quando necessário

---

## 🎯 Métricas de Sucesso

### KPIs Sugeridos

1. **Taxa de Conversão**: % de visitantes que doam
2. **Ticket Médio**: Valor médio das doações
3. **Recorrência**: % de doações mensais vs únicas
4. **Compartilhamentos**: Quantas vezes cada campanha foi compartilhada
5. **Tempo na Página**: Engajamento com o conteúdo
6. **Taxa de Conclusão**: % que completam a doação após clicar

---

## 💡 Dicas de Uso

### Para Criar Campanhas Efetivas

1. **Título Claro**: Seja específico sobre o objetivo
2. **Meta Realista**: Valores alcançáveis aumentam a credibilidade
3. **Prazo Definido**: Senso de urgência motiva doações
4. **História Impactante**: Conte histórias reais e emocionantes
5. **Benefícios Tangíveis**: Liste exatamente o que cada valor faz
6. **Imagens de Qualidade**: Fotos dos animais/abrigo reais
7. **Updates Regulares**: Mantenha apoiadores informados

### Exemplos de Valores de Impacto

- R$ 25 = Ração para 1 pet por 1 semana
- R$ 50 = Vacina completa
- R$ 100 = Consulta veterinária
- R$ 300 = Castração completa
- R$ 500 = Resgate de emergência

---

## 🆘 Suporte

### Problemas Comuns

**Campanha não aparece na listagem:**
- Verifique se `isActive: true`
- Confira se a data de término não passou

**Progresso não atualiza:**
- Valores são mockados em `campaigns.ts`
- Após conectar banco, será automático via webhook

**Imagens não carregam:**
- Use URLs públicas e válidas
- Prefira Unsplash ou Imgur para testes

---

## 📝 Licença e Créditos

**Sistema desenvolvido para**: Projeto Maya  
**Brandbook por**: carolina maluly  
**Implementação**: Março 2026  
**Versão**: 1.0.0

---

*"nós acreditamos que o amor transforma."* 💚🎯
