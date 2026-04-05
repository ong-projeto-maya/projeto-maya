import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe, getWebhookSecret } from '@/lib/stripe'
import { createRouteLogger } from '@/lib/logger'
import {
  saveDonation,
  updateDonationStatus,
  updateDonationStatusBySubscription,
  cancelSubscriptionByStripeId,
  syncSubscriptionStatus,
  updateNextBillingDate,
} from '@/lib/donationStorage'

const log = createRouteLogger('webhook')

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret())
    } catch (err: unknown) {
      log.error({ error: err }, 'webhook signature verification failed')
      return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const donationType = (session.metadata?.donationType ?? 'single') as 'single' | 'monthly'
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id

        await saveDonation({
          stripeSessionId: session.id,
          stripeSubscriptionId: subscriptionId,
          email: session.customer_email ?? '',
          amount: (session.amount_total ?? 0) / 100,
          type: donationType,
          status: 'completed',
          campaignId: session.metadata?.campaignId,
          campaignName: session.metadata?.campaignName,
          createdAt: new Date().toISOString(),
        })

        log.info({ sessionId: session.id }, 'donation saved')
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        log.info({ subscriptionId: subscription.id }, 'new subscription created')
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await syncSubscriptionStatus({
          id: subscription.id,
          status: subscription.status,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_end: (subscription as any).current_period_end as number,
        })
        log.info({ subscriptionId: subscription.id }, 'subscription updated')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await cancelSubscriptionByStripeId(subscription.id)
        log.info({ subscriptionId: subscription.id }, 'subscription cancelled')
        break
      }

      case 'invoice.payment_succeeded': {
        type InvoiceExpanded = Stripe.Invoice & {
          subscription?: string | { id: string } | null
          customer_email?: string | null
        }
        const invoice = event.data.object as InvoiceExpanded
        // Skip the first invoice — checkout.session.completed already recorded it.
        // billing_reason 'subscription_create' means first charge of a new subscription.
        if (invoice.billing_reason === 'subscription_create') {
          // Still sync nextBillingDate on the subscription record
          const subId = typeof invoice.subscription === 'string'
            ? invoice.subscription
            : (invoice.subscription as { id: string } | null | undefined)?.id
          if (subId) {
            const nextBilling = invoice.lines.data[0]?.period?.end
              ? new Date(invoice.lines.data[0].period.end * 1000).toISOString().split('T')[0]
              : undefined
            if (nextBilling) {
              await updateNextBillingDate(subId, nextBilling)
            }
          }
          break
        }
        // Subsequent monthly charges — save as new donation entry
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id: string } | null | undefined)?.id
        const customerEmail = invoice.customer_email
        if (subId && customerEmail) {
          const nextBilling = invoice.lines.data[0]?.period?.end
            ? new Date(invoice.lines.data[0].period.end * 1000).toISOString().split('T')[0]
            : undefined
          await saveDonation({
            stripeSessionId: invoice.id,
            stripeSubscriptionId: subId,
            email: customerEmail,
            amount: (invoice.amount_paid ?? 0) / 100,
            type: 'monthly',
            status: 'completed',
            createdAt: new Date().toISOString(),
            nextBillingDate: nextBilling,
          })
          log.info({ invoiceId: invoice.id }, 'monthly invoice saved')
        }
        break
      }

      case 'invoice.payment_failed': {
        type InvoiceExpanded = Stripe.Invoice & {
          subscription?: string | { id: string } | null
        }
        const invoice = event.data.object as InvoiceExpanded
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id: string } | null | undefined)?.id
        if (subId) {
          await updateDonationStatusBySubscription(subId, 'failed')
        } else {
          await updateDonationStatus(invoice.id, 'failed')
        }
        log.warn({ invoiceId: invoice.id }, 'payment failed')
        break
      }

      default:
        log.debug({ eventType: event.type }, 'unhandled webhook event')
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    log.error({ error }, 'webhook handler error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
