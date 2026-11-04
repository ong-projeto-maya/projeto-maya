/**
 * Tests for subscription management routes: pause, resume, cancel.
 *
 * These routes used to talk to Stripe. They now talk to PagBank
 * (suspendSubscription / activateSubscription / cancelPagBankSubscription),
 * and they only write the new status to Supabase after PagBank accepts the
 * change — a failure there must leave the row alone and answer 502.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- shared mocks ----
vi.mock('server-only', () => ({}))

let mockSupabase: Record<string, unknown>
vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => mockSupabase,
}))

const mockSuspend = vi.fn()
const mockActivate = vi.fn()
const mockCancel = vi.fn()
vi.mock('@/lib/pagbank', () => ({
  suspendSubscription: mockSuspend,
  activateSubscription: mockActivate,
  cancelPagBankSubscription: mockCancel,
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}))

// ---- builder helpers ----
const updateEqMock = vi.fn()

function makeSupabase(user: { id: string; email: string } | null, sub: Record<string, string> | null) {
  const maybeSingleResult = sub ? { data: sub, error: null } : { data: null, error: null }
  updateEqMock.mockResolvedValue({ data: [], error: null })
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: user ? null : new Error('no user'),
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue(maybeSingleResult),
      update: vi.fn().mockReturnValue({ eq: updateEqMock }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }
}

function makeReq(path: string, token?: string) {
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

const testUser = { id: 'u1', email: 'donor@example.com' }

/**
 * Each route is imported fresh so it picks up the current mockSupabase.
 * The paths are written out one by one because Vite cannot analyse a dynamic
 * import built from a variable.
 */
async function callRoute(route: 'pause' | 'resume' | 'cancel', token?: string) {
  vi.resetModules()
  const mod =
    route === 'pause' ? await import('../app/api/subscription/pause/route') :
    route === 'resume' ? await import('../app/api/subscription/resume/route') :
    await import('../app/api/subscription/cancel/route')
  return mod.POST(makeReq(`/api/subscription/${route}`, token))
}

// ---- PAUSE ----
describe('POST /api/subscription/pause', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('pause')
    expect(res.status).toBe(401)
  })

  it('returns 404 when no active subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('pause', 'valid-token')
    expect(res.status).toBe(404)
  })

  it('suspends the subscription at PagBank and returns success', async () => {
    mockSuspend.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, { id: 'asn-1', pagbank_subscription_id: 'sub_abc' })
    const res = await callRoute('pause', 'valid-token')
    expect(res.status).toBe(200)
    expect(mockSuspend).toHaveBeenCalledWith('sub_abc')
  })

  it('answers 502 and leaves the row untouched when PagBank fails', async () => {
    mockSuspend.mockRejectedValue(new Error('PagBank down'))
    mockSupabase = makeSupabase(testUser, { id: 'asn-1', pagbank_subscription_id: 'sub_abc' })
    const res = await callRoute('pause', 'valid-token')
    expect(res.status).toBe(502)
    expect(updateEqMock).not.toHaveBeenCalled()
  })
})

// ---- RESUME ----
describe('POST /api/subscription/resume', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('resume')
    expect(res.status).toBe(401)
  })

  it('returns 404 when no paused subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('resume', 'valid-token')
    expect(res.status).toBe(404)
  })

  it('reactivates the subscription at PagBank and returns success', async () => {
    mockActivate.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, { id: 'asn-2', pagbank_subscription_id: 'sub_paused' })
    const res = await callRoute('resume', 'valid-token')
    expect(res.status).toBe(200)
    expect(mockActivate).toHaveBeenCalledWith('sub_paused')
  })
})

// ---- CANCEL ----
describe('POST /api/subscription/cancel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('cancel')
    expect(res.status).toBe(401)
  })

  it('returns 404 when no active subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    const res = await callRoute('cancel', 'valid-token')
    expect(res.status).toBe(404)
  })

  it('cancels the subscription at PagBank and returns success', async () => {
    mockCancel.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, { id: 'asn-3', pagbank_subscription_id: 'sub_cancel' })
    const res = await callRoute('cancel', 'valid-token')
    expect(res.status).toBe(200)
    expect(mockCancel).toHaveBeenCalledWith('sub_cancel')
    expect(mockSuspend).not.toHaveBeenCalled()
  })

  it('cancels locally when the row has no PagBank subscription id', async () => {
    mockSupabase = makeSupabase(testUser, { id: 'asn-4', pagbank_subscription_id: '' })
    const res = await callRoute('cancel', 'valid-token')
    expect(res.status).toBe(200)
    expect(mockCancel).not.toHaveBeenCalled()
    expect(updateEqMock).toHaveBeenCalledWith('id', 'asn-4')
  })
})
