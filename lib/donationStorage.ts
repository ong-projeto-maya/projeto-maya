/**
 * Supabase-backed donation storage.
 * Used exclusively in server-side API routes and the Stripe webhook.
 * All writes use the service role key for unrestricted access.
 */

import { createServiceClient } from './supabase-server'

export interface StoredDonation {
  id: string
  stripeSessionId: string
  stripeSubscriptionId?: string
  email: string
  amount: number
  type: 'single' | 'monthly'
  status: 'completed' | 'failed' | 'pending' | 'cancelled'
  campaignId?: string
  campaignName?: string
  createdAt: string
  nextBillingDate?: string
}

function mapRow(row: Record<string, unknown>): StoredDonation {
  return {
    id: row.id as string,
    stripeSessionId: row.stripe_session_id as string,
    stripeSubscriptionId: (row.stripe_subscription_id as string | null) ?? undefined,
    email: row.doador_email as string,
    amount: row.valor as number,
    type: row.tipo as 'single' | 'monthly',
    status: row.status as StoredDonation['status'],
    campaignId: (row.campaign_id as string | null) ?? undefined,
    campaignName: (row.campaign_name as string | null) ?? undefined,
    createdAt: row.created_at as string,
    nextBillingDate: (row.proximo_pagamento as string | null) ?? undefined,
  }
}

export async function saveDonation(
  donation: Omit<StoredDonation, 'id'>
): Promise<StoredDonation> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('doacoes')
    .upsert(
      {
        stripe_session_id: donation.stripeSessionId,
        stripe_subscription_id: donation.stripeSubscriptionId ?? null,
        doador_email: donation.email,
        valor: donation.amount,
        tipo: donation.type,
        status: donation.status,
        campaign_id: donation.campaignId ?? null,
        campaign_name: donation.campaignName ?? null,
        created_at: donation.createdAt,
        proximo_pagamento: donation.nextBillingDate ?? null,
      },
      { onConflict: 'stripe_session_id', ignoreDuplicates: true }
    )
    .select()
    .single()

  if (error) {
    console.error('saveDonation error:', error)
    throw error
  }

  // If this is a new monthly donation, upsert its subscription record
  if (donation.type === 'monthly' && donation.stripeSubscriptionId) {
    const { error: subError } = await supabase.from('assinaturas').upsert(
      {
        doador_email: donation.email,
        stripe_subscription_id: donation.stripeSubscriptionId,
        valor: donation.amount,
        status: 'active',
        proximo_pagamento: donation.nextBillingDate ?? null,
        data_inicio: donation.createdAt.split('T')[0],
        metodo_pagamento: 'Cartão',
      },
      { onConflict: 'stripe_subscription_id', ignoreDuplicates: true }
    )
    if (subError) console.error('saveDonation: subscription upsert error:', subError)
  }

  return mapRow(data as Record<string, unknown>)
}

export async function updateDonationStatus(
  stripeSessionId: string,
  status: StoredDonation['status']
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('doacoes')
    .update({ status })
    .eq('stripe_session_id', stripeSessionId)
  if (error) console.error('updateDonationStatus error:', error)
}

export async function getDonationsByEmail(email: string): Promise<StoredDonation[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('doacoes')
    .select('*')
    .ilike('doador_email', email)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getDonationsByEmail error:', error)
    return []
  }
  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function getAllDonations(): Promise<StoredDonation[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('doacoes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getAllDonations error:', error)
    return []
  }
  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function updateDonationStatusBySubscription(
  stripeSubscriptionId: string,
  status: StoredDonation['status']
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('doacoes')
    .update({ status })
    .eq('stripe_subscription_id', stripeSubscriptionId)
  if (error) console.error('updateDonationStatusBySubscription error:', error)
}

export async function cancelSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<void> {
  const supabase = createServiceClient()
  const [{ error: donError }, { error: subError }] = await Promise.all([
    supabase
      .from('doacoes')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', stripeSubscriptionId),
    supabase
      .from('assinaturas')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', stripeSubscriptionId),
  ])
  if (donError) console.error('cancelSubscriptionByStripeId: doacoes error:', donError)
  if (subError) console.error('cancelSubscriptionByStripeId: assinaturas error:', subError)
}

export async function syncSubscriptionStatus(
  subscription: { id: string; status: string; current_period_end: number }
): Promise<void> {
  const supabase = createServiceClient()
  const stripeStatus = subscription.status
  // Map Stripe status to our DB status
  const dbStatus =
    stripeStatus === 'active' ? 'active' :
    stripeStatus === 'paused' ? 'paused' :
    stripeStatus === 'canceled' ? 'cancelled' :
    stripeStatus === 'past_due' ? 'paused' :
    'cancelled'
  const nextBilling = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]
  const { error } = await supabase
    .from('assinaturas')
    .update({ status: dbStatus, proximo_pagamento: nextBilling })
    .eq('stripe_subscription_id', subscription.id)
  if (error) console.error('syncSubscriptionStatus error:', error)
}

export async function updateNextBillingDate(
  stripeSubscriptionId: string,
  nextBillingDate: string
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('assinaturas')
    .update({ proximo_pagamento: nextBillingDate })
    .eq('stripe_subscription_id', stripeSubscriptionId)
  if (error) console.error('updateNextBillingDate error:', error)
}
