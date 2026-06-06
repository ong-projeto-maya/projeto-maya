/**
 * Supabase-backed donation storage.
 * Used exclusively in server-side API routes and the Stripe webhook.
 * All writes use the service role key for unrestricted access.
 */

import { createServiceClient } from './supabase-server'

export interface StoredDonation {
  id: string
  /** PagBank reference_id (stored in pagbank_order_id column for backward compat) */
  paymentId: string
  /** PagBank subscription ID (stored in pagbank_subscription_id column) */
  subscriptionId?: string
  userId?: string
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
    paymentId: row.pagbank_order_id as string,
    subscriptionId: (row.pagbank_subscription_id as string | null) ?? undefined,
    userId: (row.doador_id as string | null) ?? undefined,
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
        pagbank_order_id: donation.paymentId,
        pagbank_subscription_id: donation.subscriptionId ?? null,
        doador_id: donation.userId ?? null,
        doador_email: donation.email,
        valor: donation.amount,
        tipo: donation.type,
        status: donation.status,
        campaign_id: donation.campaignId ?? null,
        campaign_name: donation.campaignName ?? null,
        created_at: donation.createdAt,
        proximo_pagamento: donation.nextBillingDate ?? null,
      },
      { onConflict: 'pagbank_order_id', ignoreDuplicates: true }
    )
    .select()
    .limit(1)

  if (error) {
    console.error('saveDonation error:', error)
    throw error
  }

  // If this is a new monthly donation, upsert its subscription record
  if (donation.type === 'monthly' && donation.subscriptionId) {
    const { error: subError } = await supabase.from('assinaturas').upsert(
      {
        doador_id: donation.userId ?? null,
        doador_email: donation.email,
        pagbank_subscription_id: donation.subscriptionId,
        valor: donation.amount,
        status: 'active',
        proximo_pagamento: donation.nextBillingDate ?? null,
        data_inicio: donation.createdAt.split('T')[0],
        metodo_pagamento: 'Cartão',
      },
      { onConflict: 'pagbank_subscription_id', ignoreDuplicates: true }
    )
    if (subError) console.error('saveDonation: subscription upsert error:', subError)
  }

  return mapRow((data?.[0] ?? data) as Record<string, unknown>)
}

export async function updateDonationStatus(
  paymentId: string,
  status: StoredDonation['status']
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('doacoes')
    .update({ status })
    .eq('pagbank_order_id', paymentId)
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

export async function getDonationsByUserId(userId: string): Promise<StoredDonation[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('doacoes')
    .select('*')
    .eq('doador_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getDonationsByUserId error:', error)
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
  subscriptionId: string,
  status: StoredDonation['status']
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('doacoes')
    .update({ status })
    .eq('pagbank_subscription_id', subscriptionId)
  if (error) console.error('updateDonationStatusBySubscription error:', error)
}

export async function cancelSubscriptionByStripeId(
  subscriptionId: string
): Promise<void> {
  const supabase = createServiceClient()
  const [{ error: donError }, { error: subError }] = await Promise.all([
    supabase
      .from('doacoes')
      .update({ status: 'cancelled' })
      .eq('pagbank_subscription_id', subscriptionId),
    supabase
      .from('assinaturas')
      .update({ status: 'cancelled' })
      .eq('pagbank_subscription_id', subscriptionId),
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
    stripeStatus === 'cancelled' ? 'cancelled' :
    stripeStatus === 'past_due' ? 'paused' :
    'cancelled'
  const nextBilling = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]
  const { error } = await supabase
    .from('assinaturas')
    .update({ status: dbStatus, proximo_pagamento: nextBilling })
    .eq('pagbank_subscription_id', subscription.id)
  if (error) console.error('syncSubscriptionStatus error:', error)
}

export async function updateNextBillingDate(
  subscriptionId: string,
  nextBillingDate: string
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('assinaturas')
    .update({ proximo_pagamento: nextBillingDate })
    .eq('pagbank_subscription_id', subscriptionId)
  if (error) console.error('updateNextBillingDate error:', error)
}
