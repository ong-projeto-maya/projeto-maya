'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCampaignById, getCampaignProgress, getCampaignDaysLeft } from '@/data/campaigns'
import { 
  ArrowLeft,
  Heart,
  Calendar,
  Target,
  Check,
  TrendingUp,
  Users,
  Share2,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

type DonationType = 'single' | 'monthly'

const presetAmounts = [25, 50, 100, 250, 500]

export default function CampanhaDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const campaign = getCampaignById(campaignId)

  const [donationType, setDonationType] = useState<DonationType>('single')
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  if (!campaign) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-display text-maya-brown dark:text-white mb-4">
            Campanha não encontrada
          </h1>
          <Link href="/campanhas" className="text-maya-green hover:underline">
            ← Voltar para Campanhas
          </Link>
        </div>
      </div>
    )
  }

  const progress = getCampaignProgress(campaign)
  const daysLeft = getCampaignDaysLeft(campaign)
  const remaining = campaign.goal - campaign.raised

  const handleDonation = async () => {
    setIsLoading(true)

    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedAmount

      if (isNaN(amount) || amount < 5) {
        alert('Por favor, insira um valor válido (mínimo R$ 5)')
        setIsLoading(false)
        return
      }

      // Call API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          donationType: donationType,
          campaignId: campaign.id,
          campaignName: campaign.title
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        alert(error)
        setIsLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          alert(error.message)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao processar doação. Tente novamente.')
    }

    setIsLoading(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/campanhas"
          className="inline-flex items-center gap-2 text-maya-green hover:text-maya-blue mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para Campanhas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display text-maya-brown dark:text-white mb-6">
              {campaign.title}
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <Target className="w-6 h-6 text-maya-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-maya-brown dark:text-white">
                  {progress}%
                </div>
                <div className="text-xs text-maya-brown/60 dark:text-gray-400">
                  Alcançado
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <Calendar className="w-6 h-6 text-maya-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-maya-brown dark:text-white">
                  {daysLeft}
                </div>
                <div className="text-xs text-maya-brown/60 dark:text-gray-400">
                  Dias restantes
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <Users className="w-6 h-6 text-maya-orange mx-auto mb-2" />
                <div className="text-2xl font-bold text-maya-brown dark:text-white">
                  {Math.floor(campaign.raised / 50)}
                </div>
                <div className="text-xs text-maya-brown/60 dark:text-gray-400">
                  Apoiadores
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4">
                Sobre esta campanha
              </h2>
              <p className="text-maya-brown/80 dark:text-gray-300 leading-relaxed mb-6">
                {campaign.longDescription}
              </p>

              <h3 className="font-display text-xl text-maya-brown dark:text-white mb-4">
                O que sua doação vai proporcionar:
              </h3>
              <ul className="space-y-3">
                {campaign.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-maya-green flex-shrink-0 mt-0.5" />
                    <span className="text-maya-brown/80 dark:text-gray-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact Story */}
            <div className="bg-gradient-to-br from-maya-green/10 to-maya-blue/10 dark:from-maya-green/20 dark:to-maya-blue/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-maya-green" />
                <h3 className="font-display text-2xl text-maya-brown dark:text-white">
                  Impacto Real
                </h3>
              </div>
              <p className="text-maya-brown/80 dark:text-gray-300 leading-relaxed">
                {campaign.impactStory}
              </p>
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-maya-brown/60 dark:text-gray-400">
                      Arrecadado
                    </span>
                    <span className="text-sm font-semibold text-maya-green">
                      {progress}%
                    </span>
                  </div>
                  <div className="text-3xl font-display text-maya-brown dark:text-white mb-1">
                    R$ {campaign.raised.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-maya-brown/60 dark:text-gray-400 mb-4">
                    de R$ {campaign.goal.toLocaleString('pt-BR')}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-maya-green to-maya-blue h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {remaining > 0 && (
                    <div className="mt-2 text-sm text-maya-brown/60 dark:text-gray-400">
                      Faltam <span className="font-bold text-maya-green">R$ {remaining.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                {/* Donation Type */}
                <div className="mb-6">
                  <h3 className="font-bold text-maya-brown dark:text-white mb-3">
                    Tipo de Doação
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDonationType('single')}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        donationType === 'single'
                          ? 'border-maya-green bg-maya-green/10 text-maya-green'
                          : 'border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white'
                      }`}
                    >
                      <Heart size={16} className="mx-auto mb-1" />
                      Única
                    </button>
                    <button
                      onClick={() => setDonationType('monthly')}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        donationType === 'monthly'
                          ? 'border-maya-green bg-maya-green/10 text-maya-green'
                          : 'border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white'
                      }`}
                    >
                      <TrendingUp size={16} className="mx-auto mb-1" />
                      Mensal
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6">
                  <h3 className="font-bold text-maya-brown dark:text-white mb-3">
                    Valor da Contribuição
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setCustomAmount('')
                        }}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedAmount === amount && !customAmount
                            ? 'border-maya-green bg-maya-green text-white'
                            : 'border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white hover:border-maya-green'
                        }`}
                      >
                        R$ {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Outro valor (mín. R$ 5)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonation}
                  disabled={isLoading}
                  className="btn-primary w-full mb-3 disabled:opacity-50"
                >
                  {isLoading ? 'Processando...' : 'Contribuir Agora'}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full px-6 py-3 rounded-xl border-2 border-maya-green text-maya-green hover:bg-maya-green hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Compartilhar Campanha
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-maya-beige dark:bg-gray-800 rounded-2xl p-6 text-center">
                <Check className="w-8 h-8 text-maya-green mx-auto mb-2" />
                <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                  <strong>100% seguro</strong><br />
                  Todas as doações são processadas com segurança pelo Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
