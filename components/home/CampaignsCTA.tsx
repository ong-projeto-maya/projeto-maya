'use client'

import Link from 'next/link'
import { Target, ArrowRight, Scissors, UtensilsCrossed, ClipboardList } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CampaignsCTA() {
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.15 })

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
            <div
              className={`bg-white/10 backdrop-blur rounded-2xl p-8 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-1`}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl mb-3">Castração Solidária</h3>
              <p className="text-white/80 mb-6">
                Ajude a custear castrações gratuitas para pets de famílias em situação de vulnerabilidade
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/campanhas/1"
                  className="inline-flex items-center gap-2 bg-white text-maya-brown px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all justify-center"
                >
                  Quero Contribuir
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/campanhas/1#inscricao"
                  className="inline-flex items-center gap-2 bg-white/15 border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-all justify-center"
                >
                  <ClipboardList size={18} />
                  Quero me Inscrever
                </Link>
              </div>
            </div>

            <div
              className={`bg-white/10 backdrop-blur rounded-2xl p-8 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-2`}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl mb-3">Doação de Rações</h3>
              <p className="text-white/80 mb-6">
                Garanta alimentação para os animais resgatados durante os meses mais frios do ano
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/campanhas/3"
                  className="inline-flex items-center gap-2 bg-white text-maya-brown px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all justify-center"
                >
                  Quero Contribuir
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/campanhas/3#inscricao"
                  className="inline-flex items-center gap-2 bg-white/15 border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-all justify-center"
                >
                  <ClipboardList size={18} />
                  Quero me Inscrever
                </Link>
              </div>
            </div>
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
