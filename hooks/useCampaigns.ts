'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Campaign } from '@/data/campaigns'

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
    longDescription: row.long_description as string,
    goal: row.goal as number,
    raised: row.raised as number,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    isActive: row.is_active as boolean,
    image: row.image as string,
    icon: row.icon as string,
    category: row.category as Campaign['category'],
    urgency: row.urgency as Campaign['urgency'],
    benefits: (row.benefits as string[]) ?? [],
    impactStory: row.impact_story as string,
    allowsRegistration: row.allows_registration as boolean,
    registrationInfo: row.allows_registration
      ? {
          description: row.registration_description as string,
          spots: row.registration_spots as number,
          registered: row.registration_registered as number,
          requirements: (row.registration_requirements as string[]) ?? [],
        }
      : undefined,
  }
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns:', error)
    } else {
      setCampaigns((data ?? []).map(mapCampaign))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const addCampaign = async (campaign: Omit<Campaign, 'id'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('campanhas')
      .insert({
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        long_description: campaign.longDescription,
        goal: campaign.goal,
        raised: campaign.raised,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        is_active: campaign.isActive,
        image: campaign.image,
        icon: campaign.icon,
        category: campaign.category,
        urgency: campaign.urgency,
        benefits: campaign.benefits,
        impact_story: campaign.impactStory,
        allows_registration: campaign.allowsRegistration,
        registration_description: campaign.registrationInfo?.description ?? null,
        registration_spots: campaign.registrationInfo?.spots ?? 0,
        registration_registered: campaign.registrationInfo?.registered ?? 0,
        registration_requirements: campaign.registrationInfo?.requirements ?? [],
      })
      .select()
      .single()

    if (error) { console.error('Error adding campaign:', error); return null }
    const newCampaign = mapCampaign(data)
    setCampaigns(prev => [newCampaign, ...prev])
    return newCampaign
  }

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    const supabase = createClient()
    const dbUpdates: Record<string, unknown> = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.longDescription !== undefined) dbUpdates.long_description = updates.longDescription
    if (updates.goal !== undefined) dbUpdates.goal = updates.goal
    if (updates.raised !== undefined) dbUpdates.raised = updates.raised
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
    if (updates.image !== undefined) dbUpdates.image = updates.image
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.urgency !== undefined) dbUpdates.urgency = updates.urgency
    if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits
    if (updates.impactStory !== undefined) dbUpdates.impact_story = updates.impactStory
    if (updates.allowsRegistration !== undefined) dbUpdates.allows_registration = updates.allowsRegistration
    if (updates.registrationInfo !== undefined) {
      dbUpdates.registration_description = updates.registrationInfo?.description ?? null
      dbUpdates.registration_spots = updates.registrationInfo?.spots ?? 0
      dbUpdates.registration_registered = updates.registrationInfo?.registered ?? 0
      dbUpdates.registration_requirements = updates.registrationInfo?.requirements ?? []
    }

    const { error } = await supabase.from('campanhas').update(dbUpdates).eq('id', id)
    if (error) { console.error('Error updating campaign:', error); return }
    await fetchCampaigns()
  }

  const deleteCampaign = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('campanhas').delete().eq('id', id)
    if (error) { console.error('Error deleting campaign:', error); return }
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const getCampaignById = (id: string) => campaigns.find(c => c.id === id)
  const getCampaignBySlug = (slug: string) => campaigns.find(c => c.slug === slug)
  const getActiveCampaigns = () => campaigns.filter(c => c.isActive)

  return {
    campaigns,
    isLoading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignById,
    getCampaignBySlug,
    getActiveCampaigns,
    refetch: fetchCampaigns,
  }
}
