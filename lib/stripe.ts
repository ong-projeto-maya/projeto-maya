/**
 * Shared Stripe client with startup-time environment validation.
 * Import this instead of instantiating `new Stripe(...)` in each route.
 */
import 'server-only'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover',
})

/**
 * Returns the webhook secret, throwing at call-time if not configured.
 * Only used in the webhook route, so the error surface is clear.
 */
export function getWebhookSecret(): string {
  if (!stripeWebhookSecret) {
    throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET')
  }
  return stripeWebhookSecret
}
