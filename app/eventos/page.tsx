'use client'

import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { useEvents } from '@/hooks/useEvents'

const typeLabels: Record<string, string> = {
  adoption: 'Adoção',
  fundraising: 'Arrecadação',
  educational: 'Educativo',
  other: 'Evento',
}

const typeColors: Record<string, string> = {
  adoption: 'bg-maya-green',
  fundraising: 'bg-maya-orange',
  educational: 'bg-maya-blue',
  other: 'bg-gray-500',
}

export default function EventosPage() {
  const { events, isLoading } = useEvents()
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date())

  return (
    <div className="min-h-screen bg-maya-cream py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Calendar className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Próximos Eventos
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Participe dos nossos eventos e faça parte da mudança!
          </p>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700" />
                  <div className="md:col-span-2 p-8 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : upcomingEvents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-lg">
              <Calendar className="w-16 h-16 text-maya-brown/30 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-maya-brown dark:text-white mb-2">
                Nenhum evento futuro
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Fique de olho — novos eventos são anunciados regularmente!
              </p>
            </div>
          ) : upcomingEvents.map((event) => {
            const spotsAvailable = event.capacity != null ? event.capacity - (event.registered ?? 0) : null
            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Image */}
                  <div className="relative h-64 md:h-auto">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-maya-green/10 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-maya-green/40" />
                      </div>
                    )}
                    <div className={`absolute top-4 right-4 ${typeColors[event.type] ?? 'bg-gray-500'} text-white px-4 py-2 rounded-full font-bold text-sm`}>
                      {typeLabels[event.type] ?? event.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-8">
                    <h2 className="font-display text-3xl text-maya-brown dark:text-white mb-4">
                      {event.title}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                        <Calendar className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>

                      <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                        <Clock className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                        <MapPin className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>

                      {event.capacity != null && (
                        <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                          <Users className="w-5 h-5 text-maya-green flex-shrink-0" />
                          <span>{spotsAvailable} de {event.capacity} vagas disponíveis</span>
                        </div>
                      )}
                    </div>

                    <p className="text-maya-brown/80 dark:text-gray-300 mb-6 leading-relaxed">
                      {event.description}
                    </p>

                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=Ol%C3%A1!%20Gostaria%20de%20me%20inscrever%20no%20evento:%20${encodeURIComponent(event.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      Inscrever-se Agora
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-12 text-center max-w-3xl mx-auto shadow-lg">
          <h2 className="font-display text-3xl text-maya-brown dark:text-white mb-4">
            Quer Organizar um Evento Conosco?
          </h2>
          <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
            Se você tem uma empresa, escola ou comunidade e gostaria de nos ajudar organizando um evento, entre em contato!
          </p>
          <Link href="/contato" className="btn-primary inline-block">
            Entrar em Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
