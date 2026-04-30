import ComingSoon from '@/components/ComingSoon'
import { Users } from 'lucide-react'

export default function QuemSomosPage() {
  return (
    <ComingSoon
      title="Quem Somos"
      description="Estamos preparando uma página especial para contar a história do Projeto Maya — nossa missão, equipe e o impacto que já geramos juntos. Em breve!"
      icon={Users}
      backHref="/"
      backLabel="Voltar ao início"
      features={[
        'História e origem do Projeto Maya',
        'Conheça nossa equipe e voluntários',
        'Impacto em números: resgates, adoções e campanhas',
        'Transparência: como usamos cada doação',
        'Parceiros e apoiadores da causa',
      ]}
    />
  )
}

// Conteúdo completo preservado abaixo — será restaurado em breve
/*
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Target, Users, TrendingUp, PawPrint, Star, Shield, HandHeart, ArrowRight } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

function CountUpNumber({ target, label }: { target: number; label: string }) {
  const { count, ref } = useCountUp(target, 2000)
  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-5xl font-display text-white mb-2">{count}+</div>
      <div className="text-sm sm:text-base text-white/80">{label}</div>
    </div>
  )
}

function QuemSomosPageFull() {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-maya-blue py-20">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 text-white/80 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-white mb-4">
            Quem Somos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Conheça a história, a missão e as pessoas por trás do Projeto Maya
          </p>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-4">Nosso Propósito</h2>
          <p className="section-subtitle text-center mb-16">
            O que nos move todos os dias
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 bg-maya-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-maya-green" />
              </div>
              <h3 className="font-display text-xl mb-2 text-maya-brown dark:text-white">Nossa Missão</h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Resgatar, reabilitar e encontrar lares amorosos para animais abandonados e em situação de vulnerabilidade
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-maya-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-maya-blue" />
              </div>
              <h3 className="font-display text-xl mb-2 text-maya-brown dark:text-white">Nossa Visão</h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Um mundo onde nenhum animal sofra abandono e todos tenham acesso a cuidado, amor e um lar
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-maya-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-maya-orange" />
              </div>
              <h3 className="font-display text-xl mb-2 text-maya-brown dark:text-white">Nossos Valores</h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Transparência, empatia, respeito à vida e compromisso com o bem-estar animal
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-maya-sand/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-maya-sand" />
              </div>
              <h3 className="font-display text-xl mb-2 text-maya-brown dark:text-white">Nosso Impacto</h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Cada adoção transforma duas vidas: a do animal e a do adotante
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que fazemos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-4">O que Fazemos</h2>
          <p className="section-subtitle text-center mb-16">
            Nossas áreas de atuação
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-maya-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PawPrint className="w-10 h-10 text-maya-green" />
              </div>
              <h3 className="font-display text-2xl text-maya-brown dark:text-white mb-3">
                Resgate e Reabilitação
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Resgatamos animais em situação de risco, maus-tratos ou abandono.
                Oferecemos tratamento veterinário, vacinas, castração e todo o cuidado
                necessário para a recuperação completa.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-maya-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHeart className="w-10 h-10 text-maya-blue" />
              </div>
              <h3 className="font-display text-2xl text-maya-brown dark:text-white mb-3">
                Adoção Responsável
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Fazemos a ponte entre os animais resgatados e famílias preparadas para
                recebê-los. Todo o processo é acompanhado para garantir o bem-estar
                do pet e do adotante.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-maya-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-maya-orange" />
              </div>
              <h3 className="font-display text-2xl text-maya-brown dark:text-white mb-3">
                Campanhas Sociais
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Realizamos campanhas de castração solidária, distribuição de ração,
                atendimento veterinário gratuito e conscientização para pessoas
                em situação de vulnerabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-20 bg-gradient-to-br from-maya-green to-maya-blue">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-white text-center mb-12">
            Nosso Impacto em Números
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto text-center">
            <CountUpNumber target={347} label="Animais Resgatados" />
            <CountUpNumber target={289} label="Adoções Realizadas" />
            <CountUpNumber target={52} label="Voluntários Ativos" />
            <CountUpNumber target={6} label="Campanhas Ativas" />
          </div>
        </div>
      </section>

      {/* Transparência */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Shield className="w-12 h-12 text-maya-green mx-auto mb-4" />
          <h2 className="font-display text-3xl text-maya-brown dark:text-white mb-4">
            Compromisso com a Transparência
          </h2>
          <p className="text-maya-brown/70 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Nosso trabalho não tem fins lucrativos. Todas as doações são destinadas
            integralmente ao cuidado dos animais — alimentação, vacinas, castrações,
            tratamentos e infraestrutura do abrigo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/campanhas"
              className="btn-primary inline-flex items-center gap-2 justify-center"
            >
              <Target size={20} />
              Ver Campanhas
            </Link>
            <Link
              href="/doacoes"
              className="btn-secondary inline-flex items-center gap-2 justify-center"
            >
              <Heart size={20} />
              Fazer uma Doação
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl text-maya-brown dark:text-white font-semibold hover:bg-maya-beige dark:hover:bg-gray-700 transition-colors"
            >
              Fale Conosco
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
*/
