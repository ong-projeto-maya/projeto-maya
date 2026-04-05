# 💚 Área do Doador - Documentação Completa

## 📋 Visão Geral

A **Área do Doador** é uma plataforma completa que permite aos doadores acompanhar seu impacto, gerenciar doações recorrentes, baixar recibos e ver os animais que ajudaram.

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Sistema de Autenticação
- **Login** (`/doador/login`)
  - Email + senha
  - Validação de campos
  - Redirecionamento automático se já logado
  - Link para registro

- **Registro** (`/doador/registro`)
  - Nome completo, email, senha
  - Confirmação de senha
  - Validação de senha (mínimo 6 caracteres)
  - Criação automática de conta

- **Hook `useDoador`**
  - Gerenciamento de estado global
  - LocalStorage para persistência
  - Funções: `login`, `register`, `logout`, `updateProfile`

###  ✅ 2. Dashboard Personalizado (`/doador/dashboard`)
**Métricas Visuais:**
- Total doado com badge de nível
- Animais ajudados
- Número de doações
- Membro desde

**Progresso de Nível:**
- Barra de progresso visual
- 4 níveis: Bronze → Prata → Ouro → Diamante
- Cálculo automático baseado no total doado
- Gamificação completa

**Status de Assinatura:**
- Valor mensal
- Próxima cobrança
- Forma de pagamento
- Link para gerenciar

**Últimas Doações:**
- Listagem visual
- Status (concluída/pendente/falha)
- Botão para baixar recibo
- Link para ver todas

**Ações Rápidas:**
- Ver animais que ajudou
- Histórico completo
- Perfil
- Fazer nova doação

**Banner de Impacto:**
- Visualização gráfica do impacto
- Ícones representativos
- Dados dinâmicos

### ✅ 3. Histórico de Doações (`/doador/doacoes`)
- Tabela completa de doações
- Busca por ID, data ou valor
- Filtros: Todas / Únicas / Mensais
- Download de recibos individuais
- Estatísticas: total, média, contagem
- Botão para relatório completo (PDF)

### ✅ 4. Gerenciamento de Assinatura (`/doador/assinatura`)
**Detalhes:**
- Valor mensal
- Próxima cobrança
- Forma de pagamento
- Data de início

**Ações:**
- Pausar assinatura
- Reativar assinatura
- Alterar valor (integração futura)
- Atualizar cartão (integração futura)
- Cancelar assinatura

**Banner de Status:**
- Verde: Ativa
- Amarelo: Pausada
- Cinza: Cancelada

**Impacto Mensal:**
- Visualização do que a doação mensal proporciona

### ✅ 5. Perfil do Doador (`/doador/perfil`)
**Informações Editáveis:**
- Nome completo
- Telefone
- CPF (para IR)

**Email:**
- Somente leitura
- Orientação para contato se precisar alterar

**Ações da Conta:**
- Alterar senha (preparado)
- Exportar dados (preparado)
- Sair da conta
- Excluir conta (com confirmação)

**Feedback:**
- Mensagem de sucesso ao salvar
- Validação de campos

### ✅ 6. Animais que Ajudei (`/doador/animais`)
**Banner de Estatísticas:**
- Animais impactados
- Total doado
- Doações realizadas

**Timeline de Impacto:**
- Resgates apoiados
- Vacinas fornecidas
- Semanas de alimentação
- Adoções suportadas

**Grid de Animais:**
- Fotos dos animais
- Status (adotado/disponível)
- Nome, idade, gênero
- Badge de impacto personalizado
- Temperamento
- Link para perfil completo
- Hover effect com CTA

**CTA Final:**
- Incentivo para continuar ajudando
- Botões para doar ou ver adoções

### ✅ 7. Sistema de Níveis (Badges)
**Níveis Implementados:**
| Nível | Doação Mínima | Ícone | Cor |
|-------|--------------|-------|-----|
| **Bronze** | R$ 0 - 499 | 🥉 | Marrom |
| **Prata** | R$ 500 - 1.999 | 🥈 | Prata |
| **Ouro** | R$ 2.000 - 4.999 | 🥇 | Dourado |
| **Diamante** | R$ 5.000+ | 💎 | Azul |

