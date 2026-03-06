import Link from 'next/link'
import { Target, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { getActiveCampaigns } from '@/data/campaigns'

export default function CampaignsCTA() {
  const campaigns = getActiveCampaigns()
  const activeCampaignsCount = campaigns.length
  
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0)
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0)
  const overallProgress = Math.round((totalRaised / totalGoal) * 100)

  return (
    <section className="py-20 bg-gradient-to-br from-maya-blue to-maya-green text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-display mb-4">
              Campanhas Especiais
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Contribua pra causas específicas e veja exatamente o impacto da sua doação!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3" />
              <div className="text-4xl font-display mb-2">
                {activeCampaignsCount}
              </div>
              <div className="text-white/80">
                Campanhas Ativas
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <div className="text-4xl font-display mb-2">
                {overallProgress}%
              </div>
              <div className="text-white/80">
                Progresso Geral
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="text-4xl font-display mb-2">
                R$ {totalRaised.toLocaleString('pt-BR')}
              </div>
              <div className="text-white/80">
                Já Arrecadado
              </div>
            </div>
          </div>

          {/* Featured Campaigns Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {campaigns.slice(0, 3).map((campaign) => {
              const progress = Math.round((campaign.raised / campaign.goal) * 100)
              
              return (
                <div key={campaign.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {campaign.title}
                  </h3>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-white/80">
                    {progress}% alcançado
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <Link
              href="/campanhas"
              className="bg-white text-maya-green hover:bg-maya-beige px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all"
            >
              Ver Todas as Campanhas
              <ArrowRight size={20} />
            </Link>
            <p className="mt-4 text-white/70 text-sm">
              Escolha a causa que mais te toca e faça a diferença!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
