'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { campaigns, getActiveCampaigns, getCampaignProgress, getCampaignDaysLeft } from '@/data/campaigns'
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Heart,
  AlertCircle,
  Home,
  Utensils,
  Ambulance,
  Users,
  HeartPulse,
  Sparkles,
  ClipboardList
} from 'lucide-react'

type CategoryFilter = 'all' | 'saude' | 'resgate' | 'infraestrutura' | 'alimentacao'

const iconMap = {
  'Heart': Heart,
  'Home': Home,
  'Utensils': Utensils,
  'Ambulance': Ambulance,
  'Users': Users,
  'HeartPulse': HeartPulse
}

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
  'urgente': 'Urgente!'
}

export default function CampanhasPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  
  const activeCampaigns = getActiveCampaigns()
  
  const filteredCampaigns = categoryFilter === 'all' 
    ? activeCampaigns 
    : activeCampaigns.filter(c => c.category === categoryFilter)

  const totalRaised = activeCampaigns.reduce((sum, c) => sum + c.raised, 0)
  const totalGoal = activeCampaigns.reduce((sum, c) => sum + c.goal, 0)
  const overallProgress = Math.round((totalRaised / totalGoal) * 100)

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Target className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Nossas Campanhas
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Contribua pra causas específicas e veja o impacto direto da sua doação! 
            Cada campanha tem um objetivo claro e urgente.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="bg-gradient-to-br from-maya-green to-maya-blue text-white rounded-3xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-display mb-1">
                {activeCampaigns.length}
              </div>
              <div className="text-white/80 text-sm">Campanhas Ativas</div>
            </div>
            <div>
              <Heart className="w-8 h-8 mx-auto mb-2 fill-white" />
              <div className="text-3xl font-display mb-1">
                R$ {totalRaised.toLocaleString('pt-BR')}
              </div>
              <div className="text-white/80 text-sm">Total Arrecadado</div>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-display mb-1">
                {overallProgress}%
              </div>
              <div className="text-white/80 text-sm">Progresso Geral</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              categoryFilter === 'all'
                ? 'bg-maya-green text-white'
                : 'bg-white dark:bg-gray-800 text-maya-brown dark:text-white hover:bg-maya-green/10 dark:hover:bg-gray-700'
            }`}
          >
            Todas ({activeCampaigns.length})
          </button>
          {Object.entries(categoryNames).map(([key, name]) => {
            const count = activeCampaigns.filter(c => c.category === key).length
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as CategoryFilter)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  categoryFilter === key
                    ? 'bg-maya-green text-white'
                    : 'bg-white dark:bg-gray-800 text-maya-brown dark:text-white hover:bg-maya-green/10 dark:hover:bg-gray-700'
                }`}
              >
                {name} ({count})
              </button>
            )
          })}
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-maya-brown/60 dark:text-gray-400 text-lg">
              Nenhuma campanha ativa nesta categoria no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => {
              const Icon = iconMap[campaign.icon as keyof typeof iconMap] || Target
              const progress = getCampaignProgress(campaign)
              const daysLeft = getCampaignDaysLeft(campaign)
              
              return (
                <Link
                  key={campaign.id}
                  href={`/campanhas/${campaign.id}`}
                  className="card group hover:scale-105 transition-transform duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-200">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Urgency Badge */}
                    <div className={`absolute top-4 right-4 ${urgencyColors[campaign.urgency]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {urgencyNames[campaign.urgency]}
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 text-maya-brown dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {categoryNames[campaign.category]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-maya-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-maya-brown dark:text-white mb-1 group-hover:text-maya-green transition-colors">
                        {campaign.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-maya-brown/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-maya-green">
                        {progress}%
                      </span>
                      <span className="text-xs text-maya-brown/60 dark:text-gray-400">
                        Meta: R$ {campaign.goal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-maya-green to-maya-blue h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-maya-brown/70 dark:text-gray-300">
                      <span className="font-bold text-maya-green">
                        R$ {campaign.raised.toLocaleString('pt-BR')}
                      </span> arrecadados
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-maya-brown/60 dark:text-gray-400 text-sm">
                      <Calendar size={16} />
                      <span>{daysLeft} dias restantes</span>
                    </div>
                    <span className="text-maya-green font-semibold group-hover:underline">
                      Contribuir →
                    </span>
                  </div>

                  {/* Registration Badge */}
                  {campaign.allowsRegistration && campaign.registrationInfo && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-maya-blue text-sm font-semibold">
                          <ClipboardList size={16} />
                          Inscrições abertas
                        </div>
                        <span className="text-xs text-maya-brown/60 dark:text-gray-400">
                          {campaign.registrationInfo.spots - campaign.registrationInfo.registered} vagas
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA Final */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-maya-green mx-auto mb-4" />
          <h3 className="font-display text-3xl text-maya-brown dark:text-white mb-4">
            Não encontrou a campanha ideal?
          </h3>
          <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
            Você pode fazer uma doação geral que será distribuída onde for mais necessário!
          </p>
          <Link
            href="/doacoes"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Heart size={20} />
            Fazer Doação Geral
          </Link>
        </div>
      </div>
    </div>
  )
}
