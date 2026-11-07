'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PawPrint, Heart, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Dog, Cat, LogOut, Target, X, BarChart3, ClipboardList, Mail, Pencil, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { useAnimals } from '@/hooks/useAnimals'
import { useAuth } from '@/hooks/useAuth'
import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import Image from 'next/image'

interface RecentActivity {
  id: string
  type: 'donation' | 'adoption'
  description: string
  sub: string
  created_at: string
}

interface DonacaoRow {
  id: string
  doador_email: string
  valor: number
  tipo: string
  status: string
  created_at: string
  campaign_name: string | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'animals' | 'donations'>('overview')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAnimalId, setDeletingAnimalId] = useState<string | null>(null)
  const [deletingAnimalName, setDeletingAnimalName] = useState('')
  const [dbStats, setDbStats] = useState({ rescued: 0, adopted: 0, volunteers: 0, monthlyGoal: 0 })
  const [currentDonations, setCurrentDonations] = useState(0)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [recentDonations, setRecentDonations] = useState<DonacaoRow[]>([])
  const [editingStats, setEditingStats] = useState(false)
  const [statsForm, setStatsForm] = useState<Record<string, number>>({})
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsSaved, setStatsSaved] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)
  const stats = { ...dbStats, currentDonations }
  const router = useRouter()
  const { user, loading, isAuthenticated, logout } = useAuth()
  const { animals, deleteAnimal } = useAnimals()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Load real donation total from Supabase
    const supabase = createAdminClient()
    supabase
      .from('doacoes')
      .select('valor')
      .eq('status', 'completed')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const total = data.reduce((sum, row) => sum + (row.valor ?? 0), 0)
          setCurrentDonations(total)
        }
      })
    // Load site stats from Supabase
    supabase
      .from('site_stats')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, number> = {}
          data.forEach(r => { map[r.key] = r.value })
          setDbStats({
            rescued: map['rescued'] ?? 0,
            adopted: map['adopted'] ?? 0,
            volunteers: map['volunteers'] ?? 0,
            monthlyGoal: map['monthly_goal'] ?? 0,
          })
          setStatsForm(map)
        }
      })
    // Load recent activities: latest 3 donations + recently adopted animals
    Promise.all([
      supabase.from('doacoes').select('id, doador_email, valor, tipo, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('animais').select('id, name, updated_at').eq('is_adopted', true).order('updated_at', { ascending: false }).limit(2),
    ]).then(([{ data: donations }, { data: adopted }]) => {
      const activities: RecentActivity[] = []
      for (const d of donations ?? []) {
        activities.push({
          id: `d-${d.id}`,
          type: 'donation',
          description: `Doação de R$ ${(d.valor ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          sub: `${d.tipo === 'monthly' ? 'Mensal' : 'Única'} · ${d.doador_email}`,
          created_at: d.created_at,
        })
      }
      for (const a of adopted ?? []) {
        activities.push({
          id: `a-${a.id}`,
          type: 'adoption',
          description: `${a.name} foi adotado(a)`,
          sub: 'Adoção confirmada',
          created_at: a.updated_at,
        })
      }
      activities.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())
      setRecentActivity(activities.slice(0, 4))
    })
    // Load recent donations for donations tab
    supabase
      .from('doacoes')
      .select('id, doador_email, valor, tipo, status, created_at, campaign_name')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setRecentDonations(data as DonacaoRow[])
      })
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const handleSaveStats = async () => {
    setStatsSaving(true)
    const supabase = createAdminClient()
    const rows = Object.entries(statsForm).map(([key, value]) => ({ key, value: Number(value) }))
    await supabase.from('site_stats').upsert(rows, { onConflict: 'key' })
    setDbStats({
      rescued: statsForm['rescued'] ?? 0,
      adopted: statsForm['adopted'] ?? 0,
      volunteers: statsForm['volunteers'] ?? 0,
      monthlyGoal: statsForm['monthly_goal'] ?? 0,
    })
    setStatsSaving(false)
    setStatsSaved(true)
    setEditingStats(false)
    setTimeout(() => setStatsSaved(false), 3000)
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-12 h-12 text-maya-green mx-auto mb-4 animate-pulse" />
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderizar se não autenticado (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      {/* Delete Animal Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-maya-brown dark:text-white">Excluir Animal</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-maya-brown/40 hover:text-maya-brown dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-6">Tem certeza que deseja excluir <strong>{deletingAnimalName}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => { if (deletingAnimalId) deleteAnimal(deletingAnimalId); setShowDeleteModal(false); setDeletingAnimalId(null) }}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-maya-brown dark:text-white">Sair da conta</h3>
              <button onClick={() => setShowLogoutModal(false)} className="text-maya-brown/40 hover:text-maya-brown dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-6">Tem certeza que deseja sair do painel administrativo?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button onClick={handleLogout} className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image 
              src="/logo.png" 
              alt="Projeto Maya" 
              width={1200}
              height={446}
              className="h-16 w-auto hidden sm:block"
            />
            <div>
              <h1 className="text-4xl font-display text-maya-brown dark:text-white mb-2">
                Dashboard Administrativo
              </h1>
              <p className="text-maya-brown/60 dark:text-gray-400">
                Gerencie animais, doações e estatísticas do Projeto Maya
              </p>
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-maya-brown dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-maya-brown/60 dark:text-gray-400">
                Administrador
              </p>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-maya-green" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.rescued}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Animais Resgatados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-maya-green" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.adopted}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Adoções Realizadas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-maya-blue" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.volunteers}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Voluntários Ativos</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-maya-blue" />
              </div>
              <span className="text-xs font-semibold text-maya-green bg-maya-green/10 px-2 py-1 rounded-full">
                {stats.monthlyGoal > 0 ? Math.round((stats.currentDonations / stats.monthlyGoal) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              R$ {stats.currentDonations.toLocaleString()}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Meta: R$ {stats.monthlyGoal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-maya-green border-b-2 border-maya-green'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-green'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('animals')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'animals'
                  ? 'text-maya-green border-b-2 border-maya-green'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-green'
              }`}
            >
              Animais
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'donations'
                  ? 'text-maya-green border-b-2 border-maya-green'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-green'
              }`}
            >
              Doações
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4">
                Atividades Recentes
              </h2>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-maya-brown/50 dark:text-gray-500 text-sm text-center py-4">Nenhuma atividade recente.</p>
                ) : recentActivity.map(act => (
                  <div key={act.id} className="flex items-start gap-3 p-3 bg-maya-beige dark:bg-gray-700 rounded-lg">
                    {act.type === 'donation'
                      ? <DollarSign className="w-5 h-5 text-maya-blue mt-0.5 flex-shrink-0" />
                      : <Heart className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-maya-brown dark:text-white truncate">{act.description}</p>
                      <p className="text-xs text-maya-brown/60 dark:text-gray-400 truncate">{act.sub}</p>
                    </div>
                    <span className="text-xs text-maya-brown/40 dark:text-gray-500 flex-shrink-0 ml-auto">
                      {new Date(act.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Link
                  href="/admin/animais"
                  className="p-4 bg-maya-green/10 hover:bg-maya-green/20 rounded-xl transition-colors text-left"
                >
                  <Plus className="w-6 h-6 text-maya-green mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Gerenciar Animais
                  </p>
                </Link>
                <Link
                  href="/admin/campanhas"
                  className="p-4 bg-maya-orange/10 hover:bg-maya-orange/20 rounded-xl transition-colors text-left"
                >
                  <Target className="w-6 h-6 text-maya-orange mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Gerenciar Campanhas
                  </p>
                </Link>
                <Link
                  href="/admin/eventos"
                  className="p-4 bg-maya-blue/10 hover:bg-maya-blue/20 rounded-xl transition-colors text-left"
                >
                  <Edit className="w-6 h-6 text-maya-blue mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Gerenciar Eventos
                  </p>
                </Link>
                {/* O atalho de Voluntários saiu junto com a tela: era um "em breve"
                    prometendo escala, relatório de horas e certificado digital.
                    Volta quando o módulo existir de verdade. */}
                <Link
                  href="/admin/adotantes"
                  className="p-4 bg-maya-blue/10 hover:bg-maya-blue/20 rounded-xl transition-colors text-left"
                >
                  <ClipboardList className="w-6 h-6 text-maya-blue mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Adotantes
                  </p>
                </Link>
                <Link
                  href="/admin/relatorios"
                  className="p-4 bg-maya-green/10 hover:bg-maya-green/20 rounded-xl transition-colors text-left"
                >
                  <BarChart3 className="w-6 h-6 text-maya-green mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Relatórios
                  </p>
                </Link>
                <Link
                  href="/admin/mensagens"
                  className="p-4 bg-maya-pink/10 hover:bg-maya-pink/20 rounded-xl transition-colors text-left"
                >
                  <Mail className="w-6 h-6 text-maya-pink mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Mensagens
                  </p>
                </Link>
                <Link
                  href="/admin/doadores"
                  className="p-4 bg-maya-orange/10 hover:bg-maya-orange/20 rounded-xl transition-colors text-left"
                >
                  <Users className="w-6 h-6 text-maya-orange mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Doadores
                  </p>
                </Link>
                <Link
                  href="/adocao"
                  className="p-4 bg-gray-500/10 hover:bg-gray-500/20 rounded-xl transition-colors text-left"
                >
                  <PawPrint className="w-6 h-6 text-maya-brown/60 dark:text-gray-400 mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Ver Site
                  </p>
                </Link>
              </div>
            </div>

            {/* Site Stats Editor */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setStatsExpanded(v => !v)}
              className="w-full flex items-center justify-between p-6 hover:bg-maya-beige/30 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-maya-green/10 rounded-xl flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-maya-green" />
                </div>
                <div className="text-left">
                  <h2 className="font-display text-xl text-maya-brown dark:text-white">Editar Estatísticas do Site</h2>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400">Contadores exibidos na landing page</p>
                </div>
                {statsSaved && <span className="ml-4 text-xs font-semibold text-maya-green bg-maya-green/10 px-2 py-1 rounded-full">Salvo!</span>}
              </div>
              {statsExpanded ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>

            {statsExpanded && (
              <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { key: 'rescued',       label: 'Animais Resgatados',   icon: '🐾' },
                    { key: 'adopted',       label: 'Adoções Realizadas',   icon: '💚' },
                    { key: 'volunteers',    label: 'Voluntários Ativos',   icon: '👥' },
                    { key: 'monthly_goal',  label: 'Meta Mensal (R$)',      icon: '🎯' },
                    { key: 'total_donors',  label: 'Total de Doadores',    icon: '❤️' },
                    { key: 'total_raised',  label: 'Total Arrecadado (R$)', icon: '💰' },
                    { key: 'animals_helped',label: 'Animais Impactados',   icon: '🐶' },
                  ].map(stat => (
                    <div key={stat.key} className="bg-maya-beige dark:bg-gray-700/50 rounded-xl p-4">
                      <label className="block text-xs font-semibold text-maya-brown/70 dark:text-gray-400 mb-1.5">
                        {stat.icon} {stat.label}
                      </label>
                      {editingStats ? (
                        <input
                          type="number"
                          min="0"
                          value={statsForm[stat.key] ?? 0}
                          onChange={e => setStatsForm(prev => ({ ...prev, [stat.key]: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border-2 border-maya-green/50 focus:border-maya-green rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white font-bold text-lg"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-maya-brown dark:text-white">
                          {(statsForm[stat.key] ?? 0).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {editingStats ? (
                    <>
                      <button
                        onClick={handleSaveStats}
                        disabled={statsSaving}
                        className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        <Save size={18} />
                        {statsSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button
                        onClick={() => setEditingStats(false)}
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingStats(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-maya-green/10 hover:bg-maya-green/20 text-maya-green rounded-xl font-semibold transition-colors"
                    >
                      <Pencil size={16} />
                      Editar Valores
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'animals' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white">
                Gerenciar Animais
              </h2>
              <Link
                href="/admin/animais"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Ir para Gerenciamento
              </Link>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Idade</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal) => (
                      <tr key={animal.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-maya-beige/50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={animal.image} alt={animal.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-semibold text-maya-brown dark:text-white">{animal.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-maya-brown/70 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            {animal.type === 'dog' ? (
                              <>
                                <Dog size={16} />
                                Cão
                              </>
                            ) : (
                              <>
                                <Cat size={16} />
                                Gato
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-maya-brown/70 dark:text-gray-300">{animal.age}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            animal.isAdopted
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-maya-green/10 text-maya-green'
                          }`}>
                            {animal.isAdopted ? 'Adotado' : 'Disponível'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push('/admin/animais')}
                              className="p-2 hover:bg-maya-beige dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Editar no gerenciamento"
                            >
                              <Edit size={16} className="text-maya-brown dark:text-gray-300" />
                            </button>
                            <button
                              onClick={() => { setDeletingAnimalId(animal.id); setDeletingAnimalName(animal.name); setShowDeleteModal(true) }}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Excluir animal"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-6">
              Relatório de Doações
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-maya-brown dark:text-white">Meta Mensal</span>
                <span className="text-maya-green font-bold">
                  {Math.round((stats.currentDonations / (stats.monthlyGoal || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-maya-green to-maya-blue h-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.currentDonations / (stats.monthlyGoal || 1)) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2 text-maya-brown/60 dark:text-gray-400">
                <span>R$ {stats.currentDonations.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span>R$ {stats.monthlyGoal.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Donations Table */}
            {recentDonations.length === 0 ? (
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-6 text-center">
                <DollarSign className="w-12 h-12 text-maya-green mx-auto mb-3" />
                <p className="text-maya-brown/70 dark:text-gray-300">
                  Nenhuma doação registrada ainda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Doador</th>
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Campanha</th>
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Valor</th>
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Tipo</th>
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Status</th>
                      <th className="text-left py-3 px-3 font-semibold text-maya-brown dark:text-white">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDonations.map(d => (
                      <tr key={d.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-maya-beige/50 dark:hover:bg-gray-700">
                        <td className="py-3 px-3 text-maya-brown dark:text-white truncate max-w-[160px]">{d.doador_email}</td>
                        <td className="py-3 px-3 text-maya-brown/70 dark:text-gray-300">{d.campaign_name ?? '—'}</td>
                        <td className="py-3 px-3 font-semibold text-maya-green">R$ {(d.valor ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-maya-brown/70 dark:text-gray-300">{d.tipo === 'monthly' ? 'Mensal' : 'Única'}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            d.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : d.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {d.status === 'completed' ? 'Confirmada' : d.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-maya-brown/60 dark:text-gray-400">
                          {new Date(d.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
