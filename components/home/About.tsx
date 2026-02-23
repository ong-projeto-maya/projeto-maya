import { Heart, Target, Users, TrendingUp } from 'lucide-react'

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
            <div className="w-16 h-16 bg-maya-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-maya-olive" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-maya-brown">Nossa Missão</h3>
            <p className="text-maya-brown/70">
              Resgatar, reabilitar e encontrar lares amorosos para animais abandonados
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-maya-blue" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-maya-brown">Nosso Objetivo</h3>
            <p className="text-maya-brown/70">
              Promover a adoção consciente e combater o abandono animal
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-maya-olive" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-maya-brown">Comunidade</h3>
            <p className="text-maya-brown/70">
              Somos uma rede de voluntários, parceiros e apoiadores comprometidos
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-maya-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-maya-blue" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-maya-brown">Impacto</h3>
            <p className="text-maya-brown/70">
              Cada adoção transforma duas vidas: a do animal e a do adotante
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-maya-beige rounded-3xl p-8 md:p-12">
            <h3 className="font-display font-bold text-3xl mb-6 text-maya-brown text-center">
              Nossa História
            </h3>
            <div className="space-y-4 text-maya-brown/80 leading-relaxed">
              <p>
                O Projeto Maya nasceu do amor incondicional de um grupo de voluntários que 
                não conseguia ficar indiferente ao sofrimento dos animais de rua. O que começou 
                com o resgate de alguns cachorros e gatos, cresceu e se tornou uma ONG estruturada 
                e comprometida.
              </p>
              <p>
                Hoje, trabalhamos incansavelmente para garantir que cada animal resgatado receba 
                cuidados veterinários, alimentação adequada, carinho e, principalmente, uma 
                segunda chance de encontrar uma família amorosa.
              </p>
              <p className="font-semibold text-maya-olive text-lg text-center mt-8">
                Acreditamos que todo animal merece amor, respeito e um lar para chamar de seu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
