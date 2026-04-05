'use client'

import Link from 'next/link'
import { Target, ArrowRight, Scissors, UtensilsCrossed, ClipboardList } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useCampaigns } from '@/hooks/useCampaigns'

const campaignIcons = [Scissors, UtensilsCrossed]

export default function CampaignsCTA() {
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.15 })
  const { getActiveCampaigns, isLoading } = useCampaigns()
  const activeCampaigns = getActiveCampaigns().slice(0, 2)

  return (
    <section className="py-20 bg-maya-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display mb-4">
              Campanhas Especiais
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Contribua pra causas específicas e veja exatamente o impacto da sua doação!
            </p>
          </div>

          {/* Campaign CTAs */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-3xl mx-auto">
            {isLoading
              ? [0, 1].map(i => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center animate-pulse">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mb-3" />
                    <div className="h-4 bg-white/20 rounded w-full mb-2" />
                    <div className="h-4 bg-white/20 rounded w-5/6 mx-auto mb-6" />
                    <div className="h-10 bg-white/20 rounded-xl" />
                  </div>
                ))
              : activeCampaigns.map((campaign, index) => {
                  const Icon = campaignIcons[index] ?? Target
                  return (
                    <div
                      key={campaign.id}
                      className={`bg-white/10 backdrop-blur rounded-2xl p-8 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-${index + 1}`}
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-display text-2xl mb-3">{campaign.title}</h3>
                      <p className="text-white/80 mb-6">{campaign.description}</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          href={`/campanhas/${campaign.id}`}
                          className="inline-flex items-center gap-2 bg-white text-maya-brown px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all justify-center"
                        >
                          Quero Contribuir
                          <ArrowRight size={18} />
                        </Link>
                        {campaign.allowsRegistration && (
                          <Link
                            href={`/campanhas/${campaign.id}#inscricao`}
                            className="inline-flex items-center gap-2 bg-white/15 border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-all justify-center"
                          >
                            <ClipboardList size={18} />
                            Quero me Inscrever
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })
            }
          </div>

          {/* Link to all campaigns */}
          <div className="text-center">
            <Link
              href="/campanhas"
              className="text-white/80 hover:text-white font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Ver todas as campanhas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
