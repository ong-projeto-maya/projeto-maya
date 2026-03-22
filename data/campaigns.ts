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
  allowsRegistration: boolean // permite inscrição de beneficiários
  registrationInfo?: {
    description: string // descrição de quem pode se inscrever
    spots: number // vagas totais
    registered: number // inscritos até agora
    requirements: string[] // requisitos para inscrição
  }
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
    impactStory: 'A cada R$ 300 doados, conseguimos realizar uma castração completa, incluindo exames pré-operatórios, cirurgia, medicação e acompanhamento pós-operatório. Isso significa menos filhotes abandonados e mais qualidade de vida pros pets!',
    allowsRegistration: true,
    registrationInfo: {
      description: 'Inscreva seu pet para castração gratuita. Voltado para tutores de baixa renda.',
      spots: 50,
      registered: 32,
      requirements: [
        'Comprovar renda familiar de até 2 salários mínimos',
        'Ser morador de São Paulo (SP)',
        'Animal deve ter mais de 6 meses',
        'Apresentar RG/CPF do tutor',
        'Animal em bom estado de saúde geral'
      ]
    }
  },
  {
    id: '2',
    title: 'Doação de Ração',
    slug: 'doacao-racao',
    description: 'Garanta alimentação nutritiva para todos os nossos pets.',
    longDescription: 'Queremos garantir ração de qualidade e suplementação adequada pra todos os nossos resgatados. Com sua ajuda, nenhum animalzinho fica sem comida!',
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
    impactStory: 'R$ 80 por mês garante a alimentação completa de um pet. Animais bem alimentados são mais saudáveis e felizes!',
    allowsRegistration: true,
    registrationInfo: {
      description: 'Cadastre-se para receber ração e suplementação gratuita para seu pet.',
      spots: 100,
      registered: 67,
      requirements: [
        'Comprovar renda familiar de até 2 salários mínimos',
        'Ser morador da região metropolitana de São Paulo',
        'Informar quantidade e tipo de animais',
        'Apresentar documento com foto'
      ]
    }
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
