'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

interface FavoriteButtonProps {
  animalId: string
  size?: number
  className?: string
}

export default function FavoriteButton({ animalId, size = 24, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(animalId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(animalId)
      }}
      className={`transition-all duration-300 hover:scale-110 ${className}`}
      aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        size={size}
        className={`transition-colors ${
          favorite
            ? 'fill-red-500 text-red-500'
            : 'text-maya-green hover:text-red-500'
        }`}
      />
    </button>
  )
}
