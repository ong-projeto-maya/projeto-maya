'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Settings,
  CreditCard,
  Target,
  LogOut,
  X,
  Award,
  FileText,
  ChevronRight,
  Heart,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'
import { useCampaigns } from '@/hooks/useCampaigns'
import Image from 'next/image'

export default function DoadorDashboard() {
  const { doador, isLoading, logout } = useDoador()
  const { getCampaignById } = useCampaigns()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/doador/login')
  }

  useEffect(() => {
    if (!isLoading && !doador) {
      router.push('/doador/login')
    }
  }, [doador, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EF] dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-maya-green/30 border-t-maya-green mx-auto mb-4"></div>
          <p className="text-maya-brown/60 dark:text-gray-400 text-sm">Carregando seu perfil...</p>
        </div>
      </div>
    )
  }

  if (!doador) return null

  const doadorCampaigns = doador.donations.filter(d => d.campaignId)

  const levelConfig = {
    bronze:  { label: 'Bronze',   icon: '\u{1F3C9}', gradient: 'from-orange-400 to-amber-500',   ring: 'ring-orange-300',  bg: 'bg-orange-50 dark:bg-orange-950/30',   text: 'text-orange-700 dark:text-orange-300' },
    silver:  { label: 'Prata',    icon: '\u{1F3C8}', gradient: 'from-slate-400 to-gray-500',     ring: 'ring-slate-300',   bg: 'bg-slate-50 dark:bg-slate-800/40',     text: 'text-slate-600 dark:text-slate-300' },
    gold:    { label: 'Ouro',     icon: '\u{1F3C7}', gradient: 'from-yellow-400 to-amber-400',   ring: 'ring-yellow-300',  bg: 'bg-yellow-50 dark:bg-yellow-950/30',   text: 'text-yellow-700 dark:text-yellow-300' },
    diamond: { label: 'Diamante', icon: '\u{1F48E}', gradient: 'from-maya-blue to-indigo-400',   ring: 'ring-maya-blue/50',bg: 'bg-sky-50 dark:bg-sky-950/30',         text: 'text-sky-700 dark:text-sky-300' },
  }
  const level = levelConfig[doador.level] ?? levelConfig.bronze

  const campaignsData = doadorCampaigns
    .map(donation => ({ donation, campaign: getCampaignById(donation.campaignId ?? '') }))
    .filter(item => item.campaign)

  const firstName = doador.name.split(' ')[0]
  const initials = doador.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const memberSince = new Date(doador.firstDonation).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#F5F2EF] dark:bg-gray-950">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl text-maya-brown dark:text-white">Sair da conta</h3>
              <button onClick={() => setShowLogoutModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-maya-brown/40 hover:text-maya-brown dark:text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-maya-brown/60 dark:text-gray-400 text-sm mb-6">Tem certeza que deseja sair da sua conta?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-maya-brown dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancelar
              </button>
              <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Avatar + Info */}
            <div className="flex items-center gap-5">
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-white font-bold text-xl tracking-tight">{initials}</span>
                <div className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-gray-900 rounded-lg px-1.5 py-0.5 shadow-md border border-gray-100 dark:border-gray-700">
                  <span className="text-xs">{level.icon}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-display font-bold text-maya-brown dark:text-white">
                    Olá, {firstName}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${level.bg} ${level.text}`}>
                    <Award size={10} />
                    {level.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-maya-brown/50 dark:text-gray-500">
                  <Calendar size={13} />
                  <span>Membro desde {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-maya-brown/60 dark:text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 dark:hover:text-red-400 transition-all text-sm font-medium"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* Navigation Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/doador/doacoes" className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-maya-green/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-maya-green/10 rounded-xl flex items-center justify-center">
                <FileText className="text-maya-green" size={20} />
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-maya-green group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <p className="font-semibold text-maya-brown dark:text-white mb-0.5">Histórico</p>
            <p className="text-xs text-maya-brown/50 dark:text-gray-500">Todas as suas doações</p>
          </Link>

          <Link href="/doador/assinatura" className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-maya-orange/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-maya-orange/10 rounded-xl flex items-center justify-center">
                <CreditCard className="text-maya-orange" size={20} />
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-maya-orange group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <p className="font-semibold text-maya-brown dark:text-white mb-0.5">Assinatura</p>
            <p className="text-xs text-maya-brown/50 dark:text-gray-500">Doação recorrente mensal</p>
          </Link>

          <Link href="/doador/perfil" className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-maya-sand/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-maya-sand/10 rounded-xl flex items-center justify-center">
                <Settings className="text-maya-sand" size={20} />
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-maya-sand group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <p className="font-semibold text-maya-brown dark:text-white mb-0.5">Perfil</p>
            <p className="text-xs text-maya-brown/50 dark:text-gray-500">Dados pessoais e senha</p>
          </Link>
        </div>

        {/* Subscription Card */}
        {doador.subscription && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-maya-green/10 rounded-lg flex items-center justify-center">
                  <Heart className="text-maya-green" size={16} />
                </div>
                <h3 className="font-display font-semibold text-maya-brown dark:text-white">Doação Mensal</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                doador.subscription.status === 'active'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : doador.subscription.status === 'paused'
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {doador.subscription.status === 'active' ? '\u25CF Ativa' :
                 doador.subscription.status === 'paused' ? '\u23F8 Pausada' : '\u25CB Cancelada'}
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="text-xs text-maya-brown/50 dark:text-gray-500 mb-1 uppercase tracking-wide">Valor</p>
                  <p className="text-xl font-bold text-maya-brown dark:text-white">
                    R$ {doador.subscription.amount}<span className="text-sm font-normal text-maya-brown/50 dark:text-gray-500">/mês</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-maya-brown/50 dark:text-gray-500 mb-1 uppercase tracking-wide">Próx. Cobrança</p>
                  <p className="text-base font-semibold text-maya-brown dark:text-white">
                    {new Date(doador.subscription.nextBillingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-maya-brown/50 dark:text-gray-500 mb-1 uppercase tracking-wide">Pagamento</p>
                  <p className="text-base font-semibold text-maya-brown dark:text-white">
                    {doador.subscription.paymentMethod}
                  </p>
                </div>
              </div>
              <Link
                href="/doador/assinatura"
                className="inline-flex items-center gap-2 text-sm font-semibold text-maya-green hover:text-maya-green/80 transition-colors"
              >
                Gerenciar assinatura
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Campaigns */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-maya-orange/10 rounded-lg flex items-center justify-center">
                <Sparkles className="text-maya-orange" size={16} />
              </div>
              <h3 className="font-display font-semibold text-maya-brown dark:text-white">Campanhas Apoiadas</h3>
            </div>
            <Link href="/campanhas" className="text-xs font-semibold text-maya-green hover:text-maya-green/80 transition-colors flex items-center gap-1">
              Ver todas <ChevronRight size={13} />
            </Link>
          </div>

          {campaignsData.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {campaignsData.map(({ donation, campaign }) => {
                if (!campaign) return null
                const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)
                return (
                  <div key={donation.id} className="flex gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link href={`/campanhas/${campaign.id}`} className="font-semibold text-sm text-maya-brown dark:text-white hover:text-maya-green transition-colors truncate">
                          {campaign.title}
                        </Link>
                        <span className="text-sm font-bold text-maya-green whitespace-nowrap">
                          R$ {donation.amount.toLocaleString('pt-BR')}
                          <span className="text-xs font-normal text-maya-brown/40 dark:text-gray-500 ml-0.5">{donation.type === 'monthly' ? '/mês' : ''}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-maya-green to-maya-blue h-full rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-maya-brown/50 dark:text-gray-500 tabular-nums">{progress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          donation.type === 'monthly' ? 'bg-maya-green/10 text-maya-green' : 'bg-maya-blue/10 text-maya-blue'
                        }`}>
                          {donation.type === 'monthly' ? 'Mensal' : '�snica'}
                        </span>
                        {donation.type === 'monthly' && donation.status === 'completed' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">Ativa</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {/* Summary footer */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-maya-brown/60 dark:text-gray-400">
                    <TrendingUp size={14} className="text-maya-green" />
                    <span><strong className="text-maya-brown dark:text-white">{campaignsData.length}</strong> campanhas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-maya-brown/60 dark:text-gray-400">
                    <Heart size={14} className="text-maya-orange" />
                    <span><strong className="text-maya-brown dark:text-white">{doadorCampaigns.filter(d => d.type === 'monthly' && d.status === 'completed').length}</strong> ativas</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-14 h-14 bg-maya-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="text-maya-orange/50" size={24} />
              </div>
              <p className="font-semibold text-maya-brown dark:text-white mb-1">Nenhuma campanha ainda</p>
              <p className="text-sm text-maya-brown/50 dark:text-gray-500 mb-5">Escolha uma causa e faça parte da mudança.</p>
              <Link href="/campanhas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-maya-orange hover:bg-maya-orange/90 text-white rounded-xl text-sm font-semibold transition-colors">
                <Target size={16} />
                Explorar Campanhas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

