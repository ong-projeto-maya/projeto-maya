import Link from 'next/link'
import Image from 'next/image'
import { Heart, PawPrint } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-maya-beige via-maya-sand/20 to-white py-16 md:py-24 overflow-hidden min-h-[70vh] flex items-center">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <PawPrint size={120} className="text-maya-green" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Heart size={100} className="text-maya-blue" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Texto à Esquerda */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-display text-maya-brown leading-tight">
              Do resgate,<br />
              <span className="text-maya-green">à adoção.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-maya-brown/80 max-w-xl">
              Cada vida importa. Juntos, transformamos histórias de abandono em 
              histórias de amor e esperança.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/adocao" className="btn-primary inline-flex items-center gap-2 justify-center">
                <PawPrint size={20} />
                Quero Adotar
              </Link>
              <Link href="/doacoes" className="btn-secondary inline-flex items-center gap-2 justify-center">
                <Heart size={20} />
                Quero Ajudar
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div>
                <div className="text-4xl font-display text-maya-green mb-1">347</div>
                <div className="text-sm text-maya-brown/70">Resgatados</div>
              </div>
              <div>
                <div className="text-4xl font-display text-maya-green mb-1">289</div>
                <div className="text-sm text-maya-brown/70">Adotados</div>
              </div>
              <div>
                <div className="text-4xl font-display text-maya-green mb-1">52</div>
                <div className="text-sm text-maya-brown/70">Voluntários</div>
              </div>
              <div>
                <div className="text-4xl font-display text-maya-green mb-1">100%</div>
                <div className="text-sm text-maya-brown/70">Amor 🐾</div>
              </div>
            </div>
          </div>

          {/* Imagem do Cachorro à Direita */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[350px] md:max-w-[450px] lg:max-w-[550px] mx-auto">
              {/* Imagem do cachorro */}
              <div className="relative z-10">
                <Image
                  src="/images/hero-logo.png"
                  alt="Cachorro Maya - Ilustração"
                  width={1200}
                  height={1200}
                  className="w-full h-auto object-contain"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
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
