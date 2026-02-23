'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Check, MessageSquare } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'adocao',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Integrar com backend ou serviço de email
    // Por enquanto, simula envio
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
    setFormData({ name: '', email: '', phone: '', subject: 'adocao', message: '' })

    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <MessageSquare className="w-16 h-16 text-maya-olive mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <Mail className="w-8 h-8 text-maya-olive mb-4" />
              <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white mb-2">
                Email
              </h3>
              <a href="mailto:contato@projetomaya.org" className="text-maya-brown/70 dark:text-gray-300 hover:text-maya-olive">
                contato@projetomaya.org
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <Phone className="w-8 h-8 text-maya-olive mb-4" />
              <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white mb-2">
                Telefone/WhatsApp
              </h3>
              <a href="tel:+5511999999999" className="text-maya-brown/70 dark:text-gray-300 hover:text-maya-olive">
                (11) 9 9999-9999
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <MapPin className="w-8 h-8 text-maya-olive mb-4" />
              <h3 className="font-display font-bold text-xl text-maya-brown dark:text-white mb-2">
                Localização
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300">
                São Paulo, SP<br />
                Brasil
              </p>
            </div>

            <div className="bg-gradient-to-br from-maya-olive to-maya-olive-light text-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-xl mb-2">
                Horário de Atendimento
              </h3>
              <p className="text-sm opacity-90">
                Segunda a Sexta: 9h às 18h<br />
                Sábados: 9h às 13h<br />
                Domingos e Feriados: Fechado
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <h2 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-6">
                Envie sua Mensagem
              </h2>

              {submitted && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Mensagem enviada com sucesso!</p>
                      <p className="text-sm text-green-700">Responderemos em breve.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="(11) 9 9999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                      Assunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none dark:bg-gray-700 dark:text-white"
                    >
                      <option value="adocao">Interesse em Adoção</option>
                      <option value="doacao">Doações</option>
                      <option value="voluntario">Voluntariado</option>
                      <option value="apadrinhamento">Apadrinhamento</option>
                      <option value="duvida">Dúvida Geral</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive focus:outline-none resize-none dark:bg-gray-700 dark:text-white"
                    placeholder="Conte-nos como podemos ajudar..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensagem
                    </>
                  )}
                </button>

                <p className="text-xs text-maya-brown/60 text-center">
                  Respondemos normalmente em até 24 horas úteis.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
