/**
 * Tests for DELETE /api/delete-account
 *
 * Verifies authorization, that the recurring donations are cancelled at
 * PagBank before the rows that identify them are deleted, and the cascade
 * deletion itself (LGPD right to erasure, Art. 18, IV).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- mock server-only ----
vi.mock('server-only', () => ({}))

// ---- mock supabase-server ----
let mockSupabase: Record<string, unknown>
vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => mockSupabase,
}))

// ---- mock PagBank ----
const mockCancelPagBank = vi.fn()
vi.mock('@/lib/pagbank', () => ({
  cancelPagBankSubscription: mockCancelPagBank,
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

/** Records every table the route deleted from, so the cascade can be asserted. */
let deletedFrom: string[] = []

function buildSupabase({
  user = { id: 'user-1', email: 'test@example.com' } as { id: string; email: string } | null,
  userError = null as unknown,
  activeSubs = [] as { pagbank_subscription_id: string }[],
  deleteError = null as unknown,
} = {}) {
  deletedFrom = []

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: userError }),
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ error: deleteError }),
      },
    },
    from: vi.fn().mockImplementation((table: string) => ({
      // .select().eq().in() — the lookup of subscriptions still running
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: activeSubs, error: null }),
        }),
      }),
      // .update().eq().in() — mirroring the cancellation locally
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
      delete: vi.fn().mockImplementation(() => {
        deletedFrom.push(table)
        return { eq: vi.fn().mockResolvedValue({ data: [], error: null }) }
      }),
    })),
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

  it('cancels the recurring donation at PagBank before deleting the account', async () => {
    mockCancelPagBank.mockResolvedValue({})
    mockSupabase = buildSupabase({ activeSubs: [{ pagbank_subscription_id: 'sub_active_1' }] })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    expect(mockCancelPagBank).toHaveBeenCalledWith('sub_active_1')
  })

  it('cancels every subscription the donor still has running', async () => {
    mockCancelPagBank.mockResolvedValue({})
    mockSupabase = buildSupabase({
      activeSubs: [
        { pagbank_subscription_id: 'sub_1' },
        { pagbank_subscription_id: 'sub_2' },
      ],
    })
    await callDeleteAccount('valid-token')
    expect(mockCancelPagBank).toHaveBeenCalledTimes(2)
    expect(mockCancelPagBank).toHaveBeenCalledWith('sub_1')
    expect(mockCancelPagBank).toHaveBeenCalledWith('sub_2')
  })

  it('still erases the account when PagBank refuses the cancellation', async () => {
    // The donor asked to be erased; a PagBank outage cannot hold that up.
    mockCancelPagBank.mockRejectedValue(new Error('PagBank error'))
    mockSupabase = buildSupabase({ activeSubs: [{ pagbank_subscription_id: 'sub_fail' }] })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    expect(deletedFrom).toContain('doadores')
  })

  it('calls PagBank for nothing when there is no subscription', async () => {
    mockSupabase = buildSupabase({ activeSubs: [] })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    expect(mockCancelPagBank).not.toHaveBeenCalled()
  })

  it('skips rows with no PagBank subscription id', async () => {
    mockSupabase = buildSupabase({ activeSubs: [{ pagbank_subscription_id: '' }] })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    expect(mockCancelPagBank).not.toHaveBeenCalled()
  })

  it('returns 500 when auth.admin.deleteUser fails', async () => {
    mockSupabase = buildSupabase({ deleteError: { message: 'delete failed' } })
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(500)
  })

  it('returns success and wipes donations, subscriptions and the donor row', async () => {
    mockSupabase = buildSupabase()
    const res = await callDeleteAccount('valid-token')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(deletedFrom).toEqual(expect.arrayContaining(['doacoes', 'assinaturas', 'doadores']))
  })
})
