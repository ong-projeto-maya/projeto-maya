# Gerenciamento de Campanhas - Admin e Doador

## 📋 Resumo

Este documento detalha a implementação do gerenciamento de campanhas na área administrativa e a visualização das campanhas apoiadas na área do doador.

---

## 🔧 Funcionalidades Implementadas

### 1. Área Administrativa - Gerenciamento de Campanhas

**Localização:** `/admin/campanhas`

#### Funcionalidades:

- **Dashboard de Campanhas**
  - Estatísticas gerais (total de campanhas, campanhas ativas, total arrecadado, progresso geral)
  - Filtros por status (todas, ativas, inativas)
  - Tabela completa com informações detalhadas de cada campanha
  
- **Informações da Tabela:**
  - Imagem da campanha
  - Título e meta financeira
  - Categoria e nível de urgência
  - Progresso (% e valor arrecadado)
  - Dias restantes até o fim
  - Status (ativa/inativa)
  
- **Ações Disponíveis:**
  - 👁️ Ver campanha no site (abre em nova aba)
  - ✏️ Editar campanha (placeholder para implementação futura)
  - 🗑️ Excluir campanha (placeholder para implementação futura)

#### Cards de Estatísticas:

1. **Total de Campanhas** - Número total de campanhas cadastradas
2. **Campanhas Ativas** - Número de campanhas atualmente ativas
3. **Total Arrecadado** - Soma de todos os valores arrecadados
4. **Progresso Geral** - Porcentagem média de conclusão das metas

#### Sistema de Cores por Urgência:

- 🟢 **Baixa** - Verde (`maya-green`)
- 🔵 **Média** - Azul (`maya-blue`)
- 🟠 **Alta** - Laranja (`maya-orange`)
- 🔴 **Urgente** - Rosa (`maya-pink`)

---

### 2. Dashboard Admin - Ações Rápidas

**Localização:** `/admin`

- Adicionado card "Gerenciar Campanhas" na seção de Ações Rápidas
- Ícone: 🎯 Target em laranja (`maya-orange`)
- Link direto para `/admin/campanhas`

---

### 3. Área do Doador - Minhas Campanhas

**Localização:** `/doador/dashboard`

#### Nova Seção: "Minhas Campanhas"

Exibe todas as campanhas que o doador está apoiando com informações detalhadas:

**Para Cada Campanha:**
- Imagem da campanha
- Título com link para a página da campanha
- Badges indicando:
  - Tipo de doação (Mensal/Única)
  - Status (Ativa/Completa)
- Valor da contribuição
- Barra de progresso da campanha
- Total doado pelo usuário naquela campanha
- Data da próxima cobrança (se for doação mensal)

**Resumo Geral:**
- 📊 **Campanhas Apoiadas** - Número total de campanhas
- ✅ **Doações Ativas** - Número de doações mensais ativas
- 💰 **Total em Campanhas** - Soma de todas as doações em campanhas

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:

1. **`app/admin/campanhas/page.tsx`**
   - Página completa de gerenciamento de campanhas para admin
   - Tabela interativa com filtros e estatísticas
   - Interface responsiva e aderente ao brandbook

2. **`data/campaignDonations.ts`**
   - Estrutura de dados para doações em campanhas
   - Funções utilitárias para buscar e calcular doações:
     - `getDonationsByDoador(email)` - Busca doações de um doador
     - `getDonationsByCampaign(id)` - Busca doações de uma campanha
     - `getTotalDonatedByDoador(email)` - Calcula total doado
     - `getActiveMontlyDonationsByDoador(email)` - Busca doações mensais ativas
     - `getMonthlyCommitmentByDoador(email)` - Calcula comprometimento mensal

### Arquivos Modificados:

1. **`app/admin/page.tsx`**
   - Adicionado import do ícone `Target`
   - Adicionado card "Gerenciar Campanhas" nas Ações Rápidas

2. **`app/doador/dashboard/page.tsx`**
   - Adicionados imports: `Target`, `campaigns`, `getDonationsByDoador`, `Image`
   - Lógica para buscar campanhas do doador
   - Nova seção "Minhas Campanhas" com interface completa

---

## 🎨 Design e UX

### Princípios Seguidos:

✅ **Brandbook do Projeto Maya**
- Cores oficiais (verde, azul, laranja, rosa, bege, marrom)
- Tipografia: Caprasimo (display) e Nunito (body)
- Tom de voz: verdadeiro, ativista e carinhoso

✅ **Consistência Visual**
- Cards com `rounded-2xl` e `shadow-lg`
- Hover states suaves
- Dark mode totalmente suportado

✅ **Responsividade**
- Layout adaptável para mobile, tablet e desktop
- Grid responsivo com breakpoints apropriados

✅ **Acessibilidade**
- Contraste adequado de cores
- Ícones semânticos
- Estados visuais claros

---

## 🔄 Estrutura de Dados

### CampaignDonation (Interface)

```typescript
{
  id: string
  campaignId: string
  doadorEmail: string
  amount: number
  type: 'single' | 'monthly'
  date: string (YYYY-MM-DD)
  status: 'active' | 'cancelled' | 'completed'
  totalDonated: number
  nextPaymentDate?: string (YYYY-MM-DD)
}
```

