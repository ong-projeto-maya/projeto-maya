'use client'

import Image from 'next/image'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function About() {
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation({ threshold: 0.15 })

  return (
    <section id="sobre" className="py-20 bg-maya-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Sobre o Projeto Maya</h2>
          <p className="section-subtitle">
            Uma ONG dedicada ao resgate, cuidado e adoção responsável de animais em situação de vulnerabilidade
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-maya-beige rounded-3xl p-8 md:p-12">
            <h3 className="font-display text-3xl mb-8 text-maya-brown text-center">
              prazer, maya.
            </h3>
            
            <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Foto da Maya */}
              <div className={`relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1 scroll-hidden scroll-left ${storyVisible ? 'scroll-visible' : ''}`}>
                <Image
                  src="/images/maya-foto.jpg"
                  alt="Maya - A cachorrinha que inspirou o projeto"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-right">
                  <p className="text-white font-display text-xl">
                    Maya - 2018
                  </p>
                  <p className="text-white/90 text-sm">
                    A estrelinha que inspirou tudo isso
                  </p>
                </div>
              </div>

              {/* Texto da História */}
              <div className={`space-y-4 text-maya-brown leading-relaxed order-1 lg:order-2 scroll-hidden scroll-right ${storyVisible ? 'scroll-visible' : ''} stagger-2`}>
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
                {/* Tinha `dark:text-white` aqui. Como o card é bege, no modo
                    escuro virava branco sobre bege claro: 1,48:1. */}
                <p className="text-lg font-semibold text-maya-brown text-center mt-6 pt-4 border-t border-maya-brown/20">
                  Nosso trabalho não tem fins lucrativos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
