import { MapPin, Phone, Mail, Clock, Navigation, Car, Train, Bus } from 'lucide-react'
import Link from 'next/link'

export default function LocalizacaoPage() {
  const address = 'São Paulo, SP, Brasil'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <MapPin className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Nossa Localização
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Venha nos visitar e conhecer nossos amiguinhos pessoalmente!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-96 lg:h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14630.423788634687!2d-46.65518!3d-23.56181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-maya-green" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-maya-brown dark:text-white mb-2">
                    Endereço
                  </h3>
                  <p className="text-maya-brown/70 dark:text-gray-300 mb-4">
                    São Paulo, SP<br />
                    Brasil
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green font-semibold"
                  >
                    <Navigation size={18} />
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-maya-blue" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-maya-brown dark:text-white mb-3">
                    Horário de Funcionamento
                  </h3>
                  <div className="space-y-2 text-maya-brown/70 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-semibold">Segunda a Sexta:</span>
                      <span>9h - 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Sábado:</span>
                      <span>9h - 13h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Domingo:</span>
                      <span className="text-red-500">Fechado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Feriados:</span>
                      <span className="text-red-500">Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-maya-green" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-maya-brown dark:text-white mb-3">
                    Contato
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+5511999999999"
                      className="flex items-center gap-2 text-maya-brown/70 dark:text-gray-300 hover:text-maya-green"
                    >
                      <Phone size={18} />
                      (11) 9 9999-9999
                    </a>
                    <a
                      href="mailto:contato@projetomaya.org"
                      className="flex items-center gap-2 text-maya-brown/70 dark:text-gray-300 hover:text-maya-green"
                    >
                      <Mail size={18} />
                      contato@projetomaya.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-maya-green to-maya-green text-white rounded-2xl p-6">
              <h3 className="font-display text-2xl mb-3">
                Agende sua Visita!
              </h3>
              <p className="mb-4 opacity-90">
                Entre em contato para agendar uma visita e conhecer nossos animais disponíveis para adoção.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20uma%20visita%20ao%20Projeto%20Maya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-maya-green hover:bg-maya-beige font-semibold px-6 py-3 rounded-xl transition-all inline-block"
                >
                  WhatsApp
                </a>
                <Link
                  href="/contato"
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all inline-block"
                >
                  Formulário
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How to Get Here */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
            <h2 className="font-display text-3xl text-maya-brown dark:text-white mb-6 text-center">
              Como Chegar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-maya-green/10 rounded-2xl flex items-center justify-center">
                    <Car className="w-8 h-8 text-maya-green" />
                  </div>
                </div>
                <h3 className="font-bold text-maya-brown dark:text-white mb-2">De Carro</h3>
                <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                  Estacionamento disponível na rua. Use GPS ou Google Maps para melhor rota.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-maya-blue/10 rounded-2xl flex items-center justify-center">
                    <Train className="w-8 h-8 text-maya-blue" />
                  </div>
                </div>
                <h3 className="font-bold text-maya-brown dark:text-white mb-2">Metrô/Trem</h3>
                <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                  Estação mais próxima: consulte nosso mapa acima para melhores opções.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-maya-green/10 rounded-2xl flex items-center justify-center">
                    <Bus className="w-8 h-8 text-maya-green" />
                  </div>
                </div>
                <h3 className="font-bold text-maya-brown dark:text-white mb-2">Ônibus</h3>
                <p className="text-sm text-maya-brown/70 dark:text-gray-300">
                  Diversas linhas passam próximo ao local. Consulte a SPTrans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
