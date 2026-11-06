'use client'

import Link from 'next/link'
import { Heart, DollarSign, Users, Home } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function HowToHelp() {
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 })
  return (
    <section className="py-20 bg-maya-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Como Ajudar</h2>
          <p className="section-subtitle">
            Existem várias formas de fazer a diferença na vida dos nossos animais
          </p>
        </div>

        {/* Help Options */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Doação Única */}
          <Link href="/doacoes" className={`card group card-hover-lift card-hover-glow transition-all duration-500 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-1`}>
            {/* Os quadradinhos usavam a cor clara da marca com ícone branco
                (1,9 a 3,8:1). Agora usam a mesma matiz escurecida com ícone
                creme, e o link embaixo segue a mesma cor. */}
            <div className="w-20 h-20 bg-maya-green-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-green-dark/85 transition-colors icon-hover-bounce">
              <Heart className="w-10 h-10 text-maya-cream" />
            </div>
            <h3 className="text-xl mb-3 text-maya-brown">
              Doação Única
            </h3>
            <p className="text-maya-brown mb-4">
              Faça uma doação pontual e ajude no resgate e cuidado dos animais
            </p>
            <span className="text-maya-green-dark font-semibold group-hover:underline">
              Doar Agora →
            </span>
          </Link>

          {/* Doação Mensal */}
          <Link href="/doacoes?type=monthly" className={`card group card-hover-lift card-hover-glow transition-all duration-500 text-center relative overflow-hidden scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-2`}>
            <div className="absolute top-0 right-0 bg-maya-blue-dark text-maya-cream text-xs px-3 py-1 rounded-bl-xl font-semibold">
              Recomendado
            </div>
            <div className="w-20 h-20 bg-maya-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-blue-dark/85 transition-colors icon-hover-bounce">
              <DollarSign className="w-10 h-10 text-maya-cream" />
            </div>
            <h3 className="text-xl mb-3 text-maya-brown">
              Doação Mensal
            </h3>
            <p className="text-maya-brown mb-4">
              Torne-se um apoiador recorrente e garanta sustentabilidade ao projeto
            </p>
            <span className="text-maya-blue-dark font-semibold group-hover:underline">
              Ser Apoiador →
            </span>
          </Link>

          {/* Lar Temporário */}
          <Link href="/contato" className={`card group card-hover-lift card-hover-glow transition-all duration-500 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-3`}>
            <div className="w-20 h-20 bg-maya-orange-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-orange-dark/85 transition-colors icon-hover-bounce">
              <Home className="w-10 h-10 text-maya-cream" />
            </div>
            <h3 className="text-xl mb-3 text-maya-brown">
              Lar Temporário
            </h3>
            <p className="text-maya-brown mb-4">
              Ofereça um lar temporário para um animal até que ele encontre uma família
            </p>
            <span className="text-maya-orange-dark font-semibold group-hover:underline">
              Quero Ajudar →
            </span>
          </Link>

          {/* Voluntariado */}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=Ol%C3%A1!%20Gostaria%20de%20ser%20volunt%C3%A1rio%20no%20Projeto%20Maya`} target="_blank" rel="noopener noreferrer" className={`card group card-hover-lift card-hover-glow transition-all duration-500 text-center scroll-hidden scroll-up ${cardsVisible ? 'scroll-visible' : ''} stagger-4`}>
            <div className="w-20 h-20 bg-maya-sand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-maya-sand-dark/85 transition-colors icon-hover-bounce">
              <Users className="w-10 h-10 text-maya-cream" />
            </div>
            <h3 className="text-xl mb-3 text-maya-brown">
              Voluntariado
            </h3>
            <p className="text-maya-brown mb-4">
              Doe seu tempo e talento para ajudar nossos animais
            </p>
            <span className="text-maya-sand-dark font-semibold group-hover:underline">
              Ser Voluntário →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
