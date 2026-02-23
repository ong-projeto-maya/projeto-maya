'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('maya_favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const toggleFavorite = (animalId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
      
      localStorage.setItem('maya_favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (animalId: string) => favorites.includes(animalId)

  return { favorites, toggleFavorite, isFavorite }
}
