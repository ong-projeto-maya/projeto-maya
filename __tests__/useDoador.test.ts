/**
 * Tests for useDoador hook — donor authentication and registration logic.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { useDoador } from '../hooks/useDoador'
import { DoadorProvider } from '../contexts/DoadorContext'

// useDoador is a proxy to useDoadorContext: all the state lives in a single
// provider so that several components share one Supabase session. It therefore
// throws unless it is rendered inside DoadorProvider, which is what this
// wrapper supplies. This file is .ts, so the element is built by hand.
function wrapper({ children }: { children: ReactNode }) {
  return createElement(DoadorProvider, null, children)
}

// ---- mock browser Supabase client ----
let mockClient: Record<string, unknown>

vi.mock('@/lib/supabase', () => ({
  createClient: () => mockClient,
}))

function makeClient({
  authUser = null as { id: string; email?: string } | null,
  signInError = null as { message: string } | null,
  signUpError = null as { message: string } | null,
} = {}) {
  const unsubscribe = vi.fn()
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: authUser }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: authUser },
        error: signInError,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: authUser },
        error: signUpError,
      }),
      signOut: vi.fn().mockResolvedValue({}),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }
}

describe('useDoador', () => {
  beforeEach(() => vi.clearAllMocks())

  it('initializes with isLoading=true, then false after no session', async () => {
    mockClient = makeClient()
    const { result } = renderHook(() => useDoador(), { wrapper })
    expect(result.current.isLoading).toBe(true)
    await act(async () => {})
    expect(result.current.isLoading).toBe(false)
    expect(result.current.doador).toBeNull()
  })

  describe('login()', () => {
    it('returns true on successful sign-in', async () => {
      const client = makeClient({ authUser: { id: 'u1', email: 'donor@test.com' } })
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      let success: string | null | undefined
      await act(async () => {
        success = await result.current.login('donor@test.com', 'pass123')
      })
      expect(success).toBeNull()
      expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'donor@test.com',
        password: 'pass123',
      })
    })

    it('returns false when signInWithPassword returns an error', async () => {
      const client = makeClient({ signInError: { message: 'Invalid login credentials' } })
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      let success: string | null | undefined
      await act(async () => {
        success = await result.current.login('donor@test.com', 'wrongpass')
      })
      expect(success).not.toBeNull()
    })
  })

  describe('register()', () => {
    it('returns null on successful registration', async () => {
      const client = makeClient({ authUser: { id: 'u2', email: 'new@test.com' } })
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      let err: string | null = 'sentinel'
      await act(async () => {
        err = await result.current.register('Test User', 'new@test.com', 'pass123')
      })
      expect(err).toBeNull()
      expect(client.auth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'pass123',
        options: { data: { nome: 'Test User' } },
      })
    })

    it('returns "already registered" message for duplicate email errors', async () => {
      const client = makeClient({
        signUpError: { message: 'User already registered' },
      })
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      let err: string | null = null
      await act(async () => {
        err = await result.current.register('Dup User', 'dup@test.com', 'pass123')
      })
      expect(err).toContain('já está cadastrado')
    })

    it('returns generic error message for other sign-up failures', async () => {
      const client = makeClient({
        signUpError: { message: 'Network error' },
      })
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      let err: string | null = null
      await act(async () => {
        err = await result.current.register('User', 'user@test.com', 'pass')
      })
      expect(err).toContain('Erro ao criar conta')
    })
  })

  describe('logout()', () => {
    it('calls signOut and clears doador state', async () => {
      const client = makeClient()
      mockClient = client
      const { result } = renderHook(() => useDoador(), { wrapper })
      await act(async () => {})

      await act(async () => { await result.current.logout() })
      expect(client.auth.signOut).toHaveBeenCalled()
      expect(result.current.doador).toBeNull()
    })
  })
})
