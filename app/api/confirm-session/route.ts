import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('confirm-session')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id é obrigatório' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    })

    const subscription = session.subscription as Stripe.Subscription | null

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency,
      customerEmail: session.customer_email,
      donationType: session.metadata?.donationType ?? 'single',
      campaignId: session.metadata?.campaignId ?? null,
      campaignName: session.metadata?.campaignName ?? null,
      subscriptionId: subscription?.id ?? null,
      nextBillingDate: subscription
        ? new Date((subscription as any).current_period_end * 1000).toISOString().split('T')[0]
        : null,
    })
  } catch (error) {
    log.error({ error }, 'confirm-session failed')
    return NextResponse.json({ error: 'Erro ao recuperar sessão' }, { status: 500 })
  }
}
