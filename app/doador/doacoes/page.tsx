'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Download, ArrowLeft, DollarSign, Calendar, Filter, Search } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

export default function DoacoesHistoricoPage() {
  const { doador, isLoading } = useDoador()
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'single' | 'monthly'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isLoading && !doador) {
      router.push('/doador/login')
    }
  }, [doador, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maya-olive mx-auto mb-4"></div>
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!doador) {
    return null
  }

  const filteredDonations = doador.donations.filter(donation => {
    if (filter !== 'all' && donation.type !== filter) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        donation.id.toLowerCase().includes(searchLower) ||
        donation.date.includes(searchTerm) ||
        donation.amount.toString().includes(searchTerm)
      )
    }
    return true
  })

  const totalFiltered = filteredDonations.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/doador/dashboard"
            className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2">
            Histórico de Doações
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Todas as suas contribuições para o Projeto Maya
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-maya-olive" size={24} />
              <span className="text-sm text-maya-brown/60 dark:text-gray-400">Total Doado</span>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white">
              R$ {doador.totalDonated.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-maya-blue" size={24} />
              <span className="text-sm text-maya-brown/60 dark:text-gray-400">Doações</span>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white">
              {doador.donationCount}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-purple-500" size={24} />
              <span className="text-sm text-maya-brown/60 dark:text-gray-400">Média por Doação</span>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white">
              R$ {Math.round(doador.totalDonated / doador.donationCount)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por ID, data ou valor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive dark:focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-maya-olive text-white'
                    : 'bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('single')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'single'
                    ? 'bg-maya-olive text-white'
                    : 'bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30'
                }`}
              >
                Únicas
              </button>
              <button
                onClick={() => setFilter('monthly')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'monthly'
                    ? 'bg-maya-olive text-white'
                    : 'bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30'
                }`}
              >
                Mensais
              </button>
            </div>
          </div>

          {filteredDonations.length > 0 && (
            <div className="mt-4 text-sm text-maya-brown/60 dark:text-gray-400">
              {filteredDonations.length} {filteredDonations.length === 1 ? 'doação encontrada' : 'doações encontradas'} • Total: R$ {totalFiltered.toLocaleString('pt-BR')}
            </div>
          )}
        </div>

        {/* Donations Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-maya-beige dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Recibo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-maya-beige/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-maya-brown dark:text-white">
                      {new Date(donation.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        donation.type === 'monthly'
                          ? 'bg-maya-blue/20 text-maya-blue dark:bg-maya-blue/30'
                          : 'bg-maya-olive/20 text-maya-olive dark:bg-maya-olive/30'
                      }`}>
                        {donation.type === 'monthly' ? 'Mensal' : 'Única'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                      R$ {donation.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        donation.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : donation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {donation.status === 'completed' ? 'Concluída' :
                         donation.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {donation.receipt && (
                        <button className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light transition-colors">
                          <Download size={18} />
                          <span className="text-sm font-medium">Baixar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-maya-brown/70 dark:text-gray-400">
                Nenhuma doação encontrada com os filtros aplicados
              </p>
            </div>
          )}
        </div>

        {/* Download All */}
        {filteredDonations.length > 0 && (
          <div className="mt-6 text-center">
            <button className="btn-outline inline-flex items-center gap-2">
              <Download size={20} />
              Baixar Relatório Completo (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
