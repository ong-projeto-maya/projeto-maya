/**
 * Tests for POST /api/webhook — the PagBank notification handler.
 *
 * This endpoint is public, unauthenticated and writes with the service role
 * key, so the signature guard comes first. After that, the cases that matter
 * are the four event families PagBank sends: CHARGE and ORDER (one-off
 * donations), SUBSCRIPTION (status changes) and SUBSCRIPTION_CHARGE (the
 * monthly billing, which carries no metadata and has to look the donor up).
 *
 * It replaces an earlier suite written against Stripe, which the site no
 * longer uses.
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
const mockCancelSubscription = vi.fn().mockResolvedValue(undefined)
const mockSyncSubscriptionStatus = vi.fn().mockResolvedValue(undefined)
const mockGetSubscriptionDonor = vi.fn().mockResolvedValue(null)

vi.mock('@/lib/donationStorage', () => ({
  saveDonation: mockSaveDonation,
  updateDonationStatus: mockUpdateDonationStatus,
  updateDonationStatusBySubscription: mockUpdateDonationStatusBySubscription,
  cancelSubscriptionById: mockCancelSubscription,
  syncSubscriptionStatus: mockSyncSubscriptionStatus,
  getSubscriptionDonor: mockGetSubscriptionDonor,
}))

// ---- mock @/lib/pagbank ----
const mockValidateSignature = vi.fn(() => true)
const mockRetrieveOrder = vi.fn()
vi.mock('@/lib/pagbank', () => ({
  validateWebhookSignature: mockValidateSignature,
  retrieveOrder: mockRetrieveOrder,
  // mapChargeStatus is pure, so the real mapping is used rather than a stub —
  // a wrong mapping is exactly the kind of bug these tests should catch.
  mapChargeStatus: (charge: { status: string }) =>
    charge.status === 'PAID' ? 'completed' :
    charge.status === 'DECLINED' ? 'failed' :
    charge.status === 'CANCELLED' ? 'cancelled' :
    'pending',
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}))

// ---- import the route once (mocks are already in place) ----
let POST: (req: Request) => Promise<Response>

beforeEach(async () => {
  vi.clearAllMocks()
  mockHeadersGet.mockReturnValue('test-sig')
  mockValidateSignature.mockReturnValue(true)
  mockGetSubscriptionDonor.mockResolvedValue(null)
  const mod = await import('../app/api/webhook/route')
  POST = mod.POST
})

function callWebhook(payload: object | string) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  return POST(new Request('http://localhost/api/webhook', { method: 'POST', body }))
}

function charge(over: Record<string, unknown> = {}) {
  return { id: 'CHAR_1', status: 'PAID', amount: { value: 5000 }, ...over }
}

describe('POST /api/webhook', () => {
  describe('the signature guard', () => {
    it('returns 400 when the signature does not check out', async () => {
      mockValidateSignature.mockReturnValue(false)
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_1' } })
      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('signature')
    })

    it('does nothing to the database when the signature fails', async () => {
      mockValidateSignature.mockReturnValue(false)
      await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_1' } })
      expect(mockSaveDonation).not.toHaveBeenCalled()
      expect(mockRetrieveOrder).not.toHaveBeenCalled()
    })

    it('returns 400 on a body that is not JSON', async () => {
      const res = await callWebhook('not json at all')
      expect(res.status).toBe(400)
    })
  })

  describe('CHARGE / ORDER — one-off donations', () => {
    it('saves a paid donation with the data from the order', async () => {
      mockRetrieveOrder.mockResolvedValue({
        id: 'ORDE_1',
        reference_id: 'REF_1',
        charges: [charge()],
        customer: { name: 'Ana', email: 'ana@exemplo.com' },
        metadata: { donationType: 'single', userEmail: 'ana@exemplo.com', userId: 'u1' },
      })
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_1', reference_id: 'REF_1' } })
      expect(res.status).toBe(200)
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: 'REF_1',
          amount: 50,
          type: 'single',
          status: 'completed',
          email: 'ana@exemplo.com',
          userId: 'u1',
        })
      )
    })

    it('falls back to the order customer e-mail when metadata has none', async () => {
      mockRetrieveOrder.mockResolvedValue({
        id: 'ORDE_2',
        reference_id: 'REF_2',
        charges: [charge()],
        customer: { name: 'Ana', email: 'ana@exemplo.com' },
        metadata: {},
      })
      await callWebhook({ type: 'ORDER', data: { id: 'ORDE_2' } })
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'ana@exemplo.com' })
      )
    })

    it('marks the donation failed when the charge was declined', async () => {
      mockRetrieveOrder.mockResolvedValue({
        id: 'ORDE_3',
        reference_id: 'REF_3',
        charges: [charge({ status: 'DECLINED' })],
        metadata: {},
      })
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_3' } })
      expect(res.status).toBe(200)
      expect(mockUpdateDonationStatus).toHaveBeenCalledWith('REF_3', 'failed')
      expect(mockSaveDonation).not.toHaveBeenCalled()
    })

    it('writes nothing for a charge still in analysis', async () => {
      mockRetrieveOrder.mockResolvedValue({
        id: 'ORDE_4',
        reference_id: 'REF_4',
        charges: [charge({ status: 'IN_ANALYSIS' })],
        metadata: {},
      })
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_4' } })
      expect(res.status).toBe(200)
      expect(mockSaveDonation).not.toHaveBeenCalled()
      expect(mockUpdateDonationStatus).not.toHaveBeenCalled()
    })

    it('acknowledges and skips when the order cannot be fetched', async () => {
      mockRetrieveOrder.mockRejectedValue(new Error('404 from PagBank'))
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_MISSING' } })
      // 200: a retry would not help, and PagBank must not keep resending it.
      expect(res.status).toBe(200)
      expect(mockSaveDonation).not.toHaveBeenCalled()
    })

    it('acknowledges and skips an order with no charges', async () => {
      mockRetrieveOrder.mockResolvedValue({
        id: 'ORDE_5',
        reference_id: 'REF_5',
        charges: [],
        metadata: {},
      })
      const res = await callWebhook({ type: 'CHARGE', data: { id: 'ORDE_5' } })
      expect(res.status).toBe(200)
      expect(mockSaveDonation).not.toHaveBeenCalled()
    })

    it('acknowledges and skips a payload with neither id nor reference_id', async () => {
      const res = await callWebhook({ type: 'CHARGE', data: {} })
      expect(res.status).toBe(200)
      expect(mockRetrieveOrder).not.toHaveBeenCalled()
    })
  })

  describe('SUBSCRIPTION — status changes', () => {
    it('cancels everything tied to a cancelled subscription', async () => {
      const res = await callWebhook({
        type: 'SUBSCRIPTION',
        data: { id: 'SUBS_1', status: 'CANCELED' },
      })
      expect(res.status).toBe(200)
      expect(mockCancelSubscription).toHaveBeenCalledWith('SUBS_1')
    })

    it('cancels on a suspended subscription too', async () => {
      await callWebhook({ type: 'SUBSCRIPTION', data: { id: 'SUBS_2', status: 'SUSPENDED' } })
      expect(mockCancelSubscription).toHaveBeenCalledWith('SUBS_2')
    })

    it('syncs an active subscription without touching the next billing date', async () => {
      await callWebhook({ type: 'SUBSCRIPTION', data: { id: 'SUBS_3', status: 'ACTIVE' } })
      expect(mockSyncSubscriptionStatus).toHaveBeenCalledWith({ id: 'SUBS_3', status: 'active' })
      // The payload carries no next billing date. Passing one anyway used to
      // write 1970-01-01 over the real date.
      const arg = mockSyncSubscriptionStatus.mock.calls[0][0] as Record<string, unknown>
      expect(arg).not.toHaveProperty('current_period_end')
    })

    it('acknowledges and skips when id or status is missing', async () => {
      const res = await callWebhook({ type: 'SUBSCRIPTION', data: { id: 'SUBS_4' } })
      expect(res.status).toBe(200)
      expect(mockSyncSubscriptionStatus).not.toHaveBeenCalled()
      expect(mockCancelSubscription).not.toHaveBeenCalled()
    })
  })

  describe('SUBSCRIPTION_CHARGE — the monthly billing', () => {
    it('links the charge to the donor the subscription belongs to', async () => {
      mockGetSubscriptionDonor.mockResolvedValue({ doadorId: 'u9', email: 'ana@exemplo.com' })
      const res = await callWebhook({
        type: 'SUBSCRIPTION_CHARGE',
        data: { id: 'SUBS_9', charges: [charge({ id: 'CHAR_9', amount: { value: 3000 } })] },
      })
      expect(res.status).toBe(200)
      expect(mockGetSubscriptionDonor).toHaveBeenCalledWith('SUBS_9')
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: 'CHAR_9',
          subscriptionId: 'SUBS_9',
          userId: 'u9',
          email: 'ana@exemplo.com',
          amount: 30,
          type: 'monthly',
          status: 'completed',
        })
      )
    })

    it('still records the donation when the donor cannot be resolved', async () => {
      mockGetSubscriptionDonor.mockResolvedValue(null)
      const res = await callWebhook({
        type: 'SUBSCRIPTION_CHARGE',
        data: { id: 'SUBS_10', charges: [charge({ id: 'CHAR_10' })] },
      })
      expect(res.status).toBe(200)
      // Money that came in is never dropped: it is saved unlinked and can be
      // attached to a donor later, since the subscription id is on the row.
      expect(mockSaveDonation).toHaveBeenCalledWith(
        expect.objectContaining({ paymentId: 'CHAR_10', subscriptionId: 'SUBS_10', email: '' })
      )
      const arg = mockSaveDonation.mock.calls[0][0] as Record<string, unknown>
      expect(arg.userId).toBeUndefined()
    })

    it('marks the subscription failed when a recurring charge is declined', async () => {
      const res = await callWebhook({
        type: 'SUBSCRIPTION_CHARGE',
        data: { id: 'SUBS_11', charges: [charge({ status: 'DECLINED' })] },
      })
      expect(res.status).toBe(200)
      expect(mockUpdateDonationStatusBySubscription).toHaveBeenCalledWith('SUBS_11', 'failed')
      expect(mockSaveDonation).not.toHaveBeenCalled()
    })

    it('acknowledges and skips when the payload has no charges', async () => {
      const res = await callWebhook({ type: 'SUBSCRIPTION_CHARGE', data: { id: 'SUBS_12' } })
      expect(res.status).toBe(200)
      expect(mockSaveDonation).not.toHaveBeenCalled()
    })
  })

  it('acknowledges an event type it does not handle', async () => {
    const res = await callWebhook({ type: 'SOMETHING_NEW', data: { id: 'X' } })
    expect(res.status).toBe(200)
    expect(mockSaveDonation).not.toHaveBeenCalled()
  })
})
