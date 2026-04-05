/**
 * Tests for create-checkout-session validation logic.
 * External dependencies (Stripe SDK, fetch) are fully mocked.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ---- helpers to call the route handler directly ----

type JsonBody = Record<string, unknown>

async function callCheckout(body: JsonBody, env: Record<string, string> = {}) {
  // Set env before importing the module
  const savedEnv: Record<string, string | undefined> = {}
  const allEnv = {
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    STRIPE_SECRET_KEY: 'sk_test_key',
    ...env,
  }
  for (const [k, v] of Object.entries(allEnv)) {
    savedEnv[k] = process.env[k]
    process.env[k] = v
  }

  // Dynamically import so module-level Stripe init uses the env
  vi.resetModules()
  const mod = await import('../app/api/create-checkout-session/route')

  const req = new Request('http://localhost/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const res = await mod.POST(req)
  const json = await res.json()

  // Restore env
  for (const [k, v] of Object.entries(savedEnv)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }

  return { status: res.status, json }
}

// Mock @/lib/stripe and @/lib/logger (both import server-only)
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'cs_test', url: 'https://checkout.stripe.com/test' }),
      },
    },
  },
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}))

describe('POST /api/create-checkout-session', () => {
  describe('amount validation', () => {
    it('rejects amount below minimum (R$5)', async () => {
      const { status, json } = await callCheckout({ amount: 4, donationType: 'single' })
      expect(status).toBe(400)
      expect(json.error).toMatch(/mínimo/i)
    })

    it('rejects amount of 0', async () => {
      const { status, json } = await callCheckout({ amount: 0, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects negative amount', async () => {
      const { status, json } = await callCheckout({ amount: -10, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects amount above maximum (R$50,000)', async () => {
      const { status, json } = await callCheckout({ amount: 50001, donationType: 'single' })
      expect(status).toBe(400)
      expect(json.error).toMatch(/máximo/i)
    })

    it('rejects non-finite amount (Infinity)', async () => {
      const { status } = await callCheckout({ amount: Infinity, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects NaN amount', async () => {
      const { status } = await callCheckout({ amount: NaN, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects string amount', async () => {
      const { status } = await callCheckout({ amount: 'abc', donationType: 'single' })
      expect(status).toBe(400)
    })

    it('accepts R$5 (minimum)', async () => {
      const { status } = await callCheckout({ amount: 5, donationType: 'single' })
      expect(status).toBe(200)
    })

    it('accepts R$50,000 (maximum)', async () => {
      const { status } = await callCheckout({ amount: 50000, donationType: 'single' })
      expect(status).toBe(200)
    })
  })

  describe('donationType validation', () => {
    it('rejects unknown donationType', async () => {
      const { status, json } = await callCheckout({ amount: 50, donationType: 'annual' })
      expect(status).toBe(400)
      expect(json.error).toMatch(/tipo/i)
    })

    it('accepts single', async () => {
      const { status } = await callCheckout({ amount: 50, donationType: 'single' })
      expect(status).toBe(200)
    })

    it('accepts monthly', async () => {
      const { status } = await callCheckout({ amount: 50, donationType: 'monthly' })
      expect(status).toBe(200)
    })

    it('rejects empty donationType', async () => {
      const { status } = await callCheckout({ amount: 50, donationType: '' })
      expect(status).toBe(400)
    })
  })

  describe('campaign sanitization', () => {
    it('strips campaignId with invalid characters', async () => {
      // Should not throw — invalid campaignId is silently ignored
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'bad id with spaces!',
        campaignName: 'Test Campaign',
      })
      expect(status).toBe(200)
    })

    it('accepts valid campaignId', async () => {
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'camp-123_abc',
        campaignName: 'Test Campaign',
      })
      expect(status).toBe(200)
    })

    it('strips campaignName longer than 200 chars', async () => {
      const longName = 'x'.repeat(250)
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'camp-1',
        campaignName: longName,
      })
      expect(status).toBe(200)
    })
  })

  describe('missing env configuration', () => {
    it('returns 500 when NEXT_PUBLIC_SITE_URL is missing', async () => {
      const { status } = await callCheckout(
        { amount: 50, donationType: 'single' },
        { NEXT_PUBLIC_SITE_URL: '' }
      )
      expect(status).toBe(500)
    })
  })
})
