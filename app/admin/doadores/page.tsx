'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Search, DollarSign, Award, Heart, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createAdminClient } from '@/lib/supabase-admin'

interface Doador {
  id: string
  nome: string
  email: string
  telefone: string | null
  nivel: 'bronze' | 'silver' | 'gold' | 'diamond'
  total_doado: number
  contagem_doacoes: number
  primeira_doacao: string | null
  created_at: string
}

const levelConfig = {
  bronze:  { label: 'Bronze',   bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  silver:  { label: 'Prata',    bg: 'bg-gray-100 dark:bg-gray-700',         text: 'text-gray-600 dark:text-gray-300' },
  gold:    { label: 'Ouro',     bg: 'bg-yellow-100 dark:bg-yellow-900/30',   text: 'text-yellow-600 dark:text-yellow-400' },
  diamond: { label: 'Diamante', bg: 'bg-maya-blue/10 dark:bg-maya-blue/20',  text: 'text-maya-blue dark:text-maya-blue' },
}

export default function AdminDoadoresPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createAdminClient(), [])

  const [doadores, setDoadores] = useState<Doador[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'diamond'>('all')
  const [sortBy, setSortBy] = useState<'total' | 'count' | 'recent'>('total')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (!isAuthenticated) return
    const fetch = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('doadores')
        .select('id, nome, email, telefone, nivel, total_doado, contagem_doacoes, primeira_doacao, created_at')
        .order('total_doado', { ascending: false })
      setDoadores((data ?? []) as Doador[])
      setIsLoading(false)
    }
    fetch()
  }, [isAuthenticated, supabase])

  if (loading || !isAuthenticated) return null

  const filtered = doadores
    .filter(d => {
      const matchSearch = !searchTerm ||
        d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchLevel = filterLevel === 'all' || d.nivel === filterLevel
      return matchSearch && matchLevel
    })
    .sort((a, b) => {
      if (sortBy === 'total') return b.total_doado - a.total_doado
      if (sortBy === 'count') return b.contagem_doacoes - a.contagem_doacoes
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const totalArrecadado = doadores.reduce((s, d) => s + (d.total_doado ?? 0), 0)

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green/80 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-display text-maya-brown dark:text-white mb-2">
            Doadores Cadastrados
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            {doadores.length} doador{doadores.length !== 1 ? 'es' : ''} registrado{doadores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center">
              <Users className="text-maya-green" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-maya-brown dark:text-white">{doadores.length}</p>
              <p className="text-sm text-maya-brown/60 dark:text-gray-400">Total de Doadores</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-maya-orange/10 rounded-xl flex items-center justify-center">
              <DollarSign className="text-maya-orange" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-maya-brown dark:text-white">
                R$ {totalArrecadado.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-maya-brown/60 dark:text-gray-400">Total Arrecadado</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'bronze', 'silver', 'gold', 'diamond'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setFilterLevel(l)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filterLevel === l
                      ? 'bg-maya-green text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l === 'all' ? 'Todos' : levelConfig[l].label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'total' | 'count' | 'recent')}
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white text-sm"
            >
              <option value="total">Ordenar: Maior doação</option>
              <option value="count">Ordenar: Mais doações</option>
              <option value="recent">Ordenar: Mais recente</option>
            </select>
          </div>
          {filtered.length > 0 && (
            <p className="text-sm text-maya-brown/60 dark:text-gray-400 mt-3">
              {filtered.length} doador{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maya-green mx-auto mb-4" />
              <p className="text-maya-brown/60 dark:text-gray-400">Carregando doadores...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-maya-brown/60 dark:text-gray-400">Nenhum doador encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-maya-beige dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Doador</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Nível</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Total Doado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Doações</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Desde</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map(d => {
                    const lv = levelConfig[d.nivel] ?? levelConfig.bronze
                    return (
                      <tr key={d.id} className="hover:bg-maya-beige/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-maya-brown dark:text-white">{d.nome}</p>
                          <p className="text-sm text-maya-brown/60 dark:text-gray-400">{d.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${lv.bg} ${lv.text}`}>
                            <Award size={11} />
                            {lv.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-maya-green">
                            R$ {(d.total_doado ?? 0).toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-maya-brown dark:text-white">
                            <Heart size={14} className="text-maya-pink" />
                            {d.contagem_doacoes ?? 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-maya-brown/70 dark:text-gray-400">
                          {d.primeira_doacao
                            ? new Date(d.primeira_doacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${d.email}`}
                            className="p-2 hover:bg-maya-beige dark:hover:bg-gray-600 rounded-lg transition-colors inline-flex"
                            title={`Enviar e-mail para ${d.nome}`}
                          >
                            <Mail size={16} className="text-maya-brown dark:text-gray-300" />
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
