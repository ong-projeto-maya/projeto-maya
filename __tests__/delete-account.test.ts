/**
 * Tests for DELETE /api/delete-account
 * Verifies authorization, cascade deletion, and Stripe subscription cancellation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'

// ---- mock server-only ----
vi.mock('server-only', () => ({}))

// ---- mock supabase-server ----
let mockSupabase: Record<string, unknown>
vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => mockSupabase,
}))

// ---- mock @/lib/stripe ----
const mockStripeSubscriptionsCancel = vi.fn()
vi.mock('@/lib/stripe', () => ({
  stripe: {
    subscriptions: {
      cancel: mockStripeSubscriptionsCancel,
    },
  },
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}))

function makeRequest(token?: string) {
  return new Request('http://localhost/api/delete-account', {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

function buildSupabase({
  user = { id: 'user-1', email: 'test@example.com' },
  userError = null,
  activeSubs = [] as { stripe_subscription_id: string }[],
  deleteError = null,
}: {
  user?: { id: string; email: string } | null
  userError?: unknown
  activeSubs?: { stripe_subscription_id: string }[]
  deleteError?: unknown
} = {}) {
  const deleteFn = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      in: vi.fn().mockResolvedValue({ data: activeSubs, error: null }),
    }),
  })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: userError,
      }),
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ error: deleteError }),
      },
    },
    from: vi.fn().mockImplementation((table: string) => {
      const deleteChain = {
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: activeSubs, error: null }),
          }),
        }),
      }
      return deleteChain
    }),
  }
}

async function callDeleteAccount(token?: string) {
  vi.resetModules()
  const mod = await import('../app/api/delete-account/route')
  return mod.DELETE(makeRequest(token))
}

describe('DELETE /api/delete-account', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when no Authorization header', async () => {
    mockSupabase = buildSupabase()
    const res = await callDeleteAccount()
    expect(res.status).toBe(401)
  })

  it('returns 401 when token is invalid', async () => {
    mockSupabase = buildSupabase({ user: null, userError: new Error('invalid') })
    const res = await callDeleteAccount('bad-token')
    expect(res.status).toBe(401)
  })

  it('cancels active Stripe subscriptions before deleting account', async () => {
    mockStripeSubscriptionsCancel.mockResolvedValue({})
    mockSupabase = buildSupabase({
      activeSubs: [{ stripe_subscription_id: 'sub_active_1' }],
    })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    expect(mockStripeSubscriptionsCancel).toHaveBeenCalledWith('sub_active_1')
  })

  it('still deletes account even when Stripe cancel throws', async () => {
    mockStripeSubscriptionsCancel.mockRejectedValue(new Error('Stripe error'))
    mockSupabase = buildSupabase({
      activeSubs: [{ stripe_subscription_id: 'sub_fail' }],
    })
    const res = await callDeleteAccount('valid-token')
    // Should proceed with deletion despite Stripe error
    expect(res.status).toBe(200)
  })

  it('returns 500 when auth.admin.deleteUser fails', async () => {
    mockSupabase = buildSupabase({ deleteError: { message: 'delete failed' } })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(500)
  })

  it('returns success when all steps succeed', async () => {
    mockSupabase = buildSupabase()
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
