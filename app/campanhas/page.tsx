'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCampaignProgress, getCampaignDaysLeft } from '@/data/campaigns'
import { useCampaigns } from '@/hooks/useCampaigns'
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
  const { campaigns, isLoading, getActiveCampaigns } = useCampaigns()
  const activeCampaigns = getActiveCampaigns()

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

        {/* Campaigns Grid */}
        {activeCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-maya-brown/60 dark:text-gray-400 text-lg">
              Nenhuma campanha ativa no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activeCampaigns.map((campaign) => {
              const Icon = iconMap[campaign.icon as keyof typeof iconMap] || Target
              
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

                  {/* Footer */}
                  <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-maya-green font-semibold group-hover:underline">
                      Contribuir →
                    </span>
                  </div>

                  {/* Registration Badge */}
                  {campaign.allowsRegistration && campaign.registrationInfo && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-maya-blue text-sm font-semibold">
                        <ClipboardList size={16} />
                        Inscrições abertas
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
