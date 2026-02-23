'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar as CalendarIcon,
  X,
  Save,
  CheckCircle,
  MapPin,
  Clock,
  Users
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEvents, Event } from '@/hooks/useEvents'

export default function AdminEventosPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { events, isLoading, addEvent, updateEvent, deleteEvent, isPastEvent } = useEvents()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTime, setFilterTime] = useState<'all' | 'upcoming' | 'past'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'adoption' as 'adoption' | 'fundraising' | 'educational' | 'other',
    capacity: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-maya-brown dark:text-white">Carregando...</p>
    </div>
  }

  if (!isAuthenticated) return null

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesTime = true
    if (filterTime === 'upcoming') {
      matchesTime = !isPastEvent(event)
    } else if (filterTime === 'past') {
      matchesTime = isPastEvent(event)
    }

    return matchesSearch && matchesTime
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time)
    const dateB = new Date(b.date + 'T' + b.time)
    return dateB.getTime() - dateA.getTime()
  })

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        capacity: event.capacity?.toString() || '',
      })
    } else {
      setEditingEvent(null)
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        type: 'adoption',
        capacity: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEvent(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
      setSuccessMessage(`${formData.title} atualizado com sucesso!`)
    } else {
      addEvent(eventData)
      setSuccessMessage(`${formData.title} criado com sucesso!`)
    }

    handleCloseModal()
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDelete = (event: Event) => {
    if (confirm(`Tem certeza que deseja excluir "${event.title}"?`)) {
      deleteEvent(event.id)
      setSuccessMessage(`${event.title} removido com sucesso!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const getEventTypeLabel = (type: Event['type']) => {
    const types = {
      adoption: 'Adoção',
      fundraising: 'Arrecadação',
      educational: 'Educacional',
      other: 'Outro',
    }
    return types[type]
  }

  const getEventTypeBadge = (type: Event['type']) => {
    const colors = {
      adoption: 'bg-maya-olive/10 text-maya-olive dark:bg-maya-olive/20',
      fundraising: 'bg-maya-blue/10 text-maya-blue dark:bg-maya-blue/20',
      educational: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    }
    return colors[type]
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2">
                Gerenciar Eventos
              </h1>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Crie, edite ou remova eventos do calendário
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Evento
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por título ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                />
              </div>
            </div>

            {/* Time Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterTime('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterTime === 'all'
                    ? 'bg-maya-olive text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterTime('upcoming')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterTime === 'upcoming'
                    ? 'bg-maya-olive text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setFilterTime('past')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterTime === 'past'
                    ? 'bg-maya-olive text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Passados
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {sortedEvents.length} {sortedEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedEvents.map((event) => {
            const past = isPastEvent(event)
            return (
              <div
                key={event.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
                  past ? 'opacity-75' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeBadge(event.type)}`}>
                          {getEventTypeLabel(event.type)}
                        </span>
                        {past && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            Encerrado
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white mb-2">
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(event)}
                        className="p-2 hover:bg-maya-beige dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} className="text-maya-olive" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon size={16} className="text-maya-olive flex-shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="text-maya-blue flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="text-red-500 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    {event.capacity && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <Users size={16} className="text-purple-500 flex-shrink-0" />
                        <span>
                          {event.registered || 0} / {event.capacity} inscritos
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {sortedEvents.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum evento encontrado</p>
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Primeiro Evento
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-maya-brown dark:text-white">
                {editingEvent ? 'Editar Evento' : 'Criar Evento'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Local *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Shopping Maya - Piso 2"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  required
                />
              </div>

              {/* Type and Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="adoption">Adoção</option>
                    <option value="fundraising">Arrecadação</option>
                    <option value="educational">Educacional</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Capacidade
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Ex: 100"
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white resize-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
