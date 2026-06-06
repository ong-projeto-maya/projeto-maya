'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'

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

const VALID_TYPES = ['dog', 'cat'] as const
const VALID_GENDERS = ['male', 'female'] as const
const VALID_SIZES = ['small', 'medium', 'large'] as const

function assertEnum<T extends string>(value: unknown, valid: readonly T[], field: string): T {
  if (typeof value === 'string' && (valid as readonly string[]).includes(value)) {
    return value as T
  }
  throw new Error(`Invalid value "${String(value)}" for field "${field}"`)
}

function mapAnimal(row: Record<string, unknown>): Animal {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    type: assertEnum(row.type, VALID_TYPES, 'type'),
    age: String(row.age ?? ''),
    gender: assertEnum(row.gender, VALID_GENDERS, 'gender'),
    size: assertEnum(row.size, VALID_SIZES, 'size'),
    temperament: Array.isArray(row.temperament) ? (row.temperament as string[]) : [],
    story: String(row.story ?? ''),
    image: String(row.image ?? ''),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    isAdopted: Boolean(row.is_adopted),
    isPuppy: Boolean(row.is_puppy),
    isRescued: Boolean(row.is_rescued),
    isMixed: Boolean(row.is_mixed),
  }
}

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchAnimals = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const { data, error } = await supabase
      .from('animais')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching animals:', error)
    } else {
      setAnimals((data ?? []).map(mapAnimal))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchAnimals()
  }, [fetchAnimals])

  const addAnimal = async (animal: Omit<Animal, 'id'>) => {
    const { data, error } = await supabase
      .from('animais')
      .insert({
        name: animal.name,
        type: animal.type,
        age: animal.age,
        gender: animal.gender,
        size: animal.size,
        temperament: animal.temperament,
        story: animal.story,
        image: animal.image,
        images: animal.images,
        is_adopted: animal.isAdopted,
        is_puppy: animal.isPuppy,
        is_rescued: animal.isRescued,
        is_mixed: animal.isMixed,
      })
      .select()
      .limit(1)

    if (error) { console.error('Error adding animal:', error); return null }
    const newAnimal = mapAnimal(data?.[0])
    setAnimals(prev => [...prev, newAnimal])
    return newAnimal
  }

  const updateAnimal = async (id: string, updates: Partial<Animal>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.type !== undefined) dbUpdates.type = updates.type
    if (updates.age !== undefined) dbUpdates.age = updates.age
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender
    if (updates.size !== undefined) dbUpdates.size = updates.size
    if (updates.temperament !== undefined) dbUpdates.temperament = updates.temperament
    if (updates.story !== undefined) dbUpdates.story = updates.story
    if (updates.image !== undefined) dbUpdates.image = updates.image
    if (updates.images !== undefined) dbUpdates.images = updates.images
    if (updates.isAdopted !== undefined) dbUpdates.is_adopted = updates.isAdopted
    if (updates.isPuppy !== undefined) dbUpdates.is_puppy = updates.isPuppy
    if (updates.isRescued !== undefined) dbUpdates.is_rescued = updates.isRescued
    if (updates.isMixed !== undefined) dbUpdates.is_mixed = updates.isMixed

    const { error } = await supabase.from('animais').update(dbUpdates).eq('id', id)
    if (error) { console.error('Error updating animal:', error); return }
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAnimal = async (id: string) => {
    const { error } = await supabase.from('animais').delete().eq('id', id)
    if (error) { console.error('Error deleting animal:', error); return }
    setAnimals(prev => prev.filter(a => a.id !== id))
  }

  const getAnimalById = (id: string) => {
    return animals.find(a => a.id === id)
  }

  return {
    animals,
    isLoading,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalById,
    refetch: fetchAnimals,
  }
}

