'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase'
export interface Donation {
  id: string
  date: string
  amount: number
  type: 'single' | 'monthly'
  status: 'completed' | 'pending' | 'failed'
  receipt?: string
  campaignId?: string
  campaignName?: string
  paymentId?: string
  subscriptionId?: string
  nextBillingDate?: string
}

export interface Subscription {
  id: string
  amount: number
  status: 'active' | 'paused' | 'cancelled'
  nextBillingDate: string
  startDate: string
  paymentMethod: string
}

export interface Doador {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  totalDonated: number
  donationCount: number
  firstDonation: string
  level: 'bronze' | 'silver' | 'gold' | 'diamond'
  animalsHelped: number
  subscription?: Subscription
  donations: Donation[]
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function monthsSince(isoDate: string): number {
  const start = new Date(isoDate)
  const now = new Date()
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
}

function getLevelByDate(firstDonation: string): Doador['level'] {
  const m = monthsSince(firstDonation)
  if (m >= 24) return 'diamond'
  if (m >= 12) return 'gold'
  if (m >= 6)  return 'silver'
  return 'bronze'
}

// ─── context types ────────────────────────────────────────────────────────────

interface DoadorContextValue {
  doador: Doador | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Doador>) => Promise<void>
  addDonation: (data: {
    paymentId: string
    amount: number
    type: 'single' | 'monthly'
    status: 'completed' | 'pending' | 'failed'
    campaignId?: string
    campaignName?: string
    subscriptionId?: string
    nextBillingDate?: string
  }) => Promise<void>
  pauseSubscription: () => Promise<void>
  resumeSubscription: () => Promise<void>
  cancelSubscription: () => Promise<void>
  getLevel: (firstDonation: string) => Doador['level']
  getLevelProgress: (firstDonation: string) => { current: number; next: number; percentage: number }
}

const DoadorContext = createContext<DoadorContextValue | null>(null)

// ─── provider ────────────────────────────────────────────────────────────────

