/**
 * Tests for POST /api/create-checkout-session.
 *
 * This is the route the donate button calls, so the amount and type checks
 * here are the only thing between a form and a PagBank charge. The suite also
 * pins down what gets sent to PagBank: a monthly donation has to go out as a
 * recurrence plan on credit card only, and the pending donation has to be
 * recorded even when nobody is logged in.
 *
 * It replaces an earlier suite written against Stripe, which the site no
 * longer uses.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- mocks for everything the route reaches out to ----

vi.mock('next/headers', () => ({
  cookies: () => ({ getAll: () => [] }),
}))

// No logged-in donor by default; a test can set one.
let mockUser: { id: string; email: string } | null = null
vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: async () => ({ data: { user: mockUser }, error: null }) },
  }),
}))

const mockCreateCheckout = vi.fn()
vi.mock('@/lib/pagbank', () => ({
  createCheckout: mockCreateCheckout,
  generateReferenceId: () => 'REF_TEST_1',
  getCheckoutUrl: () => 'https://pagseguro.uol.com.br/checkout/REF_TEST_1',
}))

const mockSaveDonation = vi.fn()
vi.mock('@/lib/donationStorage', () => ({
  saveDonation: mockSaveDonation,
}))

vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}))

// ---- helper to call the route handler directly ----

type JsonBody = Record<string, unknown>

async function callCheckout(body: JsonBody, env: Record<string, string> = {}) {
  const savedEnv: Record<string, string | undefined> = {}
  const allEnv = {
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
    ...env,
  }
  for (const [k, v] of Object.entries(allEnv)) {
    savedEnv[k] = process.env[k]
    process.env[k] = v
  }

  vi.resetModules()
  const mod = await import('../app/api/create-checkout-session/route')

  const req = new Request('http://localhost/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const res = await mod.POST(req)
  const json = await res.json()

  for (const [k, v] of Object.entries(savedEnv)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }

  return { status: res.status, json }
}

/** What the route asked PagBank to create. */
function checkoutPayload() {
  return mockCreateCheckout.mock.calls[0][0] as Record<string, never>
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUser = null
  mockCreateCheckout.mockResolvedValue({
    id: 'CHEC_1',
    links: [{ rel: 'PAY', href: 'https://pagseguro.uol.com.br/checkout/REF_TEST_1' }],
  })
  mockSaveDonation.mockResolvedValue({ id: 'don-1' })
})

