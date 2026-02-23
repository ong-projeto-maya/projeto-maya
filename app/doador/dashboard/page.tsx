'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Award, 
  PawPrint, 
  DollarSign, 
  FileText,
  Settings,
  CreditCard,
  Download,
  Activity,
  Home,
  Hand
} from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

const levelConfig = {
  bronze: { name: 'Bronze', color: 'bg-amber-700', iconColor: 'text-amber-700', min: 0, max: 500 },
  silver: { name: 'Prata', color: 'bg-gray-400', iconColor: 'text-gray-400', min: 500, max: 2000 },
  gold: { name: 'Ouro', color: 'bg-yellow-500', iconColor: 'text-yellow-500', min: 2000, max: 5000 },
  diamond: { name: 'Diamante', color: 'bg-blue-400', iconColor: 'text-blue-400', min: 5000, max: 10000 },
}

export default function DoadorDashboard() {
  const { doador, isLoading, getLevelProgress } = useDoador()
  const router = useRouter()

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

  if (!doador) {
    return null
  }

  const levelInfo = levelConfig[doador.level]
  const progress = getLevelProgress(doador.totalDonated)
  const nextLevel = doador.level === 'diamond' ? 'Máximo' : levelConfig[
    doador.level === 'bronze' ? 'silver' : 
    doador.level === 'silver' ? 'gold' : 'diamond'
  ].name

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2 flex items-center gap-3">
            Olá, {doador.name.split(' ')[0]}!
            <Hand className="w-8 h-8 text-maya-olive" />
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Aqui está o resumo do seu impacto no Projeto Maya
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donated */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${levelInfo.color} rounded-xl flex items-center justify-center`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className={`px-3 py-1 ${levelInfo.color} bg-opacity-20 dark:bg-opacity-30 text-xs font-bold rounded-full`}>
                {levelInfo.name}
              </span>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              R$ {doador.totalDonated.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Total Doado
            </p>
          </div>

          {/* Animals Helped */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-olive rounded-xl flex items-center justify-center">
                <PawPrint className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {doador.animalsHelped}
            </p>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Animais Ajudados
            </p>
          </div>

          {/* Donation Count */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-blue rounded-xl flex items-center justify-center">
                <Heart className="text-white fill-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {doador.donationCount}
            </p>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Doações Realizadas
            </p>
          </div>

          {/* Member Since */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {new Date(doador.firstDonation).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Doador Desde
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gradient-to-r from-maya-olive to-maya-olive-light rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                <Award size={24} />
                Nível {levelInfo.name}
              </h3>
              <p className="text-white/80">
                {doador.level === 'diamond' 
                  ? 'Você alcançou o nível máximo! 🎉'
                  : `Faltam R$ ${(progress.next - doador.totalDonated).toLocaleString('pt-BR')} para ${nextLevel}`
                }
              </p>
            </div>
            <Award size={48} className="text-white/80" />
          </div>
          
          {/* Progress Bar */}
          {doador.level !== 'diamond' && (
            <div>
              <div className="bg-white/20 rounded-full h-4 mb-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/80">
                <span>R$ {progress.current.toLocaleString('pt-BR')}</span>
                <span>{progress.percentage}%</span>
                <span>R$ {progress.next.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Status */}
            {doador.subscription && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white flex items-center gap-2">
                    <CreditCard size={24} className="text-maya-olive" />
                    Doação Mensal
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    doador.subscription.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : doador.subscription.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {doador.subscription.status === 'active' ? 'Ativa' :
                     doador.subscription.status === 'paused' ? 'Pausada' : 'Cancelada'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Valor Mensal</p>
                    <p className="text-2xl font-bold text-maya-brown dark:text-white">
                      R$ {doador.subscription.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Próxima Cobrança</p>
                    <p className="text-lg font-semibold text-maya-brown dark:text-white">
                      {new Date(doador.subscription.nextBillingDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-1">Forma de Pagamento</p>
                    <p className="text-lg font-semibold text-maya-brown dark:text-white">
                      {doador.subscription.paymentMethod}
                    </p>
                  </div>
                </div>

                <Link
                  href="/doador/assinatura"
                  className="btn-outline w-full text-center"
                >
                  Gerenciar Assinatura
                </Link>
              </div>
            )}

            {/* Recent Donations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white flex items-center gap-2">
                  <TrendingUp size={24} className="text-maya-blue" />
                  Últimas Doações
                </h3>
                <Link
                  href="/doador/doacoes"
                  className="text-sm text-maya-olive hover:text-maya-olive-light font-medium"
                >
                  Ver Todas
                </Link>
              </div>

              <div className="space-y-4">
                {doador.donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        donation.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : donation.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <DollarSign size={20} className={
                          donation.status === 'completed' 
                            ? 'text-green-600 dark:text-green-400'
                            : donation.status === 'pending'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        } />
                      </div>
                      <div>
                        <p className="font-semibold text-maya-brown dark:text-white">
                          R$ {donation.amount.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-maya-brown/60 dark:text-gray-400">
                          {new Date(donation.date).toLocaleDateString('pt-BR')} • {
                            donation.type === 'monthly' ? 'Mensal' : 'Única'
                          }
                        </p>
                      </div>
                    </div>
                    {donation.receipt && (
                      <button className="p-2 hover:bg-maya-beige dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Download size={18} className="text-maya-brown dark:text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Link
                  href="/doador/animais"
                  className="flex items-center gap-3 p-3 hover:bg-maya-beige dark:hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <PawPrint size={20} className="text-maya-olive" />
                  <span className="font-medium text-maya-brown dark:text-white group-hover:text-maya-olive">
                    Animais que Ajudei
                  </span>
                </Link>
                
                <Link
                  href="/doador/doacoes"
                  className="flex items-center gap-3 p-3 hover:bg-maya-beige dark:hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <FileText size={20} className="text-maya-blue" />
                  <span className="font-medium text-maya-brown dark:text-white group-hover:text-maya-olive">
                    Histórico Completo
                  </span>
                </Link>

                <Link
                  href="/doador/perfil"
                  className="flex items-center gap-3 p-3 hover:bg-maya-beige dark:hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <Settings size={20} className="text-purple-500" />
                  <span className="font-medium text-maya-brown dark:text-white group-hover:text-maya-olive">
                    Meu Perfil
                  </span>
                </Link>

                <Link
                  href="/doacoes"
                  className="flex items-center gap-3 p-3 bg-maya-olive text-white rounded-xl hover:bg-maya-olive-light transition-colors"
                >
                  <Heart size={20} className="fill-white" />
                  <span className="font-semibold">
                    Fazer Nova Doação
                  </span>
                </Link>
              </div>
            </div>

            {/* Impact Banner */}
            <div className="bg-gradient-to-br from-maya-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-display font-bold text-xl mb-3 flex items-center gap-2">
                <Heart size={20} className="fill-white" />
                Seu Impacto
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Suas doações já transformaram a vida de {doador.animalsHelped} animais!
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                  <PawPrint className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs mt-1">Resgates</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                  <Activity className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs mt-1">Vacinas</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                  <Heart className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs mt-1">Tratamentos</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                  <Home className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs mt-1">Adoções</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
