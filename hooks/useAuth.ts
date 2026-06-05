'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createAdminClient } from '@/lib/supabase-admin'

interface User {
  username: string
  role: 'admin'
}

// Admin accounts live in Supabase Auth with email: <username>@admin.projetomaya.br
// See supabase/schema.sql for setup instructions.
const usernameToEmail = (username: string) =>
  `${username.toLowerCase()}@admin.projetomaya.br`

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createAdminClient(), [])

  const resolveAdminUser = useCallback(async (userId: string): Promise<User | null> => {
    const { data } = await supabase
      .from('admin_users')
      .select('id, username, role')
      .eq('id', userId)
      .single()
    if (!data || data.role !== 'admin') return null
    return { username: data.username, role: 'admin' }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        // getUser() verifies the JWT server-side; never trust getSession() for auth checks
        // 5s timeout prevents infinite loading when Supabase is unreachable
        let resolved = false
        const timeoutId = setTimeout(() => {
          if (!resolved && mounted) setLoading(false)
        }, 5000)
        const { data: { user } } = await supabase.auth.getUser()
        resolved = true
        clearTimeout(timeoutId)
        if (user) {
          const adminUser = await resolveAdminUser(user.id)
          if (mounted) setUser(adminUser)
        }
      } catch {
        // Network error or misconfigured Supabase — treat as unauthenticated
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // IMPORTANT: Do NOT use await inside onAuthStateChange — Supabase JS SDK v2
      // holds an internal lock during this callback. Awaiting async DB operations
      // here causes a deadlock that blocks subsequent auth calls (e.g., login()).
      // Fire-and-forget pattern: resolve outside the callback.
      if (session?.user) {
        const userId = session.user.id
        resolveAdminUser(userId).then(adminUser => {
          if (!adminUser) {
            // Do NOT call supabase.auth.signOut() here — this event may have been
            // triggered by a donor session (different storageKey). Signing out here
            // would destroy the donor's session. Simply mark admin as unauthenticated.
            if (mounted) setUser(null)
          } else {
            if (mounted) setUser(adminUser)
          }
          if (mounted) setLoading(false)
        })
      } else {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, resolveAdminUser])

  const login = async (username: string, password: string): Promise<boolean> => {
    const email = usernameToEmail(username)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) return false

    const adminUser = await resolveAdminUser(data.user.id)
    if (!adminUser) {
      await supabase.auth.signOut()
      return false
    }

    setUser(adminUser)
    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
