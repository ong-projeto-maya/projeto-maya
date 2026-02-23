'use client'

import { useState, useEffect } from 'react'

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  type: 'adoption' | 'fundraising' | 'educational' | 'other'
  capacity?: number
  registered?: number
}

// Mock events iniciais
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Feira de Adoção - Shopping Center',
    date: '2026-03-15',
    time: '10:00',
    location: 'Shopping Maya - Piso 2',
    description: 'Grande feira de adoção com mais de 30 animais disponíveis. Venha conhecer seu novo melhor amigo!',
    type: 'adoption',
    capacity: 100,
    registered: 45,
  },
  {
    id: '2',
    title: 'Bazar Beneficente',
    date: '2026-03-22',
    time: '09:00',
    location: 'Praça Central',
    description: 'Bazar com roupas, acessórios e produtos pet. Toda a renda será revertida para o projeto.',
    type: 'fundraising',
    capacity: 200,
    registered: 78,
  },
  {
    id: '3',
    title: 'Palestra: Posse Responsável',
    date: '2026-03-28',
    time: '19:00',
    location: 'Auditório da Biblioteca Municipal',
    description: 'Palestra educativa sobre posse responsável de animais, cuidados básicos e saúde pet.',
    type: 'educational',
    capacity: 50,
    registered: 32,
  },
  {
    id: '4',
    title: 'Caminhada Pet Solidária',
    date: '2026-04-05',
    time: '08:00',
    location: 'Parque Municipal',
    description: 'Caminhada de 5km com seus pets. Inscrições revertem em doações para o projeto.',
    type: 'fundraising',
    capacity: 150,
    registered: 89,
  },
]

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar do localStorage ou usar dados iniciais
    const stored = localStorage.getItem('maya_events')
    if (stored) {
      try {
        setEvents(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing stored events:', error)
        setEvents(initialEvents)
      }
    } else {
      setEvents(initialEvents)
      localStorage.setItem('maya_events', JSON.stringify(initialEvents))
    }
    setIsLoading(false)
  }, [])

  const saveToStorage = (updatedEvents: Event[]) => {
    localStorage.setItem('maya_events', JSON.stringify(updatedEvents))
  }

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      registered: 0,
    }
    const updated = [...events, newEvent]
    setEvents(updated)
    saveToStorage(updated)
    return newEvent
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const updated = events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    )
    setEvents(updated)
    saveToStorage(updated)
  }

  const deleteEvent = (id: string) => {
    const updated = events.filter(event => event.id !== id)
    setEvents(updated)
    saveToStorage(updated)
  }

  const getEventById = (id: string) => {
    return events.find(event => event.id === id)
  }

  // Verificar se evento já passou
  const isPastEvent = (event: Event) => {
    const eventDate = new Date(event.date + 'T' + event.time)
    return eventDate < new Date()
  }

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    isPastEvent,
  }
}
