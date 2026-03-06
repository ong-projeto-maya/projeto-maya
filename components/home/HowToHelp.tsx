import Link from 'next/link'
import { Heart, DollarSign, Users, Gift } from 'lucide-react'

export default function HowToHelp() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Como Ajudar</h2>
          <p className="section-subtitle">
            Existem várias formas de fazer a diferença na vida dos nossos animais
          </p>
        </div>

        {/* Help Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Doação Única */}
          <Link href="/doacoes" className="card group hover:scale-105 transition-all duration-300 text-center">
            <div className="w-20 h-20 bg-maya-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-green/80 transition-colors">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-xl mb-3 text-maya-brown">
              Doação Única
            </h3>
            <p className="text-maya-brown/70 mb-4">
              Faça uma doação pontual e ajude no resgate e cuidado dos animais
            </p>
            <span className="text-maya-green font-semibold group-hover:underline">
              Doar Agora →
            </span>
          </Link>

          {/* Doação Mensal */}
          <Link href="/doacoes?type=monthly" className="card group hover:scale-105 transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-maya-blue text-white text-xs px-3 py-1 rounded-bl-xl font-semibold">
              Recomendado
            </div>
            <div className="w-20 h-20 bg-maya-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-blue/80 transition-colors">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-xl mb-3 text-maya-brown">
              Doação Mensal
            </h3>
            <p className="text-maya-brown/70 mb-4">
              Torne-se um apoiador recorrente e garanta sustentabilidade ao projeto
            </p>
            <span className="text-maya-blue font-semibold group-hover:underline">
              Ser Apoiador →
            </span>
          </Link>

          {/* Apadrinhamento */}
          <Link href="/adocao" className="card group hover:scale-105 transition-all duration-300 text-center">
            <div className="w-20 h-20 bg-maya-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-orange/80 transition-colors">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-xl mb-3 text-maya-brown">
              Apadrinhamento
            </h3>
            <p className="text-maya-brown/70 mb-4">
              Apadrinhe um animal específico e acompanhe sua jornada
            </p>
            <span className="text-maya-orange font-semibold group-hover:underline">
              Apadrinhar →
            </span>
          </Link>

          {/* Voluntariado */}
          <a href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20ser%20voluntário%20no%20Projeto%20Maya" target="_blank" rel="noopener noreferrer" className="card group hover:scale-105 transition-all duration-300 text-center">
            <div className="w-20 h-20 bg-maya-sand rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-sand/80 transition-colors">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-xl mb-3 text-maya-brown">
              Voluntariado
            </h3>
            <p className="text-maya-brown/70 mb-4">
              Doe seu tempo e talento para ajudar nossos animais
            </p>
            <span className="text-maya-sand font-semibold group-hover:underline">
              Ser Voluntário →
            </span>
          </a>
        </div>

        {/* Donation Goal Progress */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-maya-beige rounded-3xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-2xl text-maya-brown">
                Meta Mensal de Doações
              </h3>
              <span className="text-maya-green font-bold text-2xl">65%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-maya-green to-maya-blue h-full rounded-full transition-all duration-500"
                style={{ width: '65%' }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-maya-brown/70">
              <span>R$ 6.500 arrecadados</span>
              <span>Meta: R$ 10.000</span>
            </div>

            <p className="text-center mt-6 text-maya-brown/80">
              Sua doação nos ajuda a pagar veterinários, ração, medicamentos e abrigo para os animais
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
