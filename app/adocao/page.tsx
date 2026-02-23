'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { animals } from '@/data/animals'
import { Heart, Filter, Search, X, Dog, Cat, Sparkles, PawPrint } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

type FilterType = 'all' | 'dog' | 'cat' | 'puppy'
type SizeFilter = 'all' | 'small' | 'medium' | 'large'
type GenderFilter = 'all' | 'male' | 'female'

export default function AdocaoPageEnhanced() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all')
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Basic filters
      if (activeFilter !== 'all') {
        if (activeFilter === 'puppy' && !animal.isPuppy) return false
        if (activeFilter !== 'puppy' && animal.type !== activeFilter) return false
      }

      // Size filter
      if (sizeFilter !== 'all' && animal.size !== sizeFilter) return false

      // Gender filter
      if (genderFilter !== 'all' && animal.gender !== genderFilter) return false

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = animal.name.toLowerCase().includes(query)
        const matchesStory = animal.story.toLowerCase().includes(query)
        const matchesTemperament = animal.temperament.some(t =>
          t.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesStory && !matchesTemperament) return false
      }

      return true
    })
  }, [activeFilter, sizeFilter, genderFilter, searchQuery])

  const clearFilters = () => {
    setActiveFilter('all')
    setSizeFilter('all')
    setGenderFilter('all')
    setSearchQuery('')
  }

  const hasActiveFilters =
    activeFilter !== 'all' ||
    sizeFilter !== 'all' ||
    genderFilter !== 'all' ||
    searchQuery !== ''

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <PawPrint className="w-16 h-16 text-maya-olive mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Animais para Adoção
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Conheça nossos amiguinhos que estão esperando por um lar cheio de amor
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, características ou temperamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-maya-olive/20 dark:border-gray-600 focus:border-maya-olive dark:focus:border-maya-olive focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400 hover:text-maya-brown dark:hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="text-maya-olive" size={24} />
              <h2 className="font-display font-bold text-xl text-maya-brown dark:text-white">Filtros</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-maya-olive dark:text-maya-olive-light font-semibold text-sm md:hidden"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-red-500 dark:text-red-400 font-semibold text-sm flex items-center gap-1"
                >
                  <X size={16} />
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Type Filter */}
            <div>
              <label className="text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2 block">
                Tipo de Animal
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-maya-olive text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveFilter('dog')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                    activeFilter === 'dog'
                      ? 'bg-maya-olive text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
                  }`}
                >
                  <Dog size={18} />
                  Cães
                </button>
                <button
                  onClick={() => setActiveFilter('cat')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                    activeFilter === 'cat'
                      ? 'bg-maya-olive text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
                  }`}
                >
                  <Cat size={18} />
                  Gatos
                </button>
                <button
                  onClick={() => setActiveFilter('puppy')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                    activeFilter === 'puppy'
                      ? 'bg-maya-olive text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive/20'
                  }`}
                >
                  <Sparkles size={18} />
                  Filhotes
                </button>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2 block">
                Porte
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSizeFilter('all')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sizeFilter === 'all'
                      ? 'bg-maya-blue text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-blue/20'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSizeFilter('small')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sizeFilter === 'small'
                      ? 'bg-maya-blue text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-blue/20'
                  }`}
                >
                  Pequeno
                </button>
                <button
                  onClick={() => setSizeFilter('medium')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sizeFilter === 'medium'
                      ? 'bg-maya-blue text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-blue/20'
                  }`}
                >
                  Médio
                </button>
                <button
                  onClick={() => setSizeFilter('large')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sizeFilter === 'large'
                      ? 'bg-maya-blue text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-blue/20'
                  }`}
                >
                  Grande
                </button>
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2 block">
                Gênero
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    genderFilter === 'all'
                      ? 'bg-maya-olive-light text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive-light/20'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setGenderFilter('male')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                    genderFilter === 'male'
                      ? 'bg-maya-olive-light text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive-light/20'
                  }`}
                >
                  <span className="text-blue-600 font-bold">♂</span>
                  Macho
                </button>
                <button
                  onClick={() => setGenderFilter('female')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                    genderFilter === 'female'
                      ? 'bg-maya-olive-light text-white shadow-lg'
                      : 'bg-maya-beige text-maya-brown hover:bg-maya-olive-light/20'
                  }`}
                >
                  <span className="text-pink-600 font-bold">♀</span>
                  Fêmea
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-maya-brown/60 dark:text-gray-400 text-sm">
            {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className="card group hover:scale-105 transition-transform duration-300">
              {/* Image */}
              <div className="relative h-64 mb-4 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
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
                <div className="absolute top-4 right-4">
                  <FavoriteButton animalId={animal.id} />
                </div>
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
                  <p className="text-maya-brown/60 text-xs mt-1">
                    Porte: {animal.size === 'small' ? 'Pequeno' : animal.size === 'medium' ? 'Médio' : 'Grande'}
                  </p>
                </div>
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
            <PawPrint className="w-16 h-16 text-maya-olive mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-maya-brown mb-2">
              Nenhum animal encontrado
            </h3>
            <p className="text-maya-brown/70 mb-4">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <button
              onClick={clearFilters}
              className="btn-outline"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
          <h3 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-4 text-center">
            Como funciona a adoção?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold text-maya-brown dark:text-white mb-2">Escolha seu amigo</h4>
              <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                Navegue pelos perfis e encontre o pet ideal para você
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold text-maya-brown dark:text-white mb-2">Entre em contato</h4>
              <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                Converse conosco pelo WhatsApp para agendar uma visita
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-maya-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold text-maya-brown dark:text-white mb-2">Leve para casa</h4>
              <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                Após aprovação, leve seu novo amigo para casa!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
