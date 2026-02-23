'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { animals } from '@/data/animals'
import { Heart, Filter } from 'lucide-react'

type FilterType = 'all' | 'dog' | 'cat' | 'puppy'

export default function AdocaoPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredAnimals = animals.filter((animal) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'puppy') return animal.isPuppy
    return animal.type === activeFilter
  })

  return (
    <div className="min-h-screen bg-maya-beige py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown mb-4">
            Animais para Adoção
          </h1>
          <p className="text-xl text-maya-brown/70 max-w-2xl mx-auto">
            Conheça nossos amiguinhos que estão esperando por um lar cheio de amor
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-maya-olive" size={24} />
            <h2 className="font-display font-bold text-xl text-maya-brown">Filtrar por:</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-maya-olive text-white shadow-lg'
                  : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('dog')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === 'dog'
                  ? 'bg-maya-olive text-white shadow-lg'
                  : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
              }`}
            >
              🐕 Cães
            </button>
            <button
              onClick={() => setActiveFilter('cat')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === 'cat'
                  ? 'bg-maya-olive text-white shadow-lg'
                  : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
              }`}
            >
              🐈 Gatos
            </button>
            <button
              onClick={() => setActiveFilter('puppy')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === 'puppy'
                  ? 'bg-maya-olive text-white shadow-lg'
                  : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
              }`}
            >
              ✨ Filhotes
            </button>
          </div>

          <div className="mt-4 text-maya-brown/60 text-sm">
            {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className="card group hover:scale-105 transition-transform duration-300">
              {/* Image */}
              <div className="relative h-64 mb-4 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
                {animal.isPuppy && (
                  <span className="absolute top-4 left-4 bg-maya-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Filhote
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display font-bold text-2xl text-maya-brown mb-1">
                    {animal.name}
                  </h3>
                  <p className="text-maya-brown/60 text-sm">
                    {animal.type === 'dog' ? '🐕' : '🐈'} {animal.age} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                  </p>
                  <p className="text-maya-brown/60 text-xs mt-1">
                    Porte: {animal.size === 'small' ? 'Pequeno' : animal.size === 'medium' ? 'Médio' : 'Grande'}
                  </p>
                </div>
                <Heart className="w-6 h-6 text-maya-olive" />
              </div>

              {/* Temperament */}
              <div className="flex flex-wrap gap-2 mb-4">
                {animal.temperament.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs bg-maya-olive/10 text-maya-olive px-3 py-1 rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Story Preview */}
              <p className="text-maya-brown/70 text-sm mb-4 line-clamp-3">
                {animal.story}
              </p>

              {/* CTA Button */}
              <Link
                href={`/adocao/${animal.id}`}
                className="btn-primary w-full text-center inline-block"
              >
                Conhecer {animal.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnimals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="font-display font-bold text-2xl text-maya-brown mb-2">
              Nenhum animal encontrado
            </h3>
            <p className="text-maya-brown/70">
              Tente ajustar os filtros para ver mais opções
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="font-display font-bold text-2xl text-maya-brown mb-4 text-center">
            Como funciona a adoção?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold text-maya-brown mb-2">Escolha seu amigo</h4>
              <p className="text-sm text-maya-brown/70">
                Navegue pelos perfis e encontre o pet ideal para você
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold text-maya-brown mb-2">Entre em contato</h4>
              <p className="text-sm text-maya-brown/70">
                Converse conosco pelo WhatsApp para agendar uma visita
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold text-maya-brown mb-2">Leve para casa</h4>
              <p className="text-sm text-maya-brown/70">
                Após aprovação, leve seu novo amigo para casa!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
