'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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

export function useDoador() {
  const [doador, setDoador] = useState<Doador | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const loadDoadorData = useCallback(
    async (userId: string, accessToken?: string) => {
      let { data: profile } = await supabase
        .from('doadores')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      // Profile missing — auto-create via server route (uses service role)
      if (!profile && accessToken) {
        try {
          await fetch('/api/donors/ensure-profile', {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          // Re-fetch after creation
          const { data: created } = await supabase
            .from('doadores')
            .select('*')
            .eq('id', userId)
            .maybeSingle()
          profile = created
        } catch {
          // silently ignore — user will see empty state
        }
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
    },
    [supabase]
  )

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user && mounted) {
        const { data: { session } } = await supabase.auth.getSession()
        await loadDoadorData(user.id, session?.access_token ?? undefined)
      }
      if (mounted) setIsLoading(false)
    }

    init()

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadDoadorData(session.user.id, session.access_token)
      } else {
        setDoador(null)
      }
      if (mounted) setIsLoading(false)
    })

    return () => {
      mounted = false
      authSub.unsubscribe()
    }
  }, [supabase, loadDoadorData])

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return null
    const msg = error.message.toLowerCase()
    if (msg.includes('email not confirmed')) {
      return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
    }
    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
      return 'Email ou senha inválidos.'
    }
    return 'Erro ao entrar. Tente novamente.'
  }

  /**
   * Returns null on success, or an error string on failure.
   * Distinguishes "email already registered" from generic errors.
   */
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<string | null> => {
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

  const pauseSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { user } } = await supabase.auth.getUser()
    const session = (await supabase.auth.getSession()).data.session
    if (!user || !session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/pause', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao pausar assinatura')
    setDoador({
      ...doador,
      subscription: { ...doador.subscription, status: 'paused' },
    })
  }

  const resumeSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { user } } = await supabase.auth.getUser()
    const session = (await supabase.auth.getSession()).data.session
    if (!user || !session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/resume', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao reativar assinatura')
    setDoador({
      ...doador,
      subscription: { ...doador.subscription, status: 'active' },
    })
  }

  const cancelSubscription = async () => {
    if (!doador?.subscription) return
    const { data: { user } } = await supabase.auth.getUser()
    const session = (await supabase.auth.getSession()).data.session
    if (!user || !session) throw new Error('Sessão expirada')
    const res = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Erro ao cancelar assinatura')
    setDoador({
      ...doador,
      subscription: { ...doador.subscription, status: 'cancelled' },
    })
  }

  // After a successful payment, the webhook writes to the DB.
  // This function waits briefly then reloads the donor data so
  // the success page reflects the new donation immediately.
  const addDonation = async (data: {
    paymentId: string
    amount: number
    type: 'single' | 'monthly'
    status: 'completed' | 'pending' | 'failed'
    campaignId?: string
    campaignName?: string
    subscriptionId?: string
    nextBillingDate?: string
  }) => {
    if (!doador) return
    // Give the webhook a moment to persist the record
    await new Promise(resolve => setTimeout(resolve, 1500))
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      await loadDoadorData(session.user.id)
    }
  }

  // Pure helpers — no DB needed

  /** Months elapsed since a given ISO date string */
  const monthsSince = (isoDate: string): number => {
    const start = new Date(isoDate)
    const now = new Date()
    return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  }

  /**
   * Level by membership duration:
   *  Bronze  — 0–5 months
   *  Prata   — 6–11 months
   *  Ouro    — 12–23 months
   *  Diamante — 24+ months
   */
  const getLevelByDate = (firstDonation: string): Doador['level'] => {
    const months = monthsSince(firstDonation)
    if (months >= 24) return 'diamond'
    if (months >= 12) return 'gold'
    if (months >= 6)  return 'silver'
    return 'bronze'
  }

  const getLevel = getLevelByDate

  const getLevelProgress = (
    firstDonation: string
  ): { current: number; next: number; percentage: number } => {
    const months = monthsSince(firstDonation)
    const tiers = [
      { min: 0, max: 6 },
      { min: 6, max: 12 },
      { min: 12, max: 24 },
      { min: 24, max: 48 },
    ]
    for (const tier of tiers) {
      if (months < tier.max) {
        const percentage = ((months - tier.min) / (tier.max - tier.min)) * 100
        return { current: tier.min, next: tier.max, percentage: Math.round(percentage) }
      }
    }
    return { current: 24, next: 48, percentage: 100 }
  }

  return {
    doador,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addDonation,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getLevel,
    getLevelProgress,
  }
}
