import Link from 'next/link'
import { Heart, TrendingUp, Award, BarChart, DollarSign, PawPrint, CheckCircle } from 'lucide-react'

export default function DoadorCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-maya-olive to-maya-olive-light text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 mx-auto mb-6 fill-white" />
            <h2 className="section-title text-white mb-4">
              Seja um Doador Consciente
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Crie sua conta de doador e acompanhe cada passo da transformação que você proporciona
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                Histórico Completo
              </h3>
              <p className="text-white/80 text-sm">
                Veja todas as suas doações e baixe recibos para declaração de IR
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                Sistema de Níveis
              </h3>
              <p className="text-white/80 text-sm">
                Ganhe badges e suba de nível conforme suas contribuições crescem
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                Veja Seu Impacto
              </h3>
              <p className="text-white/80 text-sm">
                Conheça os animais que você ajudou e o impacto real das suas doações
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <p className="text-4xl font-bold mb-2">850+</p>
                <p className="text-white/80 text-sm">Doadores Ativos</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6" />
                </div>
                <p className="text-4xl font-bold mb-2">R$ 125k</p>
                <p className="text-white/80 text-sm">Doado em 2026</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <PawPrint className="w-6 h-6" />
                </div>
                <p className="text-4xl font-bold mb-2">450+</p>
                <p className="text-white/80 text-sm">Animais Ajudados</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-4xl font-bold mb-2">98%</p>
                <p className="text-white/80 text-sm">Transparência Total</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/doador/registro"
                className="bg-white text-maya-olive px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <Heart size={20} className="fill-maya-olive" />
                Criar Conta de Doador
              </Link>
              <Link
                href="/doador/login"
                className="bg-white/10 backdrop-blur border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors"
              >
                Já sou doador - Entrar
              </Link>
            </div>
            <p className="text-white/70 text-sm flex items-center justify-center gap-2">
              <CheckCircle size={14} />
              Gratuito • Sem mensalidades • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
