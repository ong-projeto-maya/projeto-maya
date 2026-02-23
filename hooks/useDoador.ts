'use client'

import { useState, useEffect } from 'react'

export interface Donation {
  id: string
  date: string
  amount: number
  type: 'single' | 'monthly'
  status: 'completed' | 'pending' | 'failed'
  receipt?: string
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

// Mock data - em produção viria do backend/Stripe
const mockDoador: Doador = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  totalDonated: 1250,
  donationCount: 18,
  firstDonation: '2024-01-15',
  level: 'gold',
  animalsHelped: 15,
  subscription: {
    id: 'sub_123',
    amount: 50,
    status: 'active',
    nextBillingDate: '2026-03-15',
    startDate: '2024-01-15',
    paymentMethod: '**** 4242',
  },
  donations: [
    {
      id: 'don_1',
      date: '2026-02-15',
      amount: 50,
      type: 'monthly',
      status: 'completed',
      receipt: '/recibos/don_1.pdf',
    },
    {
      id: 'don_2',
      date: '2026-01-15',
      amount: 50,
      type: 'monthly',
      status: 'completed',
      receipt: '/recibos/don_2.pdf',
    },
    {
      id: 'don_3',
      date: '2025-12-25',
      amount: 100,
      type: 'single',
      status: 'completed',
      receipt: '/recibos/don_3.pdf',
    },
    {
      id: 'don_4',
      date: '2025-12-15',
      amount: 50,
      type: 'monthly',
      status: 'completed',
      receipt: '/recibos/don_4.pdf',
    },
    {
      id: 'don_5',
      date: '2025-11-15',
      amount: 50,
      type: 'monthly',
      status: 'completed',
      receipt: '/recibos/don_5.pdf',
    },
  ],
}

export function useDoador() {
  const [doador, setDoador] = useState<Doador | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há doador logado no localStorage
    const storedDoador = localStorage.getItem('maya_doador')
    if (storedDoador) {
      try {
        const parsed = JSON.parse(storedDoador)
        setDoador(parsed)
      } catch (error) {
        console.error('Error parsing stored doador:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    // Mock login - em produção seria uma chamada à API
    if (email && password.length >= 6) {
      const doadorData = { ...mockDoador, email }
      setDoador(doadorData)
      localStorage.setItem('maya_doador', JSON.stringify(doadorData))
      return true
    }
    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    // Mock registro - em produção seria uma chamada à API
    if (name && email && password.length >= 6) {
      const newDoador: Doador = {
        id: Date.now().toString(),
        name,
        email,
        totalDonated: 0,
        donationCount: 0,
        firstDonation: new Date().toISOString().split('T')[0],
        level: 'bronze',
        animalsHelped: 0,
        donations: [],
      }
      setDoador(newDoador)
      localStorage.setItem('maya_doador', JSON.stringify(newDoador))
      return true
    }
    return false
  }

  const logout = () => {
    setDoador(null)
    localStorage.removeItem('maya_doador')
  }

  const updateProfile = (updates: Partial<Doador>) => {
    if (doador) {
      const updated = { ...doador, ...updates }
      setDoador(updated)
      localStorage.setItem('maya_doador', JSON.stringify(updated))
    }
  }

  const pauseSubscription = () => {
    if (doador?.subscription) {
      const updated = {
        ...doador,
        subscription: { ...doador.subscription, status: 'paused' as const },
      }
      setDoador(updated)
      localStorage.setItem('maya_doador', JSON.stringify(updated))
    }
  }

  const resumeSubscription = () => {
    if (doador?.subscription) {
      const updated = {
        ...doador,
        subscription: { ...doador.subscription, status: 'active' as const },
      }
      setDoador(updated)
      localStorage.setItem('maya_doador', JSON.stringify(updated))
    }
  }

  const cancelSubscription = () => {
    if (doador?.subscription) {
      const updated = {
        ...doador,
        subscription: { ...doador.subscription, status: 'cancelled' as const },
      }
      setDoador(updated)
      localStorage.setItem('maya_doador', JSON.stringify(updated))
    }
  }

  // Calcular nível baseado no total doado
  const getLevel = (totalDonated: number): Doador['level'] => {
    if (totalDonated >= 5000) return 'diamond'
    if (totalDonated >= 2000) return 'gold'
    if (totalDonated >= 500) return 'silver'
    return 'bronze'
  }

  // Calcular progresso para o próximo nível
  const getLevelProgress = (totalDonated: number): { current: number; next: number; percentage: number } => {
    const levels = [
      { name: 'bronze', min: 0, max: 500 },
      { name: 'silver', min: 500, max: 2000 },
      { name: 'gold', min: 2000, max: 5000 },
      { name: 'diamond', min: 5000, max: 10000 },
    ]

    for (const level of levels) {
      if (totalDonated < level.max) {
        const progress = totalDonated - level.min
        const range = level.max - level.min
        const percentage = (progress / range) * 100
        return { current: level.min, next: level.max, percentage: Math.round(percentage) }
      }
    }

    return { current: 5000, next: 10000, percentage: 100 }
  }

  return {
    doador,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getLevel,
    getLevelProgress,
  }
}
