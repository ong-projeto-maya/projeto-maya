/**
 * Tests for donationStorage utility functions.
 * Supabase client is fully mocked.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- mock supabase-server ----
const fromMock = vi.fn()
vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => ({ from: fromMock }),
}))

// Also mock 'server-only' so it doesn't throw in test environment
vi.mock('server-only', () => ({}))

import {
  saveDonation,
  updateDonationStatus,
  updateDonationStatusBySubscription,
  cancelSubscriptionByStripeId,
  syncSubscriptionStatus,
  updateNextBillingDate,
  getDonationsByEmail,
} from '../lib/donationStorage'

// ---- helper to build a chainable Supabase query mock ----
function makeQueryChain(result: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['from', 'upsert', 'insert', 'update', 'select', 'eq', 'ilike', 'order', 'single', 'limit']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  ;(chain as { then: (fn: (v: unknown) => unknown) => Promise<unknown> }).then = (fn) =>
    Promise.resolve(fn(result))
  return chain
}

describe('donationStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveDonation', () => {
    it('throws when supabase returns an error on insert', async () => {
      const chain = makeQueryChain({})
      ;(chain.single as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: null,
        error: { message: 'insert failed', code: '23505' },
      })
      fromMock.mockReturnValue(chain)

      await expect(
        saveDonation({
          paymentId: 'ORDER_TEST',
          email: 'a@b.com',
          amount: 50,
          type: 'single',
          status: 'completed',
          createdAt: new Date().toISOString(),
        })
      ).rejects.toBeTruthy()
    })

    it('returns mapped donation on success', async () => {
      const chain = makeQueryChain({})
      const row = {
        id: 'uuid-1',
        pagbank_order_id: 'cs_test',
        pagbank_subscription_id: null,
        doador_email: 'a@b.com',
        valor: 50,
        tipo: 'single',
        status: 'completed',
        campaign_id: null,
        campaign_name: null,
        created_at: '2024-01-01T00:00:00Z',
        proximo_pagamento: null,
      }
      ;(chain.single as ReturnType<typeof vi.fn>).mockResolvedValue({ data: row, error: null })
      fromMock.mockReturnValue(chain)

      const result = await saveDonation({
        paymentId: 'ORDER_TEST',
        email: 'a@b.com',
        amount: 50,
        type: 'single',
        status: 'completed',
        createdAt: '2024-01-01T00:00:00Z',
      })
      expect(result.id).toBe('uuid-1')
      expect(result.amount).toBe(50)
      expect(result.type).toBe('single')
    })
  })

  describe('cancelSubscriptionByStripeId', () => {
    it('logs errors for doacoes update failure without throwing', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const donChain = makeQueryChain({ error: { message: 'doacoes fail' }, data: null })
      const subChain = makeQueryChain({ error: null, data: [] })

      let callCount = 0
      fromMock.mockImplementation((table: string) => {
        if (table === 'doacoes') return donChain
        return subChain
      })

      await cancelSubscriptionByStripeId('sub_test')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('doacoes error'),
        expect.anything()
      )
      consoleSpy.mockRestore()
    })

    it('uses status cancelled (not failed) for doacoes', async () => {
      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })
      fromMock.mockReturnValue({ update: updateSpy })

      await cancelSubscriptionByStripeId('sub_abc')
      expect(updateSpy).toHaveBeenCalledWith({ status: 'cancelled' })
    })
  })

  describe('syncSubscriptionStatus', () => {
    it('maps stripe status to db status correctly', async () => {
      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })
      fromMock.mockReturnValue({ update: updateSpy })

      await syncSubscriptionStatus({ id: 'sub_1', status: 'canceled', current_period_end: 1700000000 })
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'cancelled' })
      )
    })

    it('maps past_due to paused', async () => {
      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })
      fromMock.mockReturnValue({ update: updateSpy })

      await syncSubscriptionStatus({ id: 'sub_2', status: 'past_due', current_period_end: 1700000000 })
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'paused' })
      )
    })
  })

  describe('updateDonationStatus', () => {
    it('calls supabase update with correct parameters', async () => {
      const eqFn = vi.fn().mockResolvedValue({ error: null })
      const updateFn = vi.fn().mockReturnValue({ eq: eqFn })
      fromMock.mockReturnValue({ update: updateFn })

      await updateDonationStatus('cs_test', 'failed')
      expect(updateFn).toHaveBeenCalledWith({ status: 'failed' })
      expect(eqFn).toHaveBeenCalledWith('pagbank_order_id', 'cs_test')
    })
  })

  describe('updateDonationStatusBySubscription', () => {
    it('calls supabase update filtered by subscription id', async () => {
      const eqFn = vi.fn().mockResolvedValue({ error: null })
      const updateFn = vi.fn().mockReturnValue({ eq: eqFn })
      fromMock.mockReturnValue({ update: updateFn })

      await updateDonationStatusBySubscription('sub_999', 'failed')
      expect(eqFn).toHaveBeenCalledWith('pagbank_subscription_id', 'sub_999')
    })
  })
})
