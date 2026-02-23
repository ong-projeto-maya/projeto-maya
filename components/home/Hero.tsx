import Link from 'next/link'
import { Heart, PawPrint } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-maya-beige to-white py-20 md:py-32 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <PawPrint size={120} className="text-maya-olive" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Heart size={100} className="text-maya-blue" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo.png" 
              alt="Projeto Maya" 
              className="h-32 w-auto drop-shadow-2xl"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold text-maya-brown mb-6 leading-tight">
            Do resgate,<br />
            <span className="text-maya-olive">à adoção.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-maya-brown/80 mb-12 max-w-2xl mx-auto">
            Cada vida importa. Juntos, transformamos histórias de abandono em 
            histórias de amor e esperança.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/adocao" className="btn-primary inline-flex items-center gap-2">
              <PawPrint size={20} />
              Quero Adotar
            </Link>
            <Link href="/doacoes" className="btn-secondary inline-flex items-center gap-2">
              <Heart size={20} />
              Quero Ajudar
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-maya-olive mb-2">347</div>
              <div className="text-sm text-maya-brown/70">Animais Resgatados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-maya-olive mb-2">289</div>
              <div className="text-sm text-maya-brown/70">Adoções Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-maya-olive mb-2">52</div>
              <div className="text-sm text-maya-brown/70">Voluntários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-maya-olive mb-2">100%</div>
              <div className="text-sm text-maya-brown/70">Amor e Dedicação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  )
}
