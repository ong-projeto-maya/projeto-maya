'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Trash2, Share2, PawPrint, Dog, Cat, ArrowRight } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { animals } from '@/data/animals'
import FavoriteButton from '@/components/FavoriteButton'
import ShareButton from '@/components/ShareButton'

export default function FavoritosPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  const favoriteAnimals = useMemo(() => {
    return animals.filter((animal) => favorites.includes(animal.id))
  }, [favorites])

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-maya-green mx-auto mb-4 fill-maya-green" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Meus Favoritos
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Animais que você salvou para adotar depois
          </p>
        </div>

        {favoriteAnimals.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
            <PawPrint className="w-20 h-20 text-maya-green/30 mx-auto mb-6" />
            <h3 className="font-display text-3xl text-maya-brown dark:text-white mb-4">
              Nenhum favorito ainda
            </h3>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Explore nossos animais disponíveis e clique no coração para salvá-los aqui
            </p>
            <Link href="/adocao" className="btn-primary inline-flex items-center gap-2">
              Ver Animais Disponíveis
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <>
            {/* Stats & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-center sm:text-left">
                <p className="text-3xl font-bold text-maya-green mb-1">
                  {favoriteAnimals.length}
                </p>
                <p className="text-maya-brown/70 dark:text-gray-300">
                  {favoriteAnimals.length === 1 ? 'Animal salvo' : 'Animais salvos'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
                      clearFavorites()
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Limpar Tudo
                </button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteAnimals.map((animal) => (
                <div 
                  key={animal.id} 
                  className="card group hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800 shadow-lg rounded-2xl relative"
                >
                  {/* Image */}
                  <div className="relative h-64 mb-4 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={animal.image}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {animal.isPuppy && (
                      <span className="absolute top-4 left-4 bg-maya-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Filhote
                      </span>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <FavoriteButton animalId={animal.id} />
                      <ShareButton 
                        title={`Conheça ${animal.name} - Projeto Maya`}
                        url={`/adocao/${animal.id}`}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-display text-2xl text-maya-brown dark:text-white mb-1">
                          {animal.name}
                        </h3>
                        <p className="text-maya-brown/60 dark:text-gray-300 text-sm flex items-center gap-1">
                          {animal.type === 'dog' ? <Dog size={14} /> : <Cat size={14} />}
                          {animal.age} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                        </p>
                      </div>
                    </div>

                    {/* Temperament */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animal.temperament.slice(0, 3).map((trait) => (
                        <span
                          key={trait}
                          className="text-xs bg-maya-green/10 text-maya-green px-3 py-1 rounded-full dark:bg-maya-green/20 dark:text-maya-green"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Story Preview */}
                    <p className="text-maya-brown/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {animal.story}
                    </p>

                    {/* CTA Button */}
                    <div className="pb-4">
                      <Link
                        href={`/adocao/${animal.id}`}
                        className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
                      >
                        Conhecer {animal.name}
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-maya-green to-maya-green rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
              <Heart className="w-16 h-16 mx-auto mb-6 fill-white" />
              <h2 className="font-display text-3xl md:text-4xl mb-4">
                Pronto para adotar?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Entre em contato conosco para agendar uma visita e conhecer pessoalmente
                {favoriteAnimals.length === 1 ? ' esse amiguinho incrível!' : ' esses amiguinhos incríveis!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contato"
                  className="bg-white text-maya-green px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Entre em Contato
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/quem-somos"
                  className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2 border-2 border-white/30"
                >
                  Quem Somos
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
