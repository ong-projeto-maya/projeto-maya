/**
 * Supabase-backed donation storage.
 * Used exclusively in server-side API routes and the PagBank webhook.
 * All writes use the service role key for unrestricted access.
 */

import { createServiceClient } from './supabase-server'

/**
 * Placeholder e-mail written for donations made without a logged-in account
 * (app/api/create-checkout-session/route.ts). It identifies nobody, so it must
 * never be used to link a donation to a donor.
 */
const ANONYMOUS_EMAIL = 'anonymous@projetomaya.org'

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
      { onConflict: 'pagbank_order_id', ignoreDuplicates: false }
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

export async function getDonationByReference(referenceId: string): Promise<StoredDonation | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('doacoes')
    .select('*')
    .eq('pagbank_order_id', referenceId)
    .limit(1)
  if (error) {
    console.error('getDonationByReference error:', error)
    return null
  }
  const row = data?.[0]
  return row ? mapRow(row as Record<string, unknown>) : null
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

/**
 * Resolve which donor a recurring charge belongs to.
 *
 * Recurring charges (PagBank's SUBSCRIPTION_CHARGE) arrive without metadata,
 * so the webhook has no userId and no email — only the subscription id. The
 * donor's identity was recorded on the `assinaturas` row when the first
 * payment went through, in `doador_id` and `doador_email`.
 *
 * Returns null when the donor cannot be resolved, which the caller treats as
 * "save the donation unlinked". Being unlinked can be fixed later with a
 * script, since the subscription id is kept on the donation row; linking a
 * donation to the wrong person cannot.
 */
export async function getSubscriptionDonor(
  subscriptionId: string
): Promise<{ doadorId?: string; email: string } | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('assinaturas')
    .select('doador_id, doador_email')
    .eq('pagbank_subscription_id', subscriptionId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getSubscriptionDonor error:', error)
    return null
  }

  // No row for this subscription. Happens when a recurring charge arrives
  // before the first one was processed, or when the subscription was created
  // straight in PagBank. Save the charge unlinked; the subscription id stays on
  // the donation row, so it can be linked later by script.
  if (!data) return null

  const doadorId = (data.doador_id as string | null) ?? undefined
  const email = ((data.doador_email as string | null) ?? '').trim()

  // An account is the only identity we trust. Link by it whenever it is there,
  // even if the e-mail on the row is missing or the anonymous placeholder.
  if (doadorId) return { doadorId, email }

  // No account: the e-mail is all there is. It is enough, because the donor
  // dashboard also looks donations up by e-mail (getDonationsByEmail).
  // ANONYMOUS_EMAIL is the literal the checkout writes when nobody is logged
  // in — it belongs to no one, so linking by it would pile unrelated donors
  // into a single history. Leaving a charge unlinked is fixable; attributing it
  // to the wrong person is not.
  if (!email || email.toLowerCase() === ANONYMOUS_EMAIL) return null

  return { email }
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

export async function cancelSubscriptionById(
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
  if (donError) console.error('cancelSubscriptionById: doacoes error:', donError)
  if (subError) console.error('cancelSubscriptionById: assinaturas error:', subError)
}

export async function syncSubscriptionStatus(
  subscription: { id: string; status: string; current_period_end?: number }
): Promise<void> {
  const supabase = createServiceClient()
  const incoming = subscription.status
  const dbStatus =
    incoming === 'active' ? 'active' :
    incoming === 'paused' ? 'paused' :
    incoming === 'canceled' ? 'cancelled' :
    incoming === 'cancelled' ? 'cancelled' :
    incoming === 'past_due' ? 'paused' :
    'cancelled'

  const updates: Record<string, unknown> = { status: dbStatus }

  // Only touch proximo_pagamento when we actually know the next billing date.
  // Callers that do not have it must omit current_period_end — passing 0 used
  // to write 1970-01-01 over the real date, which then showed up in the
  // donor's dashboard.
  if (typeof subscription.current_period_end === 'number' && subscription.current_period_end > 0) {
    updates.proximo_pagamento = new Date(subscription.current_period_end * 1000)
      .toISOString()
      .split('T')[0]
  }

  const { error } = await supabase
    .from('assinaturas')
    .update(updates)
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
