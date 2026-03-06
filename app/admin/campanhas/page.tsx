'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Target,
  Home,
  Users as UsersIcon
} from 'lucide-react'
import { campaigns, getCampaignProgress, getCampaignDaysLeft } from '@/data/campaigns'

const categoryNames = {
  'saude': 'Saúde',
  'resgate': 'Resgate',
  'infraestrutura': 'Infraestrutura',
  'alimentacao': 'Alimentação'
}

const urgencyColors = {
  'baixa': 'bg-maya-green',
  'media': 'bg-maya-blue',
  'alta': 'bg-maya-orange',
  'urgente': 'bg-maya-pink'
}

const urgencyNames = {
  'baixa': 'Baixa',
  'media': 'Média',
  'alta': 'Alta',
  'urgente': 'Urgente'
}

export default function AdminCampanhasPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Redirect if not authenticated
  if (!loading && !user) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maya-green mx-auto mb-4"></div>
          <p className="text-maya-brown/60">Carregando...</p>
        </div>
      </div>
    )
  }

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedFilter === 'active') return campaign.isActive
    if (selectedFilter === 'inactive') return !campaign.isActive
    return true
  })

  // Statistics
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.isActive).length
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0)
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0)
  const overallProgress = Math.round((totalRaised / totalGoal) * 100)

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-maya-brown/60 dark:text-gray-400 text-sm mb-2">
              <Link href="/admin" className="hover:text-maya-green transition-colors">
                Admin
              </Link>
              <span>→</span>
              <span>Campanhas</span>
            </div>
            <h1 className="text-4xl font-display text-maya-brown dark:text-white">
              Gerenciar Campanhas
            </h1>
          </div>
          <button
            onClick={() => alert('Funcionalidade de criar campanha será implementada com banco de dados')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Campanha
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-maya-green" />
              <TrendingUp className="w-6 h-6 text-maya-green/40" />
            </div>
            <div className="text-3xl font-display text-maya-brown dark:text-white mb-1">
              {totalCampaigns}
            </div>
            <div className="text-sm text-maya-brown/60 dark:text-gray-400">
              Total de Campanhas
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-10 h-10 text-maya-blue" />
              <TrendingUp className="w-6 h-6 text-maya-blue/40" />
            </div>
            <div className="text-3xl font-display text-maya-brown dark:text-white mb-1">
              {activeCampaigns}
            </div>
            <div className="text-sm text-maya-brown/60 dark:text-gray-400">
              Campanhas Ativas
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-maya-orange" />
              <TrendingUp className="w-6 h-6 text-maya-orange/40" />
            </div>
            <div className="text-3xl font-display text-maya-brown dark:text-white mb-1">
              R$ {totalRaised.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-maya-brown/60 dark:text-gray-400">
              Total Arrecadado
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-maya-green" />
              <TrendingUp className="w-6 h-6 text-maya-green/40" />
            </div>
            <div className="text-3xl font-display text-maya-brown dark:text-white mb-1">
              {overallProgress}%
            </div>
            <div className="text-sm text-maya-brown/60 dark:text-gray-400">
              Progresso Geral
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-maya-brown dark:text-white">
              Filtrar:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-green/10'
                }`}
              >
                Todas ({totalCampaigns})
              </button>
              <button
                onClick={() => setSelectedFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'active'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-green/10'
                }`}
              >
                Ativas ({activeCampaigns})
              </button>
              <button
                onClick={() => setSelectedFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'inactive'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-maya-brown dark:text-white hover:bg-maya-green/10'
                }`}
              >
                Inativas ({totalCampaigns - activeCampaigns})
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-maya-beige dark:bg-gray-900">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Campanha
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Progresso
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Prazo
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-maya-brown dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCampaigns.map((campaign) => {
                  const progress = getCampaignProgress(campaign)
                  const daysLeft = getCampaignDaysLeft(campaign)
                  
                  return (
                    <tr key={campaign.id} className="hover:bg-maya-beige/50 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Campaign Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={campaign.image}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-maya-brown dark:text-white mb-1">
                              {campaign.title}
                            </div>
                            <div className="text-sm text-maya-brown/60 dark:text-gray-400">
                              Meta: R$ {campaign.goal.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Urgency */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-maya-brown dark:text-white w-fit">
                            {categoryNames[campaign.category]}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white w-fit ${urgencyColors[campaign.urgency]}`}>
                            {urgencyNames[campaign.urgency]}
                          </span>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-maya-green">
                              {progress}%
                            </span>
                            <span className="text-xs text-maya-brown/60 dark:text-gray-400">
                              R$ {campaign.raised.toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-maya-green to-maya-blue h-full rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-maya-brown/40 dark:text-gray-500" />
                          <span className="text-maya-brown dark:text-white">
                            {daysLeft} dias
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {campaign.isActive ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-maya-green/10 text-maya-green">
                            <CheckCircle size={14} />
                            Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-maya-brown/60 dark:text-gray-400">
                            <AlertCircle size={14} />
                            Inativa
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/campanhas/${campaign.id}`}
                            target="_blank"
                            className="p-2 text-maya-blue hover:bg-maya-blue/10 rounded-lg transition-colors"
                            title="Ver no site"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => alert('Edição será implementada com banco de dados')}
                            className="p-2 text-maya-green hover:bg-maya-green/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir esta campanha?')) {
                                alert('Exclusão será implementada com banco de dados')
                              }
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <AlertCircle className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-maya-brown/60 dark:text-gray-400 text-lg">
              Nenhuma campanha encontrada com os filtros selecionados.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-maya-blue/10 dark:bg-maya-blue/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-maya-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-maya-brown dark:text-white mb-2">
                Sobre o Gerenciamento de Campanhas
              </h3>
              <p className="text-sm text-maya-brown/70 dark:text-gray-300 mb-2">
                Atualmente as campanhas são gerenciadas no arquivo <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">data/campaigns.ts</code>.
              </p>
              <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                <strong>Próximos passos:</strong> Criar, editar e excluir campanhas será implementado quando conectarmos um banco de dados (Supabase, Firebase, etc).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