describe('POST /api/create-checkout-session', () => {
  describe('amount validation', () => {
    it('rejects amount below minimum (R$5)', async () => {
      const { status, json } = await callCheckout({ amount: 4, donationType: 'single' })
      expect(status).toBe(400)
      expect(json.error).toMatch(/mínimo/i)
    })

    it('rejects amount of 0', async () => {
      const { status } = await callCheckout({ amount: 0, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects negative amount', async () => {
      const { status } = await callCheckout({ amount: -10, donationType: 'single' })
      expect(status).toBe(400)
    })

    it('rejects amount above maximum (R$50,000)', async () => {
      const { status, json } = await callCheckout({ amount: 50001, donationType: 'single' })
      expect(status).toBe(400)
      expect(json.error).toMatch(/máximo/i)
    })

    it('rejects non-finite amount (Infinity)', async () => {
      // JSON.stringify turns Infinity into null, which is not finite either.
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

    it('reaches PagBank for none of the rejected amounts', async () => {
      await callCheckout({ amount: 4, donationType: 'single' })
      expect(mockCreateCheckout).not.toHaveBeenCalled()
    })

    it('accepts R$5 (minimum)', async () => {
      const { status } = await callCheckout({ amount: 5, donationType: 'single' })
      expect(status).toBe(200)
    })

    it('accepts R$50,000 (maximum)', async () => {
      const { status } = await callCheckout({ amount: 50000, donationType: 'single' })
      expect(status).toBe(200)
    })

    it('sends the amount to PagBank in centavos', async () => {
      await callCheckout({ amount: 50.5, donationType: 'single' })
      const items = checkoutPayload().items as unknown as { unit_amount: number }[]
      expect(items[0].unit_amount).toBe(5050)
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

  describe('what is sent to PagBank', () => {
    it('offers card, pix and boleto on a one-off donation', async () => {
      await callCheckout({ amount: 50, donationType: 'single' })
      const methods = checkoutPayload().payment_methods as unknown as { type: string }[]
      expect(methods.map(m => m.type)).toEqual(
        expect.arrayContaining(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BOLETO'])
      )
      expect(checkoutPayload()).not.toHaveProperty('recurrence_plan')
    })

    it('restricts a monthly donation to credit card and sends a recurrence plan', async () => {
      // PagBank's recurring checkout accepts credit card only; pix and boleto
      // cannot be charged again by themselves.
      await callCheckout({ amount: 30, donationType: 'monthly' })
      const methods = checkoutPayload().payment_methods as unknown as { type: string }[]
      expect(methods).toEqual([{ type: 'CREDIT_CARD' }])
      const plan = checkoutPayload().recurrence_plan as unknown as {
        interval: { unit: string; length: number }
      }
      expect(plan.interval).toEqual({ unit: 'MONTH', length: 1 })
    })

    it('points the notification URL at our own webhook', async () => {
      await callCheckout({ amount: 50, donationType: 'single' })
      expect(checkoutPayload().notification_urls).toEqual(['http://localhost:3000/api/webhook'])
    })

    it('carries the donor through in the metadata when one is logged in', async () => {
      mockUser = { id: 'u7', email: 'ana@exemplo.com' }
      await callCheckout({ amount: 50, donationType: 'single' })
      expect(checkoutPayload().metadata).toEqual(
        expect.objectContaining({ userId: 'u7', userEmail: 'ana@exemplo.com' })
      )
    })

    it('leaves the donor out of the metadata for an anonymous donation', async () => {
      await callCheckout({ amount: 50, donationType: 'single' })
      const metadata = checkoutPayload().metadata as unknown as Record<string, unknown>
      expect(metadata).not.toHaveProperty('userId')
      expect(metadata).not.toHaveProperty('userEmail')
    })
  })

  describe('the pending donation record', () => {
    it('records the donation as pending before the donor pays', async () => {
      mockUser = { id: 'u7', email: 'ana@exemplo.com' }
      await callCheckout({ amount: 50, donationType: 'single' })
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: 'REF_TEST_1',
          userId: 'u7',
          email: 'ana@exemplo.com',
          amount: 50,
          type: 'single',
          status: 'pending',
        })
      )
    })

    it('uses the anonymous placeholder when nobody is logged in', async () => {
      await callCheckout({ amount: 50, donationType: 'single' })
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'anonymous@projetomaya.org' })
      )
    })

    it('still returns the checkout URL when the pending record cannot be saved', async () => {
      // The donor is already on their way to PagBank; a database hiccup here
      // must not cost the donation.
      mockSaveDonation.mockRejectedValue(new Error('supabase down'))
      const { status, json } = await callCheckout({ amount: 50, donationType: 'single' })
      expect(status).toBe(200)
      expect(json.checkoutUrl).toBeTruthy()
    })
  })

  describe('campaign sanitization', () => {
    it('drops a campaignId with invalid characters', async () => {
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'bad id with spaces!',
        campaignName: 'Test Campaign',
      })
      expect(status).toBe(200)
      const metadata = checkoutPayload().metadata as unknown as Record<string, unknown>
      expect(metadata).not.toHaveProperty('campaignId')
    })

    it('keeps a valid campaignId', async () => {
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'camp-123_abc',
        campaignName: 'Test Campaign',
      })
      expect(status).toBe(200)
      expect(checkoutPayload().metadata).toEqual(
        expect.objectContaining({ campaignId: 'camp-123_abc', campaignName: 'Test Campaign' })
      )
    })

    it('truncates a campaignName longer than 200 chars', async () => {
      const { status } = await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'camp-1',
        campaignName: 'x'.repeat(250),
      })
      expect(status).toBe(200)
      const metadata = checkoutPayload().metadata as unknown as { campaignName: string }
      expect(metadata.campaignName).toHaveLength(200)
    })

    it('strips control characters out of the campaignName', async () => {
      await callCheckout({
        amount: 50,
        donationType: 'single',
        campaignId: 'camp-1',
        campaignName: 'Resgate\n\u0000 urgente',
      })
      const metadata = checkoutPayload().metadata as unknown as { campaignName: string }
      expect(metadata.campaignName).toBe('Resgate urgente')
    })
  })

  describe('failures', () => {
    it('returns 500 when NEXT_PUBLIC_SITE_URL is missing', async () => {
      const { status } = await callCheckout(
        { amount: 50, donationType: 'single' },
        { NEXT_PUBLIC_SITE_URL: '' }
      )
      expect(status).toBe(500)
    })

    it('returns 500 without leaking the PagBank error to the donor', async () => {
      mockCreateCheckout.mockRejectedValue(new Error('PagBank 401: invalid token'))
      const { status, json } = await callCheckout({ amount: 50, donationType: 'single' })
      expect(status).toBe(500)
      expect(JSON.stringify(json)).not.toMatch(/token/i)
    })
  })
})
