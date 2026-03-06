import { Heart, Target, Users, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Sobre o Projeto Maya</h2>
          <p className="section-subtitle">
            Uma ONG dedicada ao resgate, cuidado e adoção responsável de animais em situação de vulnerabilidade
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-maya-green" />
            </div>
            <h3 className="font-display text-xl mb-2 text-maya-brown">Nossa Missão</h3>
            <p className="text-maya-brown/70">
              Resgatar, reabilitar e encontrar lares amorosos para animais abandonados
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-maya-blue" />
            </div>
            <h3 className="font-display text-xl mb-2 text-maya-brown">Nosso Objetivo</h3>
            <p className="text-maya-brown/70">
              Promover a adoção consciente e combater o abandono animal
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-maya-orange" />
            </div>
            <h3 className="font-display text-xl mb-2 text-maya-brown">Comunidade</h3>
            <p className="text-maya-brown/70">
              Somos uma rede de voluntários, parceiros e apoiadores comprometidos
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-sand/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-maya-sand" />
            </div>
            <h3 className="font-display text-xl mb-2 text-maya-brown">Impacto</h3>
            <p className="text-maya-brown/70">
              Cada adoção transforma duas vidas: a do animal e a do adotante
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-maya-beige rounded-3xl p-8 md:p-12">
            <h3 className="font-display text-3xl mb-8 text-maya-brown text-center">
              prazer, maya. 🐾
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Foto da Maya */}
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
                <Image
                  src="/images/maya-foto.jpg"
                  alt="Maya - A cachorrinha que inspirou o projeto"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-display text-xl">
                    Maya ⭐ 2018
                  </p>
                  <p className="text-white/90 text-sm">
                    A estrelinha que inspirou tudo isso
                  </p>
                </div>
              </div>

              {/* Texto da História */}
              <div className="space-y-4 text-maya-brown/80 leading-relaxed order-1 lg:order-2">
                <p>
                  Tudo começou com ela. Uma cachorrinha adotada em 2018, que acabou virando 
                  estrelinha depois de alguns meses... mas foi tempo de sobra pra conquistar 
                  muitos corações.
                </p>
                <p>
                  O Projeto Maya nasce daí. Desse amor incondicional. Do termo de origem grega 
                  <strong> ágape</strong>: que prioriza o bem-estar do outro sem esperar nada em troca.
                </p>
                <p>
                  Aqui, lutas individuais se unificaram e propósitos em comum se fortaleceram. 
                  Existimos pela diminuição de cães e gatos nas ruas. Através da conscientização 
                  e da adoção responsável, conseguimos fazer com que esses animais encontrem lares, 
                  onde serão amados e protegidos.
                </p>
                <p className="text-sm italic text-maya-brown/60 pt-4 border-t border-maya-brown/20">
                  Nosso trabalho não tem fins lucrativos.
                </p>
                <p className="font-bold text-maya-green text-xl text-center mt-8 font-display">
                  nós acreditamos que<br />o amor transforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
