'use client'

import { useState } from 'react'
import { AlertTriangle, Phone, Mail, MapPin, Camera, Send, Check, MessageCircle } from 'lucide-react'

export default function ReportarResgatePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    animalType: 'cachorro',
    location: '',
    description: '',
    urgency: 'media',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const buildWhatsAppMessage = () => {
    const urgencyLabels: Record<string, string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta - Animal em perigo',
      critica: 'Crítica - Risco de vida',
    }
    const message = [
      '🚨 *REPORTAR RESGATE*',
      '',
      `*Nome:* ${formData.name}`,
      `*Telefone:* ${formData.phone}`,
      `*Animal:* ${formData.animalType === 'cachorro' ? 'Cachorro' : formData.animalType === 'gato' ? 'Gato' : 'Outro'}`,
      `*Localização:* ${formData.location}`,
      `*Urgência:* ${urgencyLabels[formData.urgency]}`,
      '',
      `*Descrição:*`,
      formData.description,
    ].join('\n')
    return encodeURIComponent(message)
  }

  const buildEmailBody = () => {
    const urgencyLabels: Record<string, string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta - Animal em perigo',
      critica: 'Crítica - Risco de vida',
    }
    const body = [
      'REPORTAR RESGATE',
      '',
      `Nome: ${formData.name}`,
      `Telefone: ${formData.phone}`,
      `Animal: ${formData.animalType === 'cachorro' ? 'Cachorro' : formData.animalType === 'gato' ? 'Gato' : 'Outro'}`,
      `Localização: ${formData.location}`,
      `Urgência: ${urgencyLabels[formData.urgency]}`,
      '',
      'Descrição:',
      formData.description,
    ].join('\n')
    return encodeURIComponent(body)
  }

  const isFormValid = formData.name && formData.phone && formData.location && formData.description

  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5519994224336'}?text=${buildWhatsAppMessage()}`
  const emailLink = `mailto:resgate@projetomaya.org?subject=${encodeURIComponent(`Reportar Resgate - ${formData.urgency === 'critica' ? 'URGENTE' : formData.urgency === 'alta' ? 'URGENTE' : 'Novo Caso'}`)}&body=${buildEmailBody()}`

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <AlertTriangle className="w-16 h-16 text-maya-orange mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Reportar Resgate
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Encontrou um animal em situação de risco? Preencha as informações abaixo e envie por WhatsApp ou e-mail.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-maya-orange/10 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-maya-orange" />
              </div>
              <h3 className="font-display text-lg text-maya-brown dark:text-white mb-2">
                Urgência?
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300 text-sm">
                Se o animal está em risco de vida, ligue diretamente ou envie via WhatsApp para resposta imediata.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-maya-green/10 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-maya-green" />
              </div>
              <h3 className="font-display text-lg text-maya-brown dark:text-white mb-2">
                Ligue Direto
              </h3>
              <a href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5519994224336'}`} className="text-maya-green font-semibold hover:text-maya-green/80 transition-colors">
                (19) 9 9422-4336
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-maya-blue" />
              </div>
              <h3 className="font-display text-lg text-maya-brown dark:text-white mb-2">
                Dica
              </h3>
              <p className="text-maya-brown/70 dark:text-gray-300 text-sm">
                Se possível, tire fotos do animal e da localização. Você poderá anexá-las ao enviar pelo WhatsApp.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-6">
                Informações do Resgate
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                    Seu Telefone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                    placeholder="(11) 9 9999-9999"
                  />
                </div>

                {/* Animal Type & Urgency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                      Tipo de Animal
                    </label>
                    <select
                      name="animalType"
                      value={formData.animalType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                    >
                      <option value="cachorro">Cachorro</option>
                      <option value="gato">Gato</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                      Nível de Urgência
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta - Animal em perigo</option>
                      <option value="critica">Crítica - Risco de vida</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                    Localização do Animal *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                    placeholder="Rua, bairro, ponto de referência..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-maya-brown/70 dark:text-gray-300 mb-2">
                    Descreva a Situação *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700 resize-none"
                    placeholder="Descreva o estado do animal, condições do local, se há outros animais por perto..."
                  />
                </div>

                {/* Urgency Warning */}
                {(formData.urgency === 'alta' || formData.urgency === 'critica') && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Para casos urgentes, recomendamos enviar por <strong>WhatsApp</strong> para uma resposta mais rápida.
                    </p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a
                    href={isFormValid ? whatsappLink : '#'}
                    target={isFormValid ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => !isFormValid && e.preventDefault()}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                      isFormValid
                        ? 'bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <MessageCircle size={20} />
                    Enviar por WhatsApp
                  </a>
                  <a
                    href={isFormValid ? emailLink : '#'}
                    onClick={(e) => !isFormValid && e.preventDefault()}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                      isFormValid
                        ? 'bg-maya-blue text-white hover:bg-maya-blue/90 hover:-translate-y-0.5 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Mail size={20} />
                    Enviar por E-mail
                  </a>
                </div>

                {!isFormValid && (
                  <p className="text-sm text-maya-brown/50 dark:text-gray-400 text-center">
                    Preencha todos os campos obrigatórios (*) para habilitar o envio
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
