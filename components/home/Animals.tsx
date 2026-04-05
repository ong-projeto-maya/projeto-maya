'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAnimals } from '@/hooks/useAnimals'
import { ArrowRight, Heart, Dog, Cat } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Animals() {
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 })
  const { animals, isLoading } = useAnimals()
  // Show only first 6 animals on home page
  const featuredAnimals = animals.slice(0, 6)

  return (
    <section className="py-20 bg-maya-beige">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Animais para Adoção</h2>
          <p className="section-subtitle">
            Conheça alguns dos nossos amiguinhos que estão esperando por uma família
          </p>
        </div>

        {/* Animals Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ))
          ) : featuredAnimals.map((animal, index) => (
            <div key={animal.id} className={`card group card-hover-lift card-hover-glow scroll-hidden scroll-up ${gridVisible ? 'scroll-visible' : ''} stagger-${index + 1}`}>
              {/* Image */}
              <div className="relative h-64 mb-4 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  priority={false}
                />
                {/* Badges do Brandbook */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {animal.isAdopted && (
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/badge-adotado.png"
                        alt="Adotado"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  )}
                  {animal.isRescued && !animal.isAdopted && (
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/badge-novo-resgatado.png"
                        alt="Resgatado"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  )}
                  {animal.isPuppy && !animal.isAdopted && !animal.isRescued && (
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/badge-novo-resgatado.png"
                        alt="Novo/Filhote"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  )}
                  {animal.isMixed && !animal.isAdopted && (
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/badge-sem-raca.png"
                        alt="Sem Raça Definida"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  )}
                  {!animal.isAdopted && !animal.isRescued && !animal.isPuppy && !animal.isMixed && (
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/badge-quer-mea-adotar.png"
                        alt="Quer me adotar?"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display text-2xl text-maya-brown mb-1">
                    {animal.name}
                  </h3>
                  <p className="text-maya-brown/60 text-sm flex items-center gap-1">
                    {animal.type === 'dog' ? <Dog size={16} /> : <Cat size={16} />}
                    {animal.age} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                  </p>
                </div>
                <Heart className="w-6 h-6 text-maya-green" />
              </div>

              {/* Temperament */}
              <div className="flex flex-wrap gap-2 mb-4">
                {animal.temperament.slice(0, 3).map((trait) => (
                  <span
                    key={trait}
                    className="text-xs bg-maya-green/10 text-maya-green px-3 py-1 rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Story Preview */}
              <p className="text-maya-brown/70 text-sm mb-4 line-clamp-2">
                {animal.story}
              </p>

              {/* CTA Button */}
              <Link
                href={`/adocao/${animal.id}`}
                className="inline-flex items-center gap-2 text-maya-green hover:text-maya-blue font-semibold transition-colors"
              >
                Conhecer {animal.name}
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/adocao" className="btn-primary inline-flex items-center gap-2">
            Ver Todos os Animais
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
