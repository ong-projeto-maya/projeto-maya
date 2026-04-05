'use client'

import { useState, useEffect } from 'react'
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
  X,
  Save,
} from 'lucide-react'
import { getCampaignProgress, getCampaignDaysLeft } from '@/data/campaigns'
import type { Campaign } from '@/data/campaigns'
import { useCampaigns } from '@/hooks/useCampaigns'

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
  const { campaigns, isLoading: campanhasLoading, addCampaign, updateCampaign, deleteCampaign } = useCampaigns()
  const [showModal, setShowModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const emptyForm = {
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    goal: '',
    raised: '0',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    image: '',
    icon: '🐾',
    category: 'resgate' as Campaign['category'],
    urgency: 'media' as Campaign['urgency'],
    benefits: '',
    impactStory: '',
    allowsRegistration: false,
  }
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maya-green mx-auto mb-4"></div>
        </div>
      </div>
    )
  }

  const handleOpenModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign)
      setFormData({
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        longDescription: campaign.longDescription,
        goal: campaign.goal.toString(),
        raised: campaign.raised.toString(),
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        isActive: campaign.isActive,
        image: campaign.image,
        icon: campaign.icon,
        category: campaign.category,
        urgency: campaign.urgency,
        benefits: campaign.benefits.join(', '),
        impactStory: campaign.impactStory,
        allowsRegistration: campaign.allowsRegistration,
      })
    } else {
      setEditingCampaign(null)
      setFormData(emptyForm)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCampaign(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const campaignData: Omit<Campaign, 'id'> = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: formData.description,
      longDescription: formData.longDescription,
      goal: parseFloat(formData.goal) || 0,
      raised: parseFloat(formData.raised) || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      image: formData.image,
      icon: formData.icon,
      category: formData.category,
      urgency: formData.urgency,
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean),
      impactStory: formData.impactStory,
      allowsRegistration: formData.allowsRegistration,
    }

    if (editingCampaign) {
      await updateCampaign(editingCampaign.id, campaignData)
      setSuccessMessage(`"${formData.title}" atualizada com sucesso!`)
    } else {
      await addCampaign(campaignData)
      setSuccessMessage(`"${formData.title}" criada com sucesso!`)
    }
    handleCloseModal()
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDelete = async (campaign: Campaign) => {
    if (confirm(`Tem certeza que deseja excluir "${campaign.title}"?`)) {
      await deleteCampaign(campaign.id)
      setSuccessMessage(`"${campaign.title}" removida com sucesso!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleToggleActive = async (campaign: Campaign) => {
    await updateCampaign(campaign.id, { isActive: !campaign.isActive })
    setSuccessMessage(`"${campaign.title}" ${!campaign.isActive ? 'ativada' : 'desativada'}!`)
    setTimeout(() => setSuccessMessage(''), 3000)
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
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Campanha
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

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
                            onClick={() => handleOpenModal(campaign)}
                            className="p-2 text-maya-green hover:bg-maya-green/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign)}
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
        {filteredCampaigns.length === 0 && !campanhasLoading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <AlertCircle className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-maya-brown/60 dark:text-gray-400 text-lg">
              Nenhuma campanha encontrada com os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-display text-maya-brown dark:text-white">
                {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={24} className="text-maya-brown dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))}
                    placeholder="gerado automaticamente"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Ícone</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData(f => ({ ...f, icon: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Descrição *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Descrição Longa</label>
                  <textarea
                    rows={3}
                    value={formData.longDescription}
                    onChange={e => setFormData(f => ({ ...f, longDescription: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Meta (R$) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.goal}
                    onChange={e => setFormData(f => ({ ...f, goal: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Arrecadado (R$)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.raised}
                    onChange={e => setFormData(f => ({ ...f, raised: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Data Início *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Data Fim *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(f => ({ ...f, category: e.target.value as Campaign['category'] }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="saude">Saúde</option>
                    <option value="resgate">Resgate</option>
                    <option value="infraestrutura">Infraestrutura</option>
                    <option value="alimentacao">Alimentação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Urgência</label>
                  <select
                    value={formData.urgency}
                    onChange={e => setFormData(f => ({ ...f, urgency: e.target.value as Campaign['urgency'] }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">URL da Imagem</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">Benefícios (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formData.benefits}
                    onChange={e => setFormData(f => ({ ...f, benefits: e.target.value }))}
                    placeholder="Benefício 1, Benefício 2"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">História de Impacto</label>
                  <textarea
                    rows={2}
                    value={formData.impactStory}
                    onChange={e => setFormData(f => ({ ...f, impactStory: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))}
                    className="w-5 h-5 accent-maya-green"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-maya-brown dark:text-white">Campanha Ativa</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowsRegistration"
                    checked={formData.allowsRegistration}
                    onChange={e => setFormData(f => ({ ...f, allowsRegistration: e.target.checked }))}
                    className="w-5 h-5 accent-maya-green"
                  />
                  <label htmlFor="allowsRegistration" className="text-sm font-semibold text-maya-brown dark:text-white">Permite Inscrições</label>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingCampaign ? 'Salvar Alterações' : 'Criar Campanha'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-outline flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
