/**
 * Shared Stripe client — lazy initialisation.
 * Validation is deferred to first use so the module can be imported during
 * Next.js build-time static analysis without requiring env vars to be set.
 */
import 'server-only'
import Stripe from 'stripe'

let _stripe: Stripe | null = null

/** Returns the singleton Stripe client, throwing if the key is missing at call time. */
export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
  }
  _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' })
  return _stripe
}

/**
 * Convenience re-export — keeps existing `stripe.xxx` call-sites working.
 * Uses a Proxy so the env-var check still happens at call time, not import time.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

/** Returns the webhook secret, throwing at call-time if not configured. */
export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET')
  }
  return secret
}
