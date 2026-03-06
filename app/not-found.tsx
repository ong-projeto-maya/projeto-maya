import Link from 'next/link'
import { Home, Search, Heart, PawPrint } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maya-beige to-white flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto relative">
              <PawPrint className="w-32 h-32 text-maya-green/20 absolute animate-ping" />
              <PawPrint className="w-32 h-32 text-maya-green relative" />
            </div>
          </div>

          {/* 404 */}
          <h1 className="text-9xl font-display text-maya-brown mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-display text-maya-brown mb-4">
            Ops! Página não encontrada
          </h2>

          <p className="text-xl text-maya-brown/70 mb-8">
            Parece que este amiguinho fugiu... Mas não se preocupe, 
            temos muitos outros esperando por você!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <Home size={20} />
              Voltar à Home
            </Link>
            <Link href="/adocao" className="btn-secondary inline-flex items-center gap-2">
              <Heart size={20} />
              Ver Animais
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-display text-xl text-maya-brown mb-4">
              Que tal explorar:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Link 
                href="/adocao" 
                className="p-4 bg-maya-beige rounded-xl hover:bg-maya-green/10 transition-colors"
              >
                <PawPrint className="w-6 h-6 text-maya-green mx-auto mb-2" />
                <div className="font-semibold text-maya-brown">Adotar um Pet</div>
              </Link>
              <Link 
                href="/doacoes" 
                className="p-4 bg-maya-beige rounded-xl hover:bg-maya-green/10 transition-colors"
              >
                <Heart className="w-6 h-6 text-maya-green mx-auto mb-2" />
                <div className="font-semibold text-maya-brown">Fazer uma Doação</div>
              </Link>
              <Link 
                href="/#sobre" 
                className="p-4 bg-maya-beige rounded-xl hover:bg-maya-green/10 transition-colors"
              >
                <Search className="w-6 h-6 text-maya-green mx-auto mb-2" />
                <div className="font-semibold text-maya-brown">Conhecer o Projeto</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
