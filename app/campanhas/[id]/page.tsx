'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCampaignDaysLeft } from '@/data/campaigns'
import { useCampaigns } from '@/hooks/useCampaigns'
import { createClient } from '@/lib/supabase'
import { ArrowLeft,
  Heart,
  Calendar,
  Target,
  Check,
  TrendingUp,
  Users,
  Share2,
  AlertCircle,
  Sparkles,
  ClipboardList,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react'

type DonationType = 'single' | 'monthly'
type ActiveTab = 'donate' | 'register'

const presetAmounts = [25, 50, 100, 250, 500]

export default function CampanhaDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const { getCampaignById, isLoading } = useCampaigns()
  const campaign = getCampaignById(campaignId)

  const [donationType, setDonationType] = useState<DonationType>('single')
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donationError, setDonationError] = useState('')
  const [activeTab, setActiveTab] = useState<ActiveTab>('donate')

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    petName: '',
    petType: 'cachorro',
    reason: ''
  })
  const [regSubmitted, setRegSubmitted] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setRegError('')

    const supabase = createClient()
    const { error } = await supabase.from('camp_registrations').insert({
      campaign_id: campaignId,
      campaign_title: campaign?.title ?? '',
      nome: regForm.name,
      email: regForm.email,
      telefone: regForm.phone,
      cpf: regForm.cpf || null,
      endereco: regForm.address || null,
      nome_pet: regForm.petName || null,
      tipo_pet: regForm.petType || null,
      motivo: regForm.reason,
    })

    if (error) {
      setRegError('Erro ao enviar inscrição. Tente novamente.')
      setRegLoading(false)
      return
    }

    setRegSubmitted(true)
    setRegLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-maya-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-maya-brown/60 dark:text-gray-400">Carregando campanha...</p>
        </div>
      </div>
    )
  }

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

  const daysLeft = getCampaignDaysLeft(campaign)

  const handleDonation = async () => {
    setIsSubmitting(true)
    setDonationError('')

    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedAmount

      if (isNaN(amount) || amount < 5) {
        setDonationError('Por favor, insira um valor válido (mínimo R$ 5)')
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          donationType,
          campaignId: campaign.id,
          campaignName: campaign.title
        }),
      })

      const { checkoutUrl, error } = await response.json()

      if (error) {
        setDonationError(error)
        setIsSubmitting(false)
        return
      }

      // Redirect to PagBank hosted checkout
      window.location.href = checkoutUrl
    } catch {
      setDonationError('Erro ao processar doação. Tente novamente.')
    }

    setIsSubmitting(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: campaign.title, text: campaign.description, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
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

            {/* Registration Section - only for campaigns that allow it */}
            {campaign.allowsRegistration && campaign.registrationInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <ClipboardList className="w-8 h-8 text-maya-blue" />
                  <h3 className="font-display text-2xl text-maya-brown dark:text-white">
                    Inscrição para Beneficiários
                  </h3>
                </div>
                <p className="text-maya-brown/80 dark:text-gray-300 mb-6">
                  {campaign.registrationInfo.description}
                </p>

                {/* Requirements */}
                <h4 className="font-bold text-maya-brown dark:text-white mb-3">
                  Requisitos para inscrição:
                </h4>
                <ul className="space-y-2 mb-6">
                  {campaign.registrationInfo.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-maya-blue flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-maya-brown/80 dark:text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>

                {/* Registration Form */}
                {regSubmitted ? (
                  <div className="bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl p-6 text-center">
                    <Check className="w-12 h-12 text-maya-green mx-auto mb-3" />
                    <h4 className="font-display text-xl text-maya-brown dark:text-white mb-2">
                      Inscrição enviada!
                    </h4>
                    <p className="text-maya-brown/70 dark:text-gray-300 text-sm">
                      Recebemos sua inscrição. Entraremos em contato pelo e-mail ou telefone informado
                      para confirmar os próximos passos.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          Nome completo *
                        </label>
                        <div className="relative">
                          <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maya-brown/40" />
                          <input
                            type="text"
                            required
                            value={regForm.name}
                            onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                            placeholder="Seu nome completo"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          CPF *
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.cpf}
                          onChange={(e) => setRegForm({...regForm, cpf: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          E-mail *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maya-brown/40" />
                          <input
                            type="email"
                            required
                            value={regForm.email}
                            onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          Telefone/WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maya-brown/40" />
                          <input
                            type="tel"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                        Endereço *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-maya-brown/40" />
                        <input
                          type="text"
                          required
                          value={regForm.address}
                          onChange={(e) => setRegForm({...regForm, address: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                          placeholder="Rua, número, bairro, cidade"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          Nome do pet
                        </label>
                        <input
                          type="text"
                          value={regForm.petName}
                          onChange={(e) => setRegForm({...regForm, petName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                          placeholder="Nome do animal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                          Tipo de animal
                        </label>
                        <select
                          value={regForm.petType}
                          onChange={(e) => setRegForm({...regForm, petType: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                        >
                          <option value="cachorro">Cachorro</option>
                          <option value="gato">Gato</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-1">
                        Por que deseja participar? *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={regForm.reason}
                        onChange={(e) => setRegForm({...regForm, reason: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-maya-blue focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700 resize-none"
                        placeholder="Conte brevemente sua situação e por que precisa deste benefício..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full px-6 py-4 bg-maya-blue text-white font-bold rounded-2xl hover:bg-maya-blue/90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {regLoading ? (
                        'Enviando...'
                      ) : (
                        <>
                          <ClipboardList size={20} />
                          Enviar Inscrição
                        </>
                      )}
                    </button>

                    {regError && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        {regError}
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6">
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
                  disabled={isSubmitting}
                  className="btn-primary w-full mb-3 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processando...' : 'Contribuir Agora'}
                </button>

                {donationError && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {donationError}
                  </div>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full px-6 py-3 rounded-xl border-2 border-maya-green text-maya-green hover:bg-maya-green hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  {linkCopied ? 'Link copiado!' : 'Compartilhar Campanha'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-maya-beige dark:bg-gray-800 rounded-2xl p-6 text-center">
                <Check className="w-8 h-8 text-maya-green mx-auto mb-2" />
                <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                  <strong>100% seguro</strong><br />
                  Todas as doações são processadas com segurança pelo PagBank
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
