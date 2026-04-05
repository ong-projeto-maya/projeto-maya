'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Heart, Home, Dog, HomeIcon, Loader2, RefreshCw } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

interface SessionData {
  id: string
  status: string
  amount: number
  currency: string
  customerEmail: string
  donationType: 'single' | 'monthly'
  campaignId: string | null
  campaignName: string | null
  subscriptionId: string | null
  nextBillingDate: string | null
}

function DonationSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(!!sessionId)
  const [error, setError] = useState<string | null>(null)
  const { doador, addDonation } = useDoador()

  useEffect(() => {
    if (!sessionId) return

    async function fetchSession() {
      try {
        const res = await fetch(`/api/confirm-session?session_id=${sessionId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setSession(data)

        // Reload donor data from Supabase after webhook persists the donation
        if (doador) {
          await addDonation({
            stripeSessionId: sessionId!,
            amount: data.amount,
            type: data.donationType,
            status: 'completed',
            campaignId: data.campaignId ?? undefined,
            campaignName: data.campaignName ?? undefined,
            subscriptionId: data.subscriptionId ?? undefined,
            nextBillingDate: data.nextBillingDate ?? undefined,
          })
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Projeto Maya"
                className="h-32 w-auto animate-bounce drop-shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-maya-green rounded-full flex items-center justify-center animate-pulse shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-6 flex items-center justify-center gap-4">
            Muito Obrigado!
            <Heart className="w-16 h-16 text-maya-green fill-maya-green" />
          </h1>

          <p className="text-xl text-maya-brown/80 dark:text-gray-300 mb-8">
            Sua doação foi recebida com sucesso!
          </p>

          {/* Donation Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg mb-8">
            {loading && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 text-maya-green animate-spin" />
                <p className="text-maya-brown/60 dark:text-gray-400 text-sm">Confirmando seu pagamento...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <RefreshCw className="w-8 h-8 text-maya-orange" />
                <p className="text-maya-brown/60 dark:text-gray-400 text-sm">
                  Seu pagamento foi processado! Não foi possível carregar os detalhes agora,
                  mas você receberá a confirmação por e-mail.
                </p>
              </div>
            )}

            {session && !loading && (
              <>
                <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-6">
                  Detalhes da Doação
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
                  <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs text-maya-brown/50 dark:text-gray-400 uppercase font-semibold mb-1">Valor</p>
                    <p className="text-2xl font-bold text-maya-green">
                      R$ {session.amount.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs text-maya-brown/50 dark:text-gray-400 uppercase font-semibold mb-1">Tipo</p>
                    <p className="text-lg font-semibold text-maya-brown dark:text-white">
                      {session.donationType === 'monthly' ? 'Doação Mensal' : 'Doação Única'}
                    </p>
                  </div>
                  {session.customerEmail && (
                    <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4 sm:col-span-2">
                      <p className="text-xs text-maya-brown/50 dark:text-gray-400 uppercase font-semibold mb-1">Confirmação enviada para</p>
                      <p className="text-base font-medium text-maya-brown dark:text-white">{session.customerEmail}</p>
                    </div>
                  )}
                  {session.campaignName && (
                    <div className="bg-maya-green/10 dark:bg-maya-green/20 rounded-xl p-4 sm:col-span-2">
                      <p className="text-xs text-maya-green/70 uppercase font-semibold mb-1">Campanha Apoiada</p>
                      <p className="text-base font-bold text-maya-green">{session.campaignName}</p>
                    </div>
                  )}
                  {session.donationType === 'monthly' && session.nextBillingDate && (
                    <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4 sm:col-span-2">
                      <p className="text-xs text-maya-brown/50 dark:text-gray-400 uppercase font-semibold mb-1">Próxima Cobrança</p>
                      <p className="text-base font-medium text-maya-brown dark:text-white">
                        {new Date(session.nextBillingDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                {session.donationType === 'monthly' && (
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400">
                    Você se tornou um doador mensal! Enviaremos atualizações regulares
                    sobre o impacto das suas contribuições.
                  </p>
                )}
              </>
            )}

            {!sessionId && (
              <>
                <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4">
                  Seu Impacto
                </h2>
                <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
                  Você receberá um e-mail de confirmação com os detalhes da sua doação.
                </p>
              </>
            )}

            {/* Impact Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <Dog className="w-6 h-6 text-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Resgate</div>
              </div>
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-maya-green fill-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Cuidado</div>
              </div>
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Adoção</div>
              </div>
            </div>
          </div>

          {/* Continue CTA */}
          <div className="bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-maya-brown dark:text-white mb-3">
              Continue Fazendo a Diferença
            </h3>
            <p className="text-sm text-maya-brown/70 dark:text-gray-300 mb-4">
              Compartilhe nossa causa com amigos e família, ou considere adotar
              um de nossos amiguinhos!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <Home size={20} />
              Voltar ao Início
            </Link>
            <Link href="/adocao" className="btn-secondary inline-flex items-center gap-2">
              <Heart size={20} />
              Ver Animais para Adoção
            </Link>
            {doador && (
              <Link href="/doador/dashboard" className="btn-outline inline-flex items-center gap-2">
                Ver Meu Painel
              </Link>
            )}
          </div>

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-maya-brown/10 dark:border-gray-700">
            <p className="text-maya-brown/60 dark:text-gray-400 mb-4">
              Compartilhe nossa causa nas redes sociais:
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity font-bold"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Acabei de apoiar o Projeto Maya!')}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity font-bold"
              >
                X
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Acabei de apoiar o Projeto Maya! ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity font-bold text-xs"
              >
                WA
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-maya-green animate-spin" />
      </div>
    }>
      <DonationSuccessContent />
    </Suspense>
  )
}
