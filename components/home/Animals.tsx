import Link from 'next/link'
import Image from 'next/image'
import { animals } from '@/data/animals'
import { ArrowRight, Heart, Dog, Cat } from 'lucide-react'

export default function Animals() {
  // Show only first 6 animals on home page
  const featuredAnimals = animals.slice(0, 6)

  return (
    <section className="py-20 bg-gradient-to-b from-white to-maya-beige">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Animais para Adoção</h2>
          <p className="section-subtitle">
            Conheça alguns dos nossos amiguinhos que estão esperando por uma família
          </p>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredAnimals.map((animal) => (
            <div key={animal.id} className="card group hover:scale-105 transition-transform duration-300">
              {/* Image */}
              <div className="relative h-64 mb-4 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
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
                  <p className="text-maya-brown/60 text-sm flex items-center gap-1">
                    {animal.type === 'dog' ? <Dog size={16} /> : <Cat size={16} />}
                    {animal.age} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                  </p>
                </div>
                <Heart className="w-6 h-6 text-maya-olive" />
              </div>

              {/* Temperament */}
              <div className="flex flex-wrap gap-2 mb-4">
                {animal.temperament.slice(0, 3).map((trait) => (
                  <span
                    key={trait}
                    className="text-xs bg-maya-olive/10 text-maya-olive px-3 py-1 rounded-full"
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
                className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light font-semibold transition-colors"
              >
                Conhecer {animal.name}
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
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