### Dados Mockados

Foram criadas 6 doações de exemplo para 3 doadores diferentes:
- **joao@example.com**: 3 doações (2 mensais ativas, 1 única completa)
- **maria@example.com**: 2 doações (1 mensal ativa, 1 única completa)
- **pedro@example.com**: 1 doação (1 única completa)

---

## 🚀 Próximos Passos (Implementação Futura)

### Integração com Banco de Dados:

1. **Criar Campanhas**
   - Formulário completo para criar novas campanhas
   - Upload de imagens
   - Validação de dados

2. **Editar Campanhas**
   - Atualizar informações
   - Modificar metas e datas
   - Ativar/desativar campanhas

3. **Excluir Campanhas**
   - Soft delete (manter histórico)
   - Confirmação de segurança

4. **Relatórios Avançados**
   - Exportar dados em CSV/PDF
   - Gráficos de evolução temporal
   - Lista de doadores por campanha

### Integração com Stripe:

1. **Vincular Doações**
   - Associar pagamentos Stripe com campanhas específicas
   - Atualizar progresso em tempo real

2. **Webhooks**
   - Atualizar status de doações automaticamente
   - Notificações de pagamento recebido

3. **Gestão de Assinaturas**
   - Pausar/cancelar doações mensais em campanhas
   - Alterar valor de contribuição

---

## 📊 Métricas e Analytics

### Admin Pode Acompanhar:

- Total arrecadado por campanha
- Taxa de conversão
- Progresso em relação à meta
- Tempo médio até conclusão
- Doadores mais engajados

### Doador Pode Ver:

- Histórico completo de contribuições
- Impacto gerado por suas doações
- Status de campanhas apoiadas
- Certificados de contribuição (futuro)

---

## 🎯 Benefícios da Implementação

### Para a Organização:

✅ Gestão centralizada de campanhas  
✅ Visibilidade do progresso em tempo real  
✅ Facilita planejamento de novas iniciativas  
✅ Dados para tomada de decisão  

### Para os Doadores:

✅ Transparência total sobre uso das doações  
✅ Acompanhamento do impacto gerado  
✅ Facilidade para gerenciar contribuições  
✅ Engajamento com causas específicas  

### Para os Animais:

🐾 Mais recursos direcionados para causas urgentes  
🐾 Campanhas focadas em necessidades reais  
🐾 Maior previsibilidade de arrecadação  
🐾 Melhor planejamento de ações  

---

## 🔐 Segurança e Privacidade

### Implementado:

- Autenticação obrigatória para acessar áreas restritas
- Dados mockados para demonstração (sem exposição real)
- Validação de permissões em rotas admin

### A Implementar (Banco de Dados):

- Criptografia de dados sensíveis
- Logs de auditoria
- LGPD compliance
- Backup automático de dados
- Rate limiting em APIs

---

## 📱 Responsividade

### Breakpoints:

- **Mobile** (<768px): Layout em coluna única
- **Tablet** (768-1024px): Grid 2 colunas
- **Desktop** (>1024px): Grid completo 3-4 colunas

### Otimizações Mobile:

- Tabela com scroll horizontal
- Cards empilhados verticalmente
- Botões adaptados para toque
- Imagens otimizadas

---

## ✨ Recursos de UX

### Feedback Visual:

- Loading states durante carregamento
- Empty states quando não há dados
- Hover effects em elementos interativos
- Transições suaves entre estados

### Microinterações:

- Animações sutis em hover
- Progressão de barras animada
- Badges coloridos por status
- Ícones contextuais

---

## 🧪 Como Testar

### Área Admin:

1. Acesse `/admin` (já autenticado)
2. Clique em "Gerenciar Campanhas" nas Ações Rápidas
3. Explore os filtros (Todas/Ativas/Inativas)
4. Visualize estatísticas e tabela
5. Teste os botões de ação (Ver, Editar, Excluir)

### Área Doador:

1. Acesse `/doador/login`
2. Faça login com `joao@example.com` (senha: `senha123`)
3. No dashboard, role até a seção "Minhas Campanhas"
4. Explore as campanhas apoiadas
5. Clique nos links para ver detalhes

---

## 📞 Suporte e Manutenção

Para dúvidas ou problemas relacionados ao gerenciamento de campanhas:

1. Verifique a documentação neste arquivo
2. Consulte os comentários no código
3. Verifique o console do navegador para erros
4. Entre em contato com a equipe de desenvolvimento

---

## 📝 Changelog

### [1.0.0] - 2026-03-06

**Adicionado:**
- ✅ Página de gerenciamento de campanhas no admin
- ✅ Seção "Minhas Campanhas" no dashboard do doador
- ✅ Sistema de dados de doações para campanhas
- ✅ Funções utilitárias para manipulação de dados
- ✅ Integração visual com brandbook
- ✅ Documentação completa

**Pendente:**
- ⏳ Integração com banco de dados
- ⏳ CRUD completo de campanhas
- ⏳ Relatórios e exportações
- ⏳ Notificações automáticas
- ⏳ Certificados de contribuição

---

**Documentação criada em:** 06 de Março de 2026  
**Última atualização:** 06 de Março de 2026  
**Versão:** 1.0.0
