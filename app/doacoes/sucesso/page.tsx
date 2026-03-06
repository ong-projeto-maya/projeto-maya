import Link from 'next/link'
import { CheckCircle, Heart, Home, Dog, HomeIcon } from 'lucide-react'

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Projeto Maya" 
                className="h-32 w-auto animate-bounce drop-shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-maya-green rounded-full flex items-center justify-center animate-pulse shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-6 flex items-center justify-center gap-4">
            Muito Obrigado! 
            <Heart className="w-16 h-16 text-maya-green fill-maya-green" />
          </h1>

          <p className="text-xl text-maya-brown/80 dark:text-gray-300 mb-4">
            Sua doação foi recebida com sucesso!
          </p>

          <p className="text-lg text-maya-brown/70 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Graças a pessoas como você, podemos continuar resgatando, cuidando e 
            encontrando lares amorosos para animais que precisam de uma segunda chance.
          </p>

          {/* Impact Statement */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4">
              Seu Impacto
            </h2>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
              Você receberá um e-mail de confirmação com os detalhes da sua doação. 
              Se você se tornou um doador mensal, enviaremos atualizações regulares 
              sobre o impacto das suas contribuições.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <Dog className="w-6 h-6 text-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Resgate</div>
              </div>
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-maya-green fill-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Cuidado</div>
              </div>
              <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-maya-green/20 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-maya-green" />
                  </div>
                </div>
                <div className="font-semibold text-maya-brown dark:text-white">Adoção</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-maya-brown dark:text-white mb-3">
              Continue Fazendo a Diferença
            </h3>
            <p className="text-sm text-maya-brown/70 dark:text-gray-300 mb-4">
              Compartilhe nossa causa com amigos e família, ou considere adotar 
              um de nossos amiguinhos!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <Home size={20} />
              Voltar ao Início
            </Link>
            <Link href="/adocao" className="btn-secondary inline-flex items-center gap-2">
              <Heart size={20} />
              Ver Animais para Adoção
            </Link>
          </div>

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-maya-brown/10 dark:border-gray-700">
            <p className="text-maya-brown/60 dark:text-gray-400 mb-4">
              Compartilhe nossa causa nas redes sociais:
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=YOUR_SITE_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:bg-maya-green transition-colors"
              >
                f
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Acabei%20de%20doar%20para%20o%20Projeto%20Maya!&url=YOUR_SITE_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:bg-maya-green transition-colors"
              >
                X
              </a>
              <a
                href="https://wa.me/?text=Acabei%20de%20doar%20para%20o%20Projeto%20Maya!%20Venha%20conhecer:%20YOUR_SITE_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center text-white hover:bg-maya-green transition-colors"
              >
                W
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
