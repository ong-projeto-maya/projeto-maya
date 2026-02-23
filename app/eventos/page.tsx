import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import Link from 'next/link'

const events = [
  {
    id: '1',
    title: 'Feira de Adoção - Shopping Center',
    date: '2026-03-15',
    time: '10:00 - 18:00',
    location: 'Shopping Iguatemi - São Paulo',
    description: 'Venha conhecer nossos animais disponíveis para adoção! Teremos diversos cães e gatos esperando por você.',
    spots: 50,
    spotsAvailable: 32,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
  },
  {
    id: '2',
    title: 'Palestra: Adoção Responsável',
    date: '2026-03-22',
    time: '19:00 - 21:00',
    location: 'Centro Cultural - Online e Presencial',
    description: 'Aprenda tudo sobre adoção responsável, cuidados básicos e como preparar sua casa para um novo pet.',
    spots: 100,
    spotsAvailable: 67,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  },
  {
    id: '3',
    title: 'Caminhada Pet Solidária',
    date: '2026-04-05',
    time: '08:00 - 12:00',
    location: 'Parque Ibirapuera - São Paulo',
    description: 'Caminhada beneficente com seus pets! Inscrições revertem para o Projeto Maya. Traga água e coleira!',
    spots: 200,
    spotsAvailable: 145,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
  },
]

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Calendar className="w-16 h-16 text-maya-olive mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Próximos Eventos
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Participe dos nossos eventos e faça parte da mudança!
          </p>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-maya-olive text-white px-4 py-2 rounded-full font-bold text-sm">
                    {event.spotsAvailable} vagas
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-8">
                  <h2 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-4">
                    {event.title}
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                      <Calendar className="w-5 h-5 text-maya-olive" />
                      <span>{new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                      <Clock className="w-5 h-5 text-maya-olive" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                      <MapPin className="w-5 h-5 text-maya-olive" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-maya-brown/70 dark:text-gray-300">
                      <Users className="w-5 h-5 text-maya-olive" />
                      <span>{event.spotsAvailable} de {event.spots} vagas disponíveis</span>
                    </div>
                  </div>

                  <p className="text-maya-brown/80 dark:text-gray-300 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <a
                    href={`https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20me%20inscrever%20no%20evento:%20${encodeURIComponent(event.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-block"
                  >
                    Inscrever-se Agora
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-12 text-center max-w-3xl mx-auto shadow-lg">
          <h2 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-4">
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
