import { Campaign } from './campaigns'

export type CampaignDonation = {
  id: string
  campaignId: string
  doadorEmail: string
  amount: number
  type: 'single' | 'monthly'
  date: string
  status: 'active' | 'cancelled' | 'completed'
  totalDonated: number // total acumulado se for mensal
  nextPaymentDate?: string // se for mensal
}

// Mock de doações para campanhas
export const campaignDonations: CampaignDonation[] = [
  {
    id: '1',
    campaignId: '1', // Castração Solidária
    doadorEmail: 'joao@email.com',
    amount: 50,
    type: 'monthly',
    date: '2026-02-15',
    status: 'active',
    totalDonated: 100, // 2 meses
    nextPaymentDate: '2026-04-15'
  },
  {
    id: '2',
    campaignId: '2', // Reforma do Abrigo
    doadorEmail: 'joao@email.com',
    amount: 100,
    type: 'single',
    date: '2026-03-01',
    status: 'completed',
    totalDonated: 100
  },
  {
    id: '3',
    campaignId: '4', // Resgate de Emergência
    doadorEmail: 'joao@email.com',
    amount: 25,
    type: 'monthly',
    date: '2026-01-20',
    status: 'active',
    totalDonated: 75, // 3 meses
    nextPaymentDate: '2026-04-20'
  },
  {
    id: '4',
    campaignId: '1', // Castração Solidária
    doadorEmail: 'maria@email.com',
    amount: 100,
    type: 'single',
    date: '2026-03-05',
    status: 'completed',
    totalDonated: 100
  },
  {
    id: '5',
    campaignId: '3', // Alimentação de Inverno
    doadorEmail: 'maria@email.com',
    amount: 30,
    type: 'monthly',
    date: '2026-03-01',
    status: 'active',
    totalDonated: 30, // 1 mês
    nextPaymentDate: '2026-04-01'
  },
  {
    id: '6',
    campaignId: '6', // Pets Especiais
    doadorEmail: 'pedro@email.com',
    amount: 200,
    type: 'single',
    date: '2026-02-28',
    status: 'completed',
    totalDonated: 200
  }
]

// Função para buscar doações de um doador específico
export function getDonationsByDoador(doadorEmail: string): CampaignDonation[] {
  return campaignDonations.filter(donation => donation.doadorEmail === doadorEmail)
}

// Função para buscar doações de uma campanha específica
export function getDonationsByCampaign(campaignId: string): CampaignDonation[] {
  return campaignDonations.filter(donation => donation.campaignId === campaignId)
}

// Função para calcular total doado por um doador
export function getTotalDonatedByDoador(doadorEmail: string): number {
  return campaignDonations
    .filter(donation => donation.doadorEmail === doadorEmail)
    .reduce((sum, donation) => sum + donation.totalDonated, 0)
}

// Função para calcular total de doações ativas (mensais)
export function getActiveMontlyDonationsByDoador(doadorEmail: string): CampaignDonation[] {
  return campaignDonations.filter(
    donation => donation.doadorEmail === doadorEmail && donation.type === 'monthly' && donation.status === 'active'
  )
}

// Função para calcular comprometimento mensal
export function getMonthlyCommitmentByDoador(doadorEmail: string): number {
  return getActiveMontlyDonationsByDoador(doadorEmail)
    .reduce((sum, donation) => sum + donation.amount, 0)
}
