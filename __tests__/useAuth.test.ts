/**
 * Tests for useAuth hook — admin authentication logic.
 *
 * These run in a jsdom environment so React hooks work correctly.
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

// ---- mock Supabase admin client ----
let mockClient: Record<string, unknown>

vi.mock('@/lib/supabase-admin', () => ({
  createAdminClient: () => mockClient,
}))

function makeClient({
  authUser = null as { id: string } | null,
  adminRow = null as { id: string; username: string; role: string } | null,
} = {}) {
  const unsubscribe = vi.fn()
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: authUser }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: authUser },
        error: authUser ? null : { message: 'Invalid login credentials' },
      }),
      signOut: vi.fn().mockResolvedValue({}),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      // useAuth reads the admin row with .limit(1) and takes rows[0], not
      // .single(), so the mock has to resolve to an array.
      limit: vi.fn().mockResolvedValue({
        data: adminRow ? [adminRow] : [],
        error: null,
      }),
    }),
  }
}

describe('useAuth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts loading=true, sets loading=false after init with no session', async () => {
    mockClient = makeClient()
    const { result } = renderHook(() => useAuth())
    // Initially loading
    expect(result.current.loading).toBe(true)
    // After async init
    await act(async () => {})
    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  describe('login()', () => {
    it('returns false when signInWithPassword fails', async () => {
      const client = makeClient({ authUser: null })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      let success: boolean | undefined
      await act(async () => {
        success = await result.current.login('admin', 'wrong')
      })
      expect(success).toBe(false)
    })

    it('returns false when user is not in admin_users', async () => {
      const user = { id: 'u1' }
      const client = makeClient({ authUser: user, adminRow: null })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      let success: boolean | undefined
      await act(async () => {
        success = await result.current.login('unknown', 'pass')
      })
      expect(success).toBe(false)
      expect(client.auth.signOut).toHaveBeenCalled()
    })

    it('returns false when role is not admin', async () => {
      const user = { id: 'u2' }
      const client = makeClient({
        authUser: user,
        adminRow: { id: 'u2', username: 'viewer', role: 'viewer' },
      })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      let success: boolean | undefined
      await act(async () => {
        success = await result.current.login('viewer', 'pass')
      })
      expect(success).toBe(false)
    })

    it('returns true and sets user when credentials and role are valid', async () => {
      const user = { id: 'u3' }
      const adminRow = { id: 'u3', username: 'admin', role: 'admin' }
      const client = makeClient({ authUser: user, adminRow })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      let success: boolean | undefined
      await act(async () => {
        success = await result.current.login('admin', 'correctpass')
      })
      expect(success).toBe(true)
      expect(result.current.user).toEqual({ username: 'admin', role: 'admin' })
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('uses a real e-mail as typed, without gluing a domain on it', async () => {
      // Conta de admin com e-mail de verdade: é o que faz "esqueci minha senha"
      // funcionar, já que o domínio interno não recebe e-mail nenhum.
      const user = { id: 'u5' }
      const adminRow = { id: 'u5', username: 'eduardo', role: 'admin' }
      const client = makeClient({ authUser: user, adminRow })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      await act(async () => {
        await result.current.login('  Eduardo@Exemplo.com ', 'pass')
      })
      expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'eduardo@exemplo.com',
        password: 'pass',
      })
    })

    it('converts username to admin email format', async () => {
      const user = { id: 'u4' }
      const adminRow = { id: 'u4', username: 'testadmin', role: 'admin' }
      const client = makeClient({ authUser: user, adminRow })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      await act(async () => {
        await result.current.login('TestAdmin', 'pass')
      })
      expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'testadmin@admin.projetomaya.br',
        password: 'pass',
      })
    })
  })

  describe('logout()', () => {
    it('clears user and calls signOut', async () => {
      const user = { id: 'u5' }
      const adminRow = { id: 'u5', username: 'admin', role: 'admin' }
      const client = makeClient({ authUser: user, adminRow })
      client.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: { user }, error: null })
      mockClient = client
      const { result } = renderHook(() => useAuth())
      await act(async () => {})

      // Log in first
      await act(async () => { await result.current.login('admin', 'pass') })
      expect(result.current.isAuthenticated).toBe(true)

      // Now log out
      await act(async () => { await result.current.logout() })
      expect(result.current.user).toBeNull()
      expect(client.auth.signOut).toHaveBeenCalled()
    })
  })
})
