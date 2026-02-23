'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Integrar com serviço de newsletter (Mailchimp, SendGrid, etc)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubscribed(true)
    setLoading(false)
    setEmail('')

    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <section className="bg-gradient-to-br from-maya-olive to-maya-olive-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="font-display font-bold text-4xl mb-4">
            Fique Por Dentro!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Receba novidades sobre resgates, adoções e eventos diretamente no seu email.
          </p>

          {subscribed ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center gap-3">
              <Check className="w-6 h-6" />
              <span className="font-semibold">Inscrição realizada com sucesso!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="flex-1 px-6 py-4 rounded-xl text-maya-brown focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-maya-olive hover:bg-maya-beige font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Inscrevendo...' : 'Inscrever'}
              </button>
            </form>
          )}

          <p className="text-sm opacity-75 mt-4">
            Prometemos não enviar spam. Você pode cancelar a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  )
}
