'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BarChart3, DollarSign, PawPrint, Users, Heart, TrendingUp, Dog, Cat, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createAdminClient } from '@/lib/supabase-admin'

interface DoacaoRow {
  valor: number
  tipo: string
  status: string
  created_at: string
}

interface AnimalRow {
  type: string
  is_adopted: boolean
}

interface CampanhaRow {
  title: string
  goal: number
  raised: number
  is_active: boolean
}

interface Stats {
  totalArrecadado: number
  totalDoadores: number
  totalAnimais: number
  animaisAdotados: number
  totalCampanhas: number
  campanhasAtivas: number
  inscricoes: number
  mensagensNovas: number
  doacoesPorMes: { mes: string; valor: number }[]
  doacoesSingle: number
  doacoesMonthly: number
  caoCount: number
  gatoCount: number
  campanhas: CampanhaRow[]
}

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function AdminRelatoriosPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createAdminClient(), [])

  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  const loadStats = async () => {
    setIsLoading(true)
    const [doacoesRes, doadoresRes, animaisRes, campanhasRes, inscricoesRes, mensagensRes] = await Promise.all([
      supabase.from('doacoes').select('valor, tipo, status, created_at'),
      supabase.from('doadores').select('id', { count: 'exact', head: true }),
      supabase.from('animais').select('type, is_adopted'),
      supabase.from('campanhas').select('title, goal, raised, is_active').order('raised', { ascending: false }),
      supabase.from('camp_registrations').select('id', { count: 'exact', head: true }),
      supabase.from('mensagens').select('id', { count: 'exact', head: true }).eq('lida', false),
    ])

    const doacoes: DoacaoRow[] = (doacoesRes.data ?? []) as DoacaoRow[]
    const animais: AnimalRow[] = (animaisRes.data ?? []) as AnimalRow[]
    const campanhas: CampanhaRow[] = (campanhasRes.data ?? []) as CampanhaRow[]

    const completed = doacoes.filter(d => d.status === 'completed')
    const totalArrecadado = completed.reduce((s, d) => s + d.valor, 0)

    // Last 6 months
    const now = new Date()
    const doacoesPorMes = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const valor = completed
        .filter(x => x.created_at.startsWith(key))
        .reduce((s, x) => s + x.valor, 0)
      return { mes: MONTHS_PT[d.getMonth()], valor }
    })

    setStats({
      totalArrecadado,
      totalDoadores: doadoresRes.count ?? 0,
      totalAnimais: animais.length,
      animaisAdotados: animais.filter(a => a.is_adopted).length,
      totalCampanhas: campanhas.length,
      campanhasAtivas: campanhas.filter(c => c.is_active).length,
      inscricoes: inscricoesRes.count ?? 0,
      mensagensNovas: mensagensRes.count ?? 0,
      doacoesPorMes,
      doacoesSingle: completed.filter(d => d.tipo === 'single').length,
      doacoesMonthly: completed.filter(d => d.tipo === 'monthly').length,
      caoCount: animais.filter(a => a.type === 'dog').length,
      gatoCount: animais.filter(a => a.type === 'cat').length,
      campanhas: campanhas.slice(0, 5),
    })
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) loadStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  if (loading || !isAuthenticated) return null

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const maxMonthVal = stats ? Math.max(...stats.doacoesPorMes.map(m => m.valor), 1) : 1

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maya-blue/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-maya-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Carregando dados...'}
              </p>
            </div>
          </div>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-maya-blue/10 text-maya-blue text-sm font-semibold hover:bg-maya-blue/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {isLoading && !stats ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maya-blue" />
        </div>
      ) : stats && (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-maya-green/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-maya-green" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Arrecadado</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(stats.totalArrecadado)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-maya-orange/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-maya-orange" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Doadores</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDoadores}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-maya-blue/10 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-maya-blue" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Animais Adotados</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.animaisAdotados}
                <span className="text-sm font-normal text-gray-400 ml-1">/ {stats.totalAnimais}</span>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-maya-pink/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-maya-pink" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inscrições Adoção</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inscricoes}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly donations bar chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-maya-green" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Arrecadação — Últimos 6 Meses</h2>
              </div>
              <div className="flex items-end justify-between gap-2 h-40">
                {stats.doacoesPorMes.map((m, idx) => {
                  const pct = maxMonthVal > 0 ? (m.valor / maxMonthVal) * 100 : 0
                  const isLast = idx === stats.doacoesPorMes.length - 1
                  return (
                    <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {m.valor > 0 ? fmt(m.valor).replace('R$\u00a0', 'R$') : '—'}
                      </span>
                      <div className="w-full flex items-end h-24">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${isLast ? 'bg-maya-green' : 'bg-maya-green/40 dark:bg-maya-green/30'}`}
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{m.mes}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Donation type breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-maya-blue" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Distribuição</h2>
              </div>

              {/* Donation type */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Tipo de Doação</p>
                {[
                  { label: 'Única', value: stats.doacoesSingle, color: 'bg-maya-green' },
                  { label: 'Mensal', value: stats.doacoesMonthly, color: 'bg-maya-blue' },
                ].map(item => {
                  const total = stats.doacoesSingle + stats.doacoesMonthly || 1
                  return (
                    <div key={item.label} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.value / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Animals type */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Animais por Espécie</p>
                {[
                  { label: 'Cães', value: stats.caoCount, color: 'bg-maya-orange', icon: Dog },
                  { label: 'Gatos', value: stats.gatoCount, color: 'bg-maya-pink', icon: Cat },
                ].map(item => {
                  const total = stats.caoCount + stats.gatoCount || 1
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <Icon className="w-3.5 h-3.5" />{item.label}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.value / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Animals status */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Status dos Animais</p>
                {[
                  { label: 'Disponíveis', value: stats.totalAnimais - stats.animaisAdotados, color: 'bg-maya-green' },
                  { label: 'Adotados', value: stats.animaisAdotados, color: 'bg-maya-brown' },
                ].map(item => {
                  const total = stats.totalAnimais || 1
                  return (
                    <div key={item.label} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.value / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="w-5 h-5 text-maya-pink" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Desempenho das Campanhas</h2>
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{stats.campanhasAtivas} ativas de {stats.totalCampanhas}</span>
            </div>
            {stats.campanhas.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">Nenhuma campanha cadastrada</p>
            ) : (
              <div className="space-y-4">
                {stats.campanhas.map(c => {
                  const pct = c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0
                  return (
                    <div key={c.title}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate mr-4">{c.title}</span>
                        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                          {fmt(c.raised)} / {fmt(c.goal)} <span className="font-semibold text-maya-green">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-maya-green to-maya-blue h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: '/admin/doadores', label: 'Ver Doadores', icon: Users, color: 'maya-orange' },
              { href: '/admin/animais', label: 'Gerenciar Animais', icon: PawPrint, color: 'maya-blue' },
              { href: '/admin/campanhas', label: 'Campanhas', icon: Heart, color: 'maya-pink' },
              { href: '/admin/mensagens', label: `Mensagens${stats.mensagensNovas > 0 ? ` (${stats.mensagensNovas})` : ''}`, icon: BarChart3, color: 'maya-green' },
            ].map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex items-center gap-3"
                >
                  <div className={`w-9 h-9 bg-${item.color}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 text-${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

