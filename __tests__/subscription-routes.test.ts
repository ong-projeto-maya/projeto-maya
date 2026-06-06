/**
 * Tests for subscription management routes: pause, resume, cancel.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- shared mocks ----
vi.mock('server-only', () => ({}))

let mockSupabase: Record<string, unknown>
vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => mockSupabase,
}))

const mockStripeUpdate = vi.fn()
const mockStripeCancel = vi.fn()
vi.mock('@/lib/stripe', () => ({
  stripe: {
    subscriptions: {
      update: mockStripeUpdate,
      cancel: mockStripeCancel,
    },
  },
}))
vi.mock('@/lib/logger', () => ({
  createRouteLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}))

// ---- builder helpers ----
function makeSupabase(user: { id: string; email: string } | null, sub: Record<string, string> | null) {
  const maybeSingleResult = sub ? { data: sub, error: null } : { data: null, error: null }
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
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
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

// ---- PAUSE ----
describe('POST /api/subscription/pause', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/pause/route')
    const res = await POST(makeReq('/api/subscription/pause'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when no active subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/pause/route')
    const res = await POST(makeReq('/api/subscription/pause', 'valid-token'))
    expect(res.status).toBe(404)
  })

  it('pauses subscription and returns success', async () => {
    mockStripeUpdate.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, {
      id: 'asn-1',
      pagbank_subscription_id: 'sub_abc',
    })
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/pause/route')
    const res = await POST(makeReq('/api/subscription/pause', 'valid-token'))
    expect(res.status).toBe(200)
    expect(mockStripeUpdate).toHaveBeenCalledWith(
      'sub_abc',
      expect.objectContaining({ pause_collection: { behavior: 'void' } }),
      expect.objectContaining({ idempotencyKey: expect.any(String) })
    )
  })
})

// ---- RESUME ----
describe('POST /api/subscription/resume', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/resume/route')
    const res = await POST(makeReq('/api/subscription/resume'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when no paused subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/resume/route')
    const res = await POST(makeReq('/api/subscription/resume', 'valid-token'))
    expect(res.status).toBe(404)
  })

  it('resumes subscription with pause_collection null', async () => {
    mockStripeUpdate.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, {
      id: 'asn-2',
      pagbank_subscription_id: 'sub_paused',
    })
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/resume/route')
    const res = await POST(makeReq('/api/subscription/resume', 'valid-token'))
    expect(res.status).toBe(200)
    expect(mockStripeUpdate).toHaveBeenCalledWith(
      'sub_paused',
      expect.objectContaining({ pause_collection: null }),
      expect.objectContaining({ idempotencyKey: expect.any(String) })
    )
  })
})

// ---- CANCEL ----
describe('POST /api/subscription/cancel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 without auth', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/cancel/route')
    const res = await POST(makeReq('/api/subscription/cancel'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when no active subscription found', async () => {
    mockSupabase = makeSupabase(testUser, null)
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/cancel/route')
    const res = await POST(makeReq('/api/subscription/cancel', 'valid-token'))
    expect(res.status).toBe(404)
  })

  it('cancels at period end (not immediately)', async () => {
    mockStripeUpdate.mockResolvedValue({})
    mockSupabase = makeSupabase(testUser, {
      id: 'asn-3',
      pagbank_subscription_id: 'sub_cancel',
    })
    vi.resetModules()
    const { POST } = await import('../app/api/subscription/cancel/route')
    const res = await POST(makeReq('/api/subscription/cancel', 'valid-token'))
    expect(res.status).toBe(200)
    // Should use cancel_at_period_end (graceful) not stripe.subscriptions.cancel (immediate)
    expect(mockStripeUpdate).toHaveBeenCalledWith(
      'sub_cancel',
      expect.objectContaining({ cancel_at_period_end: true }),
      expect.objectContaining({ idempotencyKey: expect.any(String) })
    )
    expect(mockStripeCancel).not.toHaveBeenCalled()
  })
})
