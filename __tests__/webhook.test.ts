/**
 * Tests for the Stripe webhook route handler.
 * Mocks: Stripe SDK, donationStorage, next/headers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- mock next/headers ----
const mockHeadersGet = vi.fn<() => string | null>(() => 'test-sig')
vi.mock('next/headers', () => ({
  headers: () => ({ get: mockHeadersGet }),
}))

// ---- mock donationStorage ----
const mockSaveDonation = vi.fn().mockResolvedValue({ id: 'don-1' })
const mockUpdateDonationStatus = vi.fn().mockResolvedValue(undefined)
const mockUpdateDonationStatusBySubscription = vi.fn().mockResolvedValue(undefined)
const mockCancelSubscriptionByStripeId = vi.fn().mockResolvedValue(undefined)
const mockSyncSubscriptionStatus = vi.fn().mockResolvedValue(undefined)
const mockUpdateNextBillingDate = vi.fn().mockResolvedValue(undefined)

vi.mock('@/lib/donationStorage', () => ({
  saveDonation: mockSaveDonation,
  updateDonationStatus: mockUpdateDonationStatus,
  updateDonationStatusBySubscription: mockUpdateDonationStatusBySubscription,
  cancelSubscriptionByStripeId: mockCancelSubscriptionByStripeId,
  syncSubscriptionStatus: mockSyncSubscriptionStatus,
  updateNextBillingDate: mockUpdateNextBillingDate,
}))

// ---- mock @/lib/stripe with constructEvent ----
const mockConstructEvent = vi.fn()
vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: { constructEvent: mockConstructEvent },
  },
  getWebhookSecret: () => 'whsec_test',
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}))

// ---- import the route once (mocks are already in place) ----
let POST: (req: Request) => Promise<Response>

beforeEach(async () => {
  vi.clearAllMocks()
  mockHeadersGet.mockReturnValue('test-sig')
  const mod = await import('../app/api/webhook/route')
  POST = mod.POST
})

async function callWebhook(event: object) {
  mockConstructEvent.mockReturnValue(event)
  const req = new Request('http://localhost/api/webhook', {
    method: 'POST',
    body: 'raw-body',
  })
  return POST(req)
}

function makeEvent(type: string, data: object): object {
  return { type, data: { object: data } }
}

describe('POST /api/webhook', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    mockHeadersGet.mockReturnValue(null)
    const req = new Request('http://localhost/api/webhook', { method: 'POST', body: '' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('signature')
  })

  describe('checkout.session.completed', () => {
    it('saves a single donation', async () => {
      const event = makeEvent('checkout.session.completed', {
        id: 'cs_test_1',
        amount_total: 5000,
        customer_email: 'test@example.com',
        subscription: null,
        metadata: { donationType: 'single' },
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          stripeSessionId: 'cs_test_1',
          amount: 50,
          type: 'single',
          status: 'completed',
          email: 'test@example.com',
        })
      )
    })

    it('saves a monthly donation with subscriptionId', async () => {
      const event = makeEvent('checkout.session.completed', {
        id: 'cs_test_monthly',
        amount_total: 10000,
        customer_email: 'donor@example.com',
        subscription: 'sub_abc123',
        metadata: { donationType: 'monthly' },
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monthly',
          stripeSubscriptionId: 'sub_abc123',
        })
      )
    })
  })

  describe('invoice.payment_succeeded', () => {
    it('skips recording when billing_reason is subscription_create (dedup)', async () => {
      const event = makeEvent('invoice.payment_succeeded', {
        id: 'in_first',
        billing_reason: 'subscription_create',
        subscription: 'sub_abc123',
        customer_email: 'donor@example.com',
        amount_paid: 10000,
        lines: { data: [{ period: { end: 1700000000 } }] },
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      // saveDonation must NOT be called — checkout.session.completed already handled it
      expect(mockSaveDonation).not.toHaveBeenCalled()
      // nextBillingDate sync should happen
      expect(mockUpdateNextBillingDate).toHaveBeenCalledWith('sub_abc123', expect.any(String))
    })

    it('records subsequent monthly charges', async () => {
      const event = makeEvent('invoice.payment_succeeded', {
        id: 'in_renewal',
        billing_reason: 'subscription_cycle',
        subscription: 'sub_abc123',
        customer_email: 'donor@example.com',
        amount_paid: 10000,
        lines: { data: [{ period: { end: 1700086400 } }] },
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          stripeSessionId: 'in_renewal',
          type: 'monthly',
          status: 'completed',
          amount: 100,
        })
      )
    })
  })

  describe('customer.subscription.updated', () => {
    it('syncs subscription status', async () => {
      const event = makeEvent('customer.subscription.updated', {
        id: 'sub_abc123',
        status: 'paused',
        current_period_end: 1700000000,
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockSyncSubscriptionStatus).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'sub_abc123', status: 'paused' })
      )
    })
  })

  describe('customer.subscription.deleted', () => {
    it('cancels subscription and marks donations cancelled (not failed)', async () => {
      const event = makeEvent('customer.subscription.deleted', {
        id: 'sub_del123',
        status: 'canceled',
        current_period_end: 1700000000,
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockCancelSubscriptionByStripeId).toHaveBeenCalledWith('sub_del123')
    })
  })

  describe('invoice.payment_failed', () => {
    it('marks subscription donations as failed', async () => {
      const event = makeEvent('invoice.payment_failed', {
        id: 'in_fail',
        subscription: 'sub_fail123',
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockUpdateDonationStatusBySubscription).toHaveBeenCalledWith('sub_fail123', 'failed')
    })

    it('marks single donation as failed by session id when no subscription', async () => {
      const event = makeEvent('invoice.payment_failed', {
        id: 'in_single_fail',
        subscription: null,
      })
      const res = await callWebhook(event)
      expect(res.status).toBe(200)
      expect(mockUpdateDonationStatus).toHaveBeenCalledWith('in_single_fail', 'failed')
    })
  })
})