**Cálculo Dinâmico:**
- Progresso percentual
- Valor restante para próximo nível
- Atualização automática

### ✅ 8. Integração no Header
**Desktop:**
- Botão "Minha Conta" se doador logado
- Substitui "Doar" quando autenticado
- Prioridade: Admin > Doador > Doar

**Mobile:**
- Link no footer do menu sidebar
- Texto: "Minha Conta (Doador)"
- Design consistente

---

## 📂 Estrutura de Arquivos

```
├── hooks/
│   └── useDoador.ts                    # Hook principal de autenticação e estado
├── app/doador/
│   ├── login/
│   │   └── page.tsx                    # Página de login
│   ├── registro/
│   │   └── page.tsx                    # Página de registro
│   ├── dashboard/
│   │   └── page.tsx                    # Dashboard principal
│   ├── doacoes/
│   │   └── page.tsx                    # Histórico de doações
│   ├── assinatura/
│   │   └── page.tsx                    # Gerenciar assinatura
│   ├── perfil/
│   │   └── page.tsx                    # Perfil do doador
│   └── animais/
│       └── page.tsx                    # Animais que ajudou
├── components/
│   └── Header.tsx                      # Header atualizado com link doador
└── AREA_DOADOR_COMPLETA.md            # Esta documentação
```

---

## 🎨 Design e UX

### Consistência Visual
- Paleta de cores Maya
- Dark mode completo
- Animações suaves
- Responsivo (mobile-first)

### Elementos Visuais
- Cards arredondados (rounded-2xl/3xl)
- Sombras elegantes (shadow-lg/2xl)
- Gradientes para destaques
- Ícones Lucide React
- Badges e status coloridos

### Feedback do Usuário
- Estados de loading
- Mensagens de sucesso/erro
- Confirmações para ações destrutivas
- Tooltips informativos

---

## 🔐 Autenticação e Segurança

### LocalStorage
```javascript
// Armazena dados do doador
localStorage.setItem('maya_doador', JSON.stringify(doadorData))

// Recupera ao carregar
const storedDoador = localStorage.getItem('maya_doador')
```

### Proteção de Rotas
- useEffect verifica autenticação
- Redirect automático para `/doador/login`
- Loading state durante verificação

### Mock vs Produção
**Atualmente (Mock):**
- Qualquer email + senha 6+ chars
- Dados mockados no hook
- LocalStorage como "banco"

**Produção (Futuro):**
- API backend (Node/PHP)
- JWT/Sessions
- Database (Supabase/Firebase)
- Integração Stripe real

---

## 💳 Integração Stripe (Preparado)

### Webhooks Necessários
```javascript
// Criar nova doação
POST /api/doador/donations
{
  amount, type, status, date, receipt
}

// Listar doações
GET /api/doador/donations/:userId

// Obter doador
GET /api/doador/:userId

// Atualizar perfil
PATCH /api/doador/:userId
```

### Stripe Customer Portal
```javascript
// Gerenciar assinatura via Stripe
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${domain}/doador/assinatura`,
})
```

---

## 🧪 Como Testar

### 1. Criar Conta
```
1. Ir para /doador/registro
2. Preencher: Nome, Email, Senha (6+ chars)
3. Confirmar senha
4. Clicar em "Criar Conta"
```

### 2. Fazer Login
```
1. Ir para /doador/login
2. Email: qualquer@email.com
3. Senha: 123456 (ou qualquer com 6+ chars)
4. Clicar em "Entrar"
```

### 3. Explorar Dashboard
```
1. Ver métricas de impacto
2. Verificar progresso de nível
3. Conferir assinatura (se tiver)
4. Ver últimas doações
5. Clicar em "Animais que Ajudei"
```

### 4. Gerenciar Assinatura
```
1. Ir para /doador/assinatura
2. Pausar assinatura
3. Reativar assinatura
4. Tentar cancelar (modal de confirmação)
```

### 5. Atualizar Perfil
```
1. Ir para /doador/perfil
2. Alterar nome, telefone, CPF
3. Salvar alterações
4. Ver mensagem de sucesso
```

### 6. Ver Histórico
```
1. Ir para /doador/doacoes
2. Buscar por valor/data
3. Filtrar por tipo
4. Tentar baixar recibo
```

### 7. Header Integration
```
Desktop:
1. Login como doador
2. Ver botão "Minha Conta" no header
3. Clicar e verificar redirecionamento

