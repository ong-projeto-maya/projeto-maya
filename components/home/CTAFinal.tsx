import Link from 'next/link'
import { Heart, PawPrint, Sparkles } from 'lucide-react'

export default function CTAFinal() {
  return (
    <section className="py-20 bg-gradient-to-br from-maya-green to-maya-blue text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 animate-float-slow">
        <PawPrint size={150} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 animate-float-delay">
        <Heart size={120} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse-glow">
              <Heart className="w-12 h-12 text-white fill-current" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-display mb-6">
            Sua doação<br />
            <span className="text-maya-blue">salva vidas.</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Cada contribuição, por menor que seja, faz uma diferença enorme 
            na vida de um animal que precisa de ajuda.
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">R$ 25</div>
              <div className="text-white/80 text-sm">
                Alimenta um animal por 1 semana
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">R$ 50</div>
              <div className="text-white/80 text-sm">
                Vacinas e vermífugos
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">R$ 100</div>
              <div className="text-white/80 text-sm">
                Consulta veterinária completa
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/doacoes" 
              className="bg-white text-maya-green hover:bg-maya-beige font-semibold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center gap-2"
            >
              <Heart size={20} />
              Fazer uma Doação
            </Link>
            <Link 
              href="/adocao" 
              className="bg-maya-blue hover:bg-opacity-90 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center gap-2"
            >
              <PawPrint size={20} />
              Conhecer os Animais
            </Link>
          </div>

          {/* Extra Info */}
          <p className="mt-8 text-white/70 text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Todas as doações são usadas 100% para o bem-estar dos animais
          </p>
        </div>
      </div>
    </section>
  )
}