export function DoadorProvider({ children }: { children: React.ReactNode }) {
  const [doador, setDoador] = useState<Doador | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])
  // Prevents concurrent loadDoadorData calls
  const loadingRef = useRef(false)
  // Tracks the user ID for whom data has been successfully loaded
  // Used to skip redundant reloads on TOKEN_REFRESHED / repeated auth events
  const loadedForUserRef = useRef<string | null>(null)

  const loadDoadorData = useCallback(
    async (userId: string, userEmail?: string, userName?: string) => {
      if (loadingRef.current) return
      // Skip reload if data for this exact user is already loaded
      if (loadedForUserRef.current === userId) return
      loadingRef.current = true

      try {
        let { data: profile, error: selectError } = await supabase
          .from('doadores')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (selectError) console.error('[DoadorContext] SELECT profile failed:', selectError)

        // Profile missing — create it (RLS policy allows authenticated users to insert own row)
        if (!profile && userEmail) {
          const nome = userName || userEmail.split('@')[0]
          const { error: insertError } = await supabase
            .from('doadores')
            .insert({ id: userId, email: userEmail, nome })
          if (insertError && insertError.code !== '23505') {
            // 23505 = unique_violation (profile already exists, created by another instance)
            console.error('[DoadorContext] INSERT profile failed:', insertError)
          }
          const { data: created } = await supabase
            .from('doadores')
            .select('*')
            .eq('id', userId)
            .maybeSingle()
          profile = created
        }

        if (!profile) return

        const [{ data: donations }, { data: subscription }] = await Promise.all([
          supabase
            .from('doacoes')
            .select('*')
            .eq('doador_id', userId)
            .order('created_at', { ascending: false }),
          supabase
            .from('assinaturas')
            .select('*')
            .eq('doador_id', userId)
            .in('status', ['active', 'paused'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])

        const mappedDonations: Donation[] = (donations ?? []).map(d => ({
          id: d.id,
          date: (d.created_at ?? '').split('T')[0],
          amount: d.valor,
          type: d.tipo as 'single' | 'monthly',
          status: d.status as 'completed' | 'pending' | 'failed',
          receipt: undefined,
          campaignId: d.campaign_id ?? undefined,
          campaignName: d.campaign_name ?? undefined,
          paymentId: d.pagbank_order_id ?? undefined,
          subscriptionId: d.pagbank_subscription_id ?? undefined,
          nextBillingDate: d.proximo_pagamento ?? undefined,
        }))

        const mappedSubscription: Subscription | undefined = subscription
          ? {
              id: subscription.id,
              amount: subscription.valor,
              status: subscription.status as 'active' | 'paused' | 'cancelled',
              nextBillingDate: subscription.proximo_pagamento ?? '',
              startDate: subscription.data_inicio ?? '',
              paymentMethod: subscription.metodo_pagamento ?? 'Cartão',
            }
          : undefined

        setDoador({
          id: profile.id,
          name: profile.nome,
          email: profile.email,
          phone: profile.telefone ?? undefined,
          cpf: profile.cpf ?? undefined,
          totalDonated: profile.total_doado ?? 0,
          donationCount: profile.contagem_doacoes ?? 0,
          firstDonation: profile.primeira_doacao ?? new Date().toISOString().split('T')[0],
          level: getLevelByDate(profile.primeira_doacao ?? new Date().toISOString().split('T')[0]),
          animalsHelped: profile.animais_ajudados ?? 0,
          subscription: mappedSubscription,
          donations: mappedDonations,
        })
        loadedForUserRef.current = userId
      } finally {
        loadingRef.current = false
      }
    },
    [supabase]
  )

  useEffect(() => {
    let mounted = true

    const safeLoad = async (userId: string, userEmail?: string, userName?: string) => {
      try {
        await loadDoadorData(userId, userEmail, userName)
      } catch (err) {
        console.error('[DoadorContext] loadDoadorData error:', err)
        if (mounted) setDoador(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    const init = async () => {
      try {
        // getSession() reads localStorage without acquiring the auth mutex
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          await safeLoad(
            session.user.id,
            session.user.email ?? undefined,
            session.user.user_metadata?.nome as string | undefined
          )
        }
      } catch (err) {
        console.error('[DoadorContext] init error:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    init()

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      // Deferred to next tick to avoid deadlock: onAuthStateChange fires while
      // getSession() holds the auth mutex. supabase.from() internally calls
      // getSession() again, which would deadlock if not deferred.
      setTimeout(async () => {
        if (!mounted) return
        if (session?.user) {
          // If the user changed (e.g. login with different account), clear cached state
          if (loadedForUserRef.current && loadedForUserRef.current !== session.user.id) {
            loadedForUserRef.current = null
            loadingRef.current = false
            setDoador(null)
          }
          await safeLoad(
            session.user.id,
            session.user.email ?? undefined,
            session.user.user_metadata?.nome as string | undefined
          )
        } else {
          setDoador(null)
          loadedForUserRef.current = null
          if (mounted) setIsLoading(false)
        }
      }, 0)
    })

    return () => {
      mounted = false
      authSub.unsubscribe()
    }
  }, [supabase, loadDoadorData])

  // ─── actions ───────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return null
    const msg = error.message.toLowerCase()
    if (msg.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) return 'Email ou senha inválidos.'
    return 'Erro ao entrar. Tente novamente.'
  }

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome: name } },
    })
    if (!error) return null
    const msg = error.message.toLowerCase()
    if (msg.includes('already registered') || msg.includes('already in use') || msg.includes('already been registered')) {
      return 'Este email já está cadastrado. Tente fazer login.'
    }
    return 'Erro ao criar conta. Verifique os dados e tente novamente.'
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setDoador(null)
      loadedForUserRef.current = null
      loadingRef.current = false
    }
  }

  const updateProfile = async (updates: Partial<Doador>) => {
    if (!doador) return
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.nome = updates.name
    if (updates.phone !== undefined) dbUpdates.telefone = updates.phone
    if (updates.cpf !== undefined) dbUpdates.cpf = updates.cpf
    const { error } = await supabase.from('doadores').update(dbUpdates).eq('id', doador.id)
    if (error) throw error
    setDoador({ ...doador, ...updates })
  }

  const addDonation = async (data: {
    paymentId: string; amount: number; type: 'single' | 'monthly'
    status: 'completed' | 'pending' | 'failed'; campaignId?: string
    campaignName?: string; subscriptionId?: string; nextBillingDate?: string
  }) => {
    if (!doador) return
    await new Promise(resolve => setTimeout(resolve, 1500))
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      loadingRef.current = false
      loadedForUserRef.current = null // force reload to pick up new donation
      await loadDoadorData(session.user.id)
    }
  }

  const pauseSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/pause', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao pausar assinatura')
    setDoador({ ...doador, subscription: { ...doador.subscription, status: 'paused' } })
  }

  const resumeSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/resume', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao reativar assinatura')
    setDoador({ ...doador, subscription: { ...doador.subscription, status: 'active' } })
  }

  const cancelSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao cancelar assinatura')
    setDoador({ ...doador, subscription: { ...doador.subscription, status: 'cancelled' } })
  }

  const getLevel = getLevelByDate

  const getLevelProgress = (firstDonation: string) => {
    const months = monthsSince(firstDonation)
    const tiers = [{ min: 0, max: 6 }, { min: 6, max: 12 }, { min: 12, max: 24 }, { min: 24, max: 48 }]
    for (const tier of tiers) {
      if (months < tier.max) {
        return { current: tier.min, next: tier.max, percentage: Math.round(((months - tier.min) / (tier.max - tier.min)) * 100) }
      }
    }
    return { current: 24, next: 48, percentage: 100 }
  }

  return (
    <DoadorContext.Provider value={{
      doador, isLoading, login, register, logout, updateProfile,
      addDonation, pauseSubscription, resumeSubscription, cancelSubscription,
      getLevel, getLevelProgress,
    }}>
      {children}
    </DoadorContext.Provider>
  )
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useDoadorContext(): DoadorContextValue {
  const ctx = useContext(DoadorContext)
  if (!ctx) throw new Error('useDoadorContext must be used inside <DoadorProvider>')
  return ctx
}