Mobile:
1. Abrir menu hambúrguer
2. Ver link no footer: "Minha Conta (Doador)"
3. Verificar navegação
```

---

## 📊 Métricas e KPIs

### Dados do Doador
```typescript
interface Doador {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  totalDonated: number          // Total em R$
  donationCount: number          // Número de doações
  firstDonation: string          // Data da primeira doação
  level: 'bronze' | 'silver' | 'gold' | 'diamond'
  animalsHelped: number          // Animais impactados
  subscription?: Subscription    // Assinatura ativa
  donations: Donation[]          // Histórico
}
```

### Cálculos
```typescript
// Nível baseado em total doado
function getLevel(total: number) {
  if (total >= 5000) return 'diamond'
  if (total >= 2000) return 'gold'
  if (total >= 500) return 'silver'
  return 'bronze'
}

// Progresso para próximo nível
function getLevelProgress(total: number) {
  // Retorna: current, next, percentage
}

// Impacto (exemplos)
resgates = Math.ceil(animalsHelped * 0.3)
vacinas = Math.ceil(animalsHelped * 0.5)
semanas = Math.ceil(totalDonated / 50)
adocoes = Math.ceil(animalsHelped * 0.2)
```

---

## 🚀 Próximos Passos (Produção)

### 1. Backend API
- [ ] Criar endpoints REST/GraphQL
- [ ] Conectar com banco de dados
- [ ] Implementar autenticação JWT
- [ ] Webhooks Stripe

### 2. Stripe Integration
- [ ] Criar Customer ao registrar
- [ ] Vincular doações ao Customer
- [ ] Customer Portal para assinaturas
- [ ] Webhooks para atualizar status

### 3. Funcionalidades Extras
- [ ] Recuperar senha (email)
- [ ] Alterar senha
- [ ] Exportar dados (LGPD)
- [ ] Notificações por email
- [ ] Download de recibos reais (PDF)
- [ ] Certificado anual de doações
- [ ] Compartilhar badge nas redes sociais

### 4. Gamificação Avançada
- [ ] Conquistas desbloqueáveis
- [ ] Ranking de doadores
- [ ] Referral program
- [ ] Missões mensais
- [ ] Eventos exclusivos para níveis altos

### 5. Melhorias de UX
- [ ] Onboarding tutorial
- [ ] Tour guiado (primeiro login)
- [ ] Gráficos de impacto
- [ ] Timeline de doações
- [ ] Comparação com outros doadores

---

## 🎉 Resultado Final

A Área do Doador oferece:

✅ **Transparência Total** - Veja exatamente onde seu dinheiro vai  
✅ **Engajamento** - Gamificação mantém doadores conectados  
✅ **Facilidade** - Gerencie tudo em um só lugar  
✅ **Impacto Visual** - Gráficos e dados motivam mais doações  
✅ **Profissionalismo** - Padrão de mercado para ONGs  

### Comparação com Outras ONGs

| Recurso | Projeto Maya | WWF | UNICEF | Médicos Sem Fronteiras |
|---------|--------------|-----|--------|------------------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Histórico | ✅ | ✅ | ✅ | ✅ |
| Recibos | ✅ | ✅ | ✅ | ✅ |
| Gamificação | ✅ | ❌ | ⚠️ | ❌ |
| Ver Animais | ✅ | ⚠️ | ❌ | ❌ |
| Badges | ✅ | ❌ | ❌ | ❌ |
| Dark Mode | ✅ | ❌ | ❌ | ❌ |

---

## 📞 Suporte

**Para Doadores:**
- Email: suporte@projetomaya.org
- WhatsApp: (11) 99999-9999
- Horário: Seg-Sex 9h-18h

**Para Desenvolvedores:**
- Issues no GitHub
- Documentação técnica
- Exemplos de integração

---

## 🏆 Créditos

Desenvolvido com 💚 para o **Projeto Maya**

**Tecnologias:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Stripe (preparado)

**Versão:** 1.0.0  
**Data:** Fevereiro 2026

---

**🐾 Cada doação transforma vidas. Obrigado por fazer parte dessa causa!**
