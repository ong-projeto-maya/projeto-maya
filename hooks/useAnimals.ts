'use client'

import { useState, useEffect } from 'react'
import { animals as initialAnimals } from '@/data/animals'

export interface Animal {
  id: string
  name: string
  type: 'dog' | 'cat'
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  temperament: string[]
  story: string
  image: string
  images: string[]
  isAdopted: boolean
  isPuppy: boolean
  isRescued: boolean
  isMixed: boolean
}

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar do localStorage ou usar dados iniciais
    const stored = localStorage.getItem('maya_animals')
    if (stored) {
      try {
        setAnimals(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing stored animals:', error)
        setAnimals(initialAnimals)
      }
    } else {
      setAnimals(initialAnimals)
    }
    setIsLoading(false)
  }, [])

  const saveToStorage = (updatedAnimals: Animal[]) => {
    localStorage.setItem('maya_animals', JSON.stringify(updatedAnimals))
  }

  const addAnimal = (animal: Omit<Animal, 'id'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString(),
    }
    const updated = [...animals, newAnimal]
    setAnimals(updated)
    saveToStorage(updated)
    return newAnimal
  }

  const updateAnimal = (id: string, updates: Partial<Animal>) => {
    const updated = animals.map(animal =>
      animal.id === id ? { ...animal, ...updates } : animal
    )
    setAnimals(updated)
    saveToStorage(updated)
  }

  const deleteAnimal = (id: string) => {
    const updated = animals.filter(animal => animal.id !== id)
    setAnimals(updated)
    saveToStorage(updated)
  }

  const getAnimalById = (id: string) => {
    return animals.find(animal => animal.id === id)
  }

  return {
    animals,
    isLoading,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalById,
  }
}
