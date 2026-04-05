'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setEvents((data ?? []).map(row => ({
        ...row,
        image: row.image ?? undefined,
        capacity: row.capacity ?? undefined,
      })))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const addEvent = async (event: Omit<Event, 'id'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('eventos')
      .insert({ ...event, registered: 0 })
      .select()
      .single()

    if (error) { console.error('Error adding event:', error); return null }
    const mapped: Event = { ...data, image: data.image ?? undefined, capacity: data.capacity ?? undefined }
    setEvents(prev => [...prev, mapped])
    return mapped
  }

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const supabase = createClient()
    const { error } = await supabase.from('eventos').update(updates).eq('id', id)
    if (error) { console.error('Error updating event:', error); return }
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteEvent = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('eventos').delete().eq('id', id)
    if (error) { console.error('Error deleting event:', error); return }
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const getEventById = (id: string) => {
    return events.find(e => e.id === id)
  }

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
    refetch: fetchEvents,
  }
}
