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
      // getUser() verifies the JWT server-side; never trust getSession() for auth checks
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const adminUser = await resolveAdminUser(user.id)
        if (mounted) setUser(adminUser)
      }
      if (mounted) setLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const adminUser = await resolveAdminUser(session.user.id)
        if (!adminUser) {
          // Signed-in user is not an admin — sign them out silently
          await supabase.auth.signOut()
          if (mounted) setUser(null)
        } else {
          if (mounted) setUser(adminUser)
        }
      } else {
        if (mounted) setUser(null)
      }
      if (mounted) setLoading(false)
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
