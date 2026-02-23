'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, ArrowLeft, Pause, Play, X, Calendar, DollarSign, CheckCircle, PawPrint, Activity, HeartPulse, Home, Heart } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

export default function AssinaturaPage() {
  const { doador, isLoading, pauseSubscription, resumeSubscription, cancelSubscription } = useDoador()
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !doador) {
      router.push('/doador/login')
    }
  }, [doador, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maya-olive mx-auto mb-4"></div>
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!doador || !doador.subscription) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/doador/dashboard"
            className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light mb-8"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-lg">
            <CreditCard className="w-20 h-20 text-maya-brown/30 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-maya-brown dark:text-white mb-4">
              Nenhuma Assinatura Ativa
            </h2>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-8">
              Você ainda não possui uma doação mensal ativa. Torne-se um apoiador recorrente!
            </p>
            <Link href="/doacoes" className="btn-primary inline-flex items-center gap-2">
              <CreditCard size={20} />
              Fazer Doação Mensal
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subscription = doador.subscription
  const isActive = subscription.status === 'active'
  const isPaused = subscription.status === 'paused'
  const isCancelled = subscription.status === 'cancelled'

  const handlePause = () => {
    pauseSubscription()
  }

  const handleResume = () => {
    resumeSubscription()
  }

  const handleCancel = () => {
    cancelSubscription()
    setShowCancelModal(false)
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/doador/dashboard"
            className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2">
            Gerenciar Assinatura
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Gerencie sua doação mensal
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 mb-8 ${
            isActive ? 'bg-gradient-to-r from-green-500 to-green-600' :
            isPaused ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
            'bg-gradient-to-r from-gray-500 to-gray-600'
          } text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                  {isActive ? <CheckCircle size={32} /> :
                   isPaused ? <Pause size={32} /> :
                   <X size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {isActive ? 'Assinatura Ativa' :
                     isPaused ? 'Assinatura Pausada' :
                     'Assinatura Cancelada'}
                  </h3>
                  <p className="text-white/80">
                    {isActive ? 'Sua doação mensal está ativa e em dia' :
                     isPaused ? 'Sua assinatura está temporariamente pausada' :
                     'Sua assinatura foi cancelada'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-6">
              Detalhes da Assinatura
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-maya-olive/10 dark:bg-maya-olive/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-maya-olive" size={24} />
                </div>
                <div>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Valor Mensal</p>
                  <p className="text-2xl font-bold text-maya-brown dark:text-white">
                    R$ {subscription.amount.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-maya-blue/10 dark:bg-maya-blue/20 rounded-xl flex items-center justify-center">
                  <Calendar className="text-maya-blue" size={24} />
                </div>
                <div>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">
                    {isActive ? 'Próxima Cobrança' : isPaused ? 'Última Cobrança' : 'Data de Cancelamento'}
                  </p>
                  <p className="text-2xl font-bold text-maya-brown dark:text-white">
                    {new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-purple-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Forma de Pagamento</p>
                  <p className="text-lg font-semibold text-maya-brown dark:text-white">
                    Cartão {subscription.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Doador Desde</p>
                  <p className="text-lg font-semibold text-maya-brown dark:text-white">
                    {new Date(subscription.startDate).toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="font-semibold text-lg text-maya-brown dark:text-white mb-4">
                Ações
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isActive && (
                  <>
                    <button
                      onClick={handlePause}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors font-semibold"
                    >
                      <Pause size={20} />
                      Pausar Assinatura
                    </button>
                    <button
                      onClick={() => alert('Funcionalidade de alterar valor será integrada com Stripe')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-maya-olive/10 dark:bg-maya-olive/20 text-maya-olive dark:text-maya-olive-light rounded-xl hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors font-semibold"
                    >
                      <DollarSign size={20} />
                      Alterar Valor
                    </button>
                    <button
                      onClick={() => alert('Funcionalidade de atualizar cartão será integrada com Stripe')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                    >
                      <CreditCard size={20} />
                      Atualizar Cartão
                    </button>
                  </>
                )}

                {isPaused && (
                  <button
                    onClick={handleResume}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors font-semibold"
                  >
                    <Play size={20} />
                    Reativar Assinatura
                  </button>
                )}

                {!isCancelled && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold"
                  >
                    <X size={20} />
                    Cancelar Assinatura
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Impact Info */}
          <div className="bg-gradient-to-r from-maya-olive to-maya-olive-light rounded-2xl p-8 text-white shadow-lg">
            <h3 className="font-display font-bold text-2xl mb-4 flex items-center gap-2">
              <Heart size={24} className="fill-white" />
              Seu Impacto Mensal
            </h3>
            <p className="text-white/90 mb-6">
              Com sua doação mensal de R$ {subscription.amount}, você:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-start gap-3">
                <PawPrint className="w-8 h-8 flex-shrink-0" />
                <p className="font-semibold">Ajuda a alimentar animais resgatados</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-start gap-3">
                <Activity className="w-8 h-8 flex-shrink-0" />
                <p className="font-semibold">Cobre vacinas e vermífugos</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-start gap-3">
                <HeartPulse className="w-8 h-8 flex-shrink-0" />
                <p className="font-semibold">Financia tratamentos veterinários</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-start gap-3">
                <Home className="w-8 h-8 flex-shrink-0" />
                <p className="font-semibold">Mantém nossa infraestrutura</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full">
            <h3 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-4">
              Cancelar Assinatura?
            </h3>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
              Tem certeza que deseja cancelar sua doação mensal? Você pode reativar a qualquer momento.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                Manter Assinatura
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
