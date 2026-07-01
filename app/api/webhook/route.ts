import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import {
  validateWebhookSignature,
  mapChargeStatus,
  findOrderByReference,
  type PagBankWebhookPayload,
} from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'
import {
  saveDonation,
  updateDonationStatus,
  updateDonationStatusBySubscription,
  cancelSubscriptionByStripeId,
  syncSubscriptionStatus,
} from '@/lib/donationStorage'

const log = createRouteLogger('webhook')

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headerList = headers()
    const signature = headerList.get('x-pagbank-signature')

    // Temporary: log signature header so we can configure PAGBANK_WEBHOOK_TOKEN correctly
    // Remove this log once the token is confirmed and set in environment variables
    log.info({ signatureReceived: signature ?? '(none)', bodyLength: body.length }, 'webhook raw headers')

    if (!validateWebhookSignature(body, signature)) {
      log.error({ signatureReceived: signature ?? '(none)' }, 'webhook signature verification failed')
      return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
    }

    let payload: PagBankWebhookPayload
    try {
      payload = JSON.parse(body) as PagBankWebhookPayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const eventType = payload.type // e.g. "CHARGE", "ORDER", "SUBSCRIPTION"
    const chargeStatus = payload.data?.status

    log.info({ eventType, chargeStatus, notificationId: payload.id }, 'PagBank webhook received')

    // ── CHARGE / ORDER events ──────────────────────────────────────────────

    if (eventType === 'CHARGE' || eventType === 'ORDER') {
      const referenceId = payload.data?.reference_id

      if (!referenceId) {
        log.warn({ payload }, 'webhook missing reference_id, skipping')
        return NextResponse.json({ received: true })
      }

      // Fetch full order details from PagBank to get metadata and amounts
      const order = await findOrderByReference(referenceId)
      if (!order) {
        log.warn({ referenceId }, 'order not found for reference, skipping')
        return NextResponse.json({ received: true })
      }

      const firstCharge = order.charges?.[0]
      if (!firstCharge) {
        log.warn({ referenceId }, 'order has no charges, skipping')
        return NextResponse.json({ received: true })
      }

      const donationStatus = mapChargeStatus(firstCharge)
      const metadata = order.metadata ?? {}

      if (donationStatus === 'completed') {
        await saveDonation({
          paymentId: referenceId,
          userId: metadata.userId || undefined,
          email: metadata.userEmail || order.customer?.email || '',
          amount: (firstCharge.amount.value ?? 0) / 100,
          type: (metadata.donationType as 'single' | 'monthly') ?? 'single',
          status: 'completed',
          campaignId: metadata.campaignId,
          campaignName: metadata.campaignName,
          createdAt: new Date().toISOString(),
        })
        log.info({ referenceId }, 'donation saved')
      } else if (donationStatus === 'failed' || donationStatus === 'cancelled') {
        await updateDonationStatus(referenceId, donationStatus)
        log.warn({ referenceId, donationStatus }, 'donation failed or cancelled')
      }
    }

    // ── SUBSCRIPTION events ────────────────────────────────────────────────

    else if (eventType === 'SUBSCRIPTION') {
      const subscriptionId = payload.data?.id
      const status = payload.data?.status

      if (!subscriptionId || !status) {
        return NextResponse.json({ received: true })
      }

      if (status === 'SUSPENDED' || status === 'CANCELED') {
        await cancelSubscriptionByStripeId(subscriptionId)
        log.info({ subscriptionId, status }, 'subscription cancelled')
      } else {
        const dbStatus =
          status === 'ACTIVE' ? 'active' :
          status === 'SUSPENDED' ? 'paused' :
          'cancelled'
        await syncSubscriptionStatus({
          id: subscriptionId,
          status: dbStatus,
          current_period_end: 0,
        })
        log.info({ subscriptionId, status }, 'subscription status synced')
      }
    }

    // ── SUBSCRIPTION_CHARGE events (recurring billing) ────────────────────

    else if (eventType === 'SUBSCRIPTION_CHARGE') {
      const charges = payload.data?.charges
      if (!charges?.length) return NextResponse.json({ received: true })

      const charge = charges[0]
      const subscriptionId = payload.data?.id

      if (charge.status === 'PAID' && subscriptionId) {
        await saveDonation({
          paymentId: charge.id,
          subscriptionId,
          email: '',
          amount: (charge.amount.value ?? 0) / 100,
          type: 'monthly',
          status: 'completed',
          createdAt: new Date().toISOString(),
        })
        log.info({ chargeId: charge.id, subscriptionId }, 'recurring charge saved')
      } else if (charge.status === 'DECLINED' && subscriptionId) {
        await updateDonationStatusBySubscription(subscriptionId, 'failed')
        log.warn({ chargeId: charge.id }, 'recurring charge failed')
      }
    }

    else {
      log.debug({ eventType }, 'unhandled PagBank webhook event type')
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    log.error({ error }, 'webhook handler error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
