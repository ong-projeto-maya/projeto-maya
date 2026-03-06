export type Campaign = {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  goal: number // valor da meta em reais
  raised: number // valor arrecadado até agora
  startDate: string
  endDate: string
  isActive: boolean
  image: string
  icon: string // nome do ícone lucide
  category: 'saude' | 'resgate' | 'infraestrutura' | 'alimentacao'
  urgency: 'baixa' | 'media' | 'alta' | 'urgente'
  benefits: string[]
  impactStory: string
}

export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Campanha de Castração Solidária',
    slug: 'castracao-solidaria',
    description: 'Ajude a controlar a população de animais de rua através de castrações gratuitas.',
    longDescription: 'A castração é fundamental pra diminuir o número de animais abandonados nas ruas. Com sua ajuda, conseguimos oferecer esse procedimento de forma gratuita pra tutores de baixa renda e animais de rua.',
    goal: 15000,
    raised: 8750,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    icon: 'Heart',
    category: 'saude',
    urgency: 'alta',
    benefits: [
      '50 castrações realizadas',
      'Controle populacional humanitário',
      'Prevenção de doenças',
      'Diminuição de animais nas ruas',
      'Atendimento a famílias de baixa renda'
    ],
    impactStory: 'A cada R$ 300 doados, conseguimos realizar uma castração completa, incluindo exames pré-operatórios, cirurgia, medicação e acompanhamento pós-operatório. Isso significa menos filhotes abandonados e mais qualidade de vida pros pets!'
  },
  {
    id: '2',
    title: 'Reforma do Abrigo',
    slug: 'reforma-abrigo',
    description: 'Precisamos urgentemente reformar nosso abrigo para acolher mais animais com dignidade.',
    longDescription: 'Nosso abrigo atual está com capacidade máxima e precisa de melhorias urgentes. Queremos oferecer um espaço mais amplo, seguro e confortável pra todos os nossos amiguinhos.',
    goal: 25000,
    raised: 12300,
    startDate: '2026-02-15',
    endDate: '2026-06-30',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    icon: 'Home',
    category: 'infraestrutura',
    urgency: 'urgente',
    benefits: [
      'Capacidade pra 30 animais a mais',
      'Área externa ampliada',
      'Melhor ventilação e iluminação',
      'Espaço de isolamento pra novos resgates',
      'Área de convivência pra socialização'
    ],
    impactStory: 'Com um abrigo melhor, conseguimos resgatar mais animais e oferecer melhores condições enquanto eles esperam por um lar definitivo. Cada doação nos aproxima desse sonho!'
  },
  {
    id: '3',
    title: 'Alimentação de Inverno',
    slug: 'alimentacao-inverno',
    description: 'Garanta alimentação nutritiva para todos os nossos pets durante os meses mais frios.',
    longDescription: 'No inverno, os animais precisam de mais energia pra se manterem aquecidos. Queremos garantir ração de qualidade e suplementação adequada pra todos os nossos resgatados.',
    goal: 8000,
    raised: 5200,
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&q=80',
    icon: 'Utensils',
    category: 'alimentacao',
    urgency: 'media',
    benefits: [
      'Ração premium pra 100 animais',
      'Suplementação vitamínica',
      'Petiscos nutritivos',
      'Alimentação adequada pra filhotes',
      'Dieta especial pra idosos'
    ],
    impactStory: 'R$ 80 por mês garante a alimentação completa de um pet durante todo o inverno. Animais bem alimentados são mais saudáveis e felizes!'
  },
  {
    id: '4',
    title: 'Resgate de Emergência',
    slug: 'resgate-emergencia',
    description: 'Fundo emergencial para resgatar animais em situação crítica a qualquer momento.',
    longDescription: 'Todos os dias recebemos ligações sobre animais em situação de risco. Queremos ter um fundo sempre disponível pra agir rapidamente e salvar vidas.',
    goal: 10000,
    raised: 7450,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80',
    icon: 'Ambulance',
    category: 'resgate',
    urgency: 'urgente',
    benefits: [
      'Resgate 24/7',
      'Atendimento veterinário imediato',
      'Transporte equipado',
      'Medicação de emergência',
      'Internação quando necessário'
    ],
    impactStory: 'Um resgate de emergência custa em média R$ 500 (transporte, primeiros socorros, veterinário). Sua doação pode salvar uma vida hoje mesmo!'
  },
  {
    id: '5',
    title: 'Programa de Apadrinhamento',
    slug: 'programa-apadrinhamento',
    description: 'Seja padrinho de um pet e acompanhe sua jornada até encontrar um lar.',
    longDescription: 'Nem todo mundo pode adotar, mas todo mundo pode ajudar! Nosso programa de apadrinhamento permite que você contribua mensalmente pro cuidado de um pet específico.',
    goal: 12000,
    raised: 9100,
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    icon: 'Users',
    category: 'saude',
    urgency: 'baixa',
    benefits: [
      'Acompanhamento mensal do seu apadrinhado',
      'Fotos e vídeos exclusivos',
      'Certificado de padrinho',
      'Prioridade pra conhecer o pet',
      'Relatórios de saúde'
    ],
    impactStory: 'Por apenas R$ 50/mês você garante alimentação, vacinas e cuidados veterinários pra um pet. Muitos dos nossos apadrinhados acabam sendo adotados pelos próprios padrinhos!'
  },
  {
    id: '6',
    title: 'Tratamento de Pets Especiais',
    slug: 'tratamento-pets-especiais',
    description: 'Animais com deficiência ou doenças crônicas precisam de cuidados contínuos.',
    longDescription: 'Temos vários pets com necessidades especiais: cadeirantes, cegos, surdos, ou com doenças crônicas. Eles merecem todo o carinho e tratamento adequado!',
    goal: 18000,
    raised: 6800,
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
    icon: 'HeartPulse',
    category: 'saude',
    urgency: 'alta',
    benefits: [
      'Consultas veterinárias especializadas',
      'Medicação contínua',
      'Fisioterapia e reabilitação',
      'Equipamentos adaptativos',
      'Alimentação especial'
    ],
    impactStory: 'Pets especiais precisam de cuidados extras, mas são tão amorosos quanto qualquer outro! Com R$ 200/mês conseguimos dar todo o suporte que eles precisam.'
  }
]

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(campaign => campaign.id === id)
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find(campaign => campaign.slug === slug)
}

export function getActiveCampaigns(): Campaign[] {
  return campaigns.filter(campaign => campaign.isActive)
}

export function getCampaignProgress(campaign: Campaign): number {
  return Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)
}

export function getCampaignDaysLeft(campaign: Campaign): number {
  const end = new Date(campaign.endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
