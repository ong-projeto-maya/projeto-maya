'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardList, Search, Mail, Phone, PawPrint, Calendar, Users, X, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createAdminClient } from '@/lib/supabase-admin'

interface Inscricao {
  id: string
  campaign_id: string | null
  campaign_title: string
  nome: string
  email: string
  telefone: string
  cpf: string | null
  endereco: string | null
  nome_pet: string | null
  tipo_pet: string | null
  motivo: string
  created_at: string
}

export default function AdminAdotantesPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createAdminClient(), [])

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCampaign, setFilterCampaign] = useState('all')
  const [selected, setSelected] = useState<Inscricao | null>(null)

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
        .from('camp_registrations')
        .select('*')
        .order('created_at', { ascending: false })
      setInscricoes((data ?? []) as Inscricao[])
      setIsLoading(false)
    }
    fetch()
  }, [isAuthenticated, supabase])

  if (loading || !isAuthenticated) return null

  const campaigns = useMemo(() => {
    const titles = new Set(inscricoes.map(i => i.campaign_title))
    return Array.from(titles).sort()
  }, [inscricoes])

  const filtered = inscricoes.filter(i => {
    const matchSearch = !searchTerm ||
      i.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.nome_pet ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchCampaign = filterCampaign === 'all' || i.campaign_title === filterCampaign
    return matchSearch && matchCampaign
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const whatsappHref = (telefone: string) => {
    const num = telefone.replace(/\D/g, '')
    return `https://wa.me/55${num}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maya-green/10 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-maya-green" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Adotantes</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Inscrições em campanhas de adoção</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className="bg-maya-green/10 text-maya-green text-sm font-semibold px-3 py-1 rounded-full">
              {filtered.length} inscri{filtered.length === 1 ? 'ção' : 'ções'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-maya-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inscricoes.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de inscrições</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-6 h-6 text-maya-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Campanhas com inscrições</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-maya-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-6 h-6 text-maya-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inscricoes.filter(i => i.nome_pet).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Com pet informado</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou pet..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maya-green/40"
            />
          </div>
          <div className="relative">
            <select
              value={filterCampaign}
              onChange={e => setFilterCampaign(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maya-green/40"
            >
              <option value="all">Todas as campanhas</option>
              {campaigns.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maya-green" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma inscrição encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Candidato</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Campanha</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Pet</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr
                      key={i.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 dark:text-white">{i.nome}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{i.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 bg-maya-green/10 text-maya-green text-xs font-medium px-2 py-1 rounded-full">
                          <PawPrint className="w-3 h-3" />
                          {i.campaign_title}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {i.nome_pet ? (
                          <span className="text-gray-700 dark:text-gray-300">
                            {i.nome_pet}{i.tipo_pet ? ` (${i.tipo_pet})` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          {formatDate(i.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(i)}
                            className="p-1.5 rounded-lg bg-maya-blue/10 hover:bg-maya-blue/20 text-maya-blue transition-colors"
                            title="Ver detalhes"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${i.email}`}
                            className="p-1.5 rounded-lg bg-maya-green/10 hover:bg-maya-green/20 text-maya-green transition-colors"
                            title="Enviar email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {i.telefone && (
                            <a
                              href={whatsappHref(i.telefone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-maya-orange/10 hover:bg-maya-orange/20 text-maya-orange transition-colors"
                              title="WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ficha do Candidato</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nome</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selected.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm break-all">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{selected.telefone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CPF</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{selected.cpf || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Endereço</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{selected.endereco || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Campanha</p>
                  <p className="font-medium text-maya-green text-sm">{selected.campaign_title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data da inscrição</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(selected.created_at)}</p>
                </div>
                {selected.nome_pet && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nome do pet</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{selected.nome_pet}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tipo do pet</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{selected.tipo_pet || '—'}</p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Motivo / Apresentação</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-xl p-3">{selected.motivo}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-maya-green text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-maya-green/90 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Enviar Email
                </a>
                {selected.telefone && (
                  <a
                    href={whatsappHref(selected.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-maya-orange text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-maya-orange/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
