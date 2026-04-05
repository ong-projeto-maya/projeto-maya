// Campaign type - � the canonical type used throughout the app.
// All runtime data is fetched from Supabase via hooks/useCampaigns.ts.
export type Campaign = {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  goal: number
  raised: number
  startDate: string
  endDate: string
  isActive: boolean
  image: string
  icon: string
  category: 'saude' | 'resgate' | 'infraestrutura' | 'alimentacao'
  urgency: 'baixa' | 'media' | 'alta' | 'urgente'
  benefits: string[]
  impactStory: string
  allowsRegistration: boolean
  registrationInfo?: {
    description: string
    spots: number
    registered: number
    requirements: string[]
  }
}

// Kept for backward-compat imports that have not yet been migrated.
// Do NOT use this directly � use the useCampaigns() hook instead.
export const campaigns: Campaign[] = []

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
