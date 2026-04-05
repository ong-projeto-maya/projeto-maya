'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, DollarSign, CreditCard, Check, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

type DonationType = 'single' | 'monthly'

const presetAmounts = [25, 50, 100, 250]

export default function DoacoesPage() {
  const [donationType, setDonationType] = useState<DonationType>('single')
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [donationError, setDonationError] = useState('')

  const handleDonation = async () => {
    setIsLoading(true)
    setDonationError('')

    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedAmount

      if (isNaN(amount) || amount < 5) {
        setDonationError('Por favor, insira um valor válido (mínimo R$ 5)')
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
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        setDonationError(error)
        setIsLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          setDonationError(error.message ?? 'Erro ao redirecionar para o pagamento.')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setDonationError('Erro ao processar doação. Tente novamente.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Faça uma Doação
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Sua contribuição transforma vidas! Cada doação nos ajuda a resgatar, 
            cuidar e encontrar lares pra esses pets que merecem tanto amor.
          </p>
        </div>

        {/* Donation Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Donation Type Toggle */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4 text-center">
                Tipo de Doação
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDonationType('single')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    donationType === 'single'
                      ? 'border-maya-green bg-maya-green/5 dark:bg-maya-green/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green/30 dark:hover:border-maya-green/50'
                  }`}
                >
                  {donationType === 'single' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-maya-green rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Heart className="w-8 h-8 text-maya-green mx-auto mb-3" />
                  <div className="font-bold text-maya-brown dark:text-white mb-1">Doação Única</div>
                  <div className="text-sm text-maya-brown/60 dark:text-gray-300">Contribua uma vez</div>
                </button>

                <button
                  onClick={() => setDonationType('monthly')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    donationType === 'monthly'
                      ? 'border-maya-blue bg-maya-blue/5 dark:bg-maya-blue/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-blue/30 dark:hover:border-maya-blue/50'
                  }`}
                >
                  {donationType === 'monthly' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-maya-blue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <DollarSign className="w-8 h-8 text-maya-blue mx-auto mb-3" />
                  <div className="font-bold text-maya-brown dark:text-white mb-1">Doação Mensal</div>
                  <div className="text-sm text-maya-brown/60 dark:text-gray-300">Seja um apoiador</div>
                  <div className="absolute top-2 left-2 bg-maya-blue text-white text-xs px-2 py-1 rounded-lg font-semibold">
                    Recomendado
                  </div>
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4 text-center">
                Valor da Doação
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount('')
                    }}
                    className={`p-4 rounded-xl border-2 font-bold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'border-maya-green bg-maya-green text-white'
                        : 'border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white hover:border-maya-green/50 dark:hover:border-maya-green'
                    }`}
                  >
                    R$ {amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-maya-brown dark:text-white font-bold text-lg">
                  R$
                </span>
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  placeholder="Outro valor"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(0)
                  }}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-lg font-semibold bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                />
              </div>

              <p className="text-sm text-maya-brown/60 dark:text-gray-400 mt-3 text-center">
                Valor mínimo: R$ 5,00
              </p>
            </div>

            {/* Impact Message */}
            <div className="bg-maya-beige dark:bg-gray-700 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-maya-brown dark:text-white mb-3 text-center">
                Seu impacto:
              </h3>
              <div className="space-y-2 text-sm text-maya-brown/80 dark:text-gray-300">
                {(customAmount ? parseFloat(customAmount) : selectedAmount) >= 25 && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                    <span>Alimentação para 1 animal por 1 semana</span>
                  </div>
                )}
                {(customAmount ? parseFloat(customAmount) : selectedAmount) >= 50 && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                    <span>Vacinas e vermífugos</span>
                  </div>
                )}
                {(customAmount ? parseFloat(customAmount) : selectedAmount) >= 100 && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                    <span>Consulta veterinária completa</span>
                  </div>
                )}
                {(customAmount ? parseFloat(customAmount) : selectedAmount) >= 250 && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                    <span>Cirurgia de castração</span>
                  </div>
                )}
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonation}
              disabled={isLoading}
              className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Processando...</>
              ) : (
                <>
                  <CreditCard size={24} />
                  Doar {donationType === 'monthly' && 'Mensalmente'} R${' '}
                  {customAmount || selectedAmount}
                </>
              )}
            </button>

            {donationError && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                {donationError}
              </div>
            )}

            <p className="text-xs text-maya-brown/60 dark:text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Pagamento seguro processado pelo Stripe
            </p>

            {/* Doador CTA */}
            <div className="mt-8 bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl p-6 border-2 border-maya-green/30 dark:border-maya-green/40">
              <div className="text-center">
                <h3 className="font-bold text-maya-brown dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Heart size={20} className="text-maya-green fill-maya-green" />
                  Já é um doador?
                </h3>
                <p className="text-sm text-maya-brown/70 dark:text-gray-300 mb-4">
                  Acesse sua conta para ver seu histórico de doações, baixar recibos e acompanhar seu impacto
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/doador/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-maya-green text-white rounded-xl hover:bg-maya-green transition-colors font-semibold"
                  >
                    Acessar Área do Doador
                  </Link>
                  <Link
                    href="/doador/registro"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-maya-green text-maya-green dark:text-maya-green rounded-xl hover:bg-maya-green/10 dark:hover:bg-maya-green/20 transition-colors font-semibold"
                  >
                    Criar Conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
