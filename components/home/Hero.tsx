import Link from 'next/link'
import Image from 'next/image'
import { Heart, PawPrint } from 'lucide-react'

export default function Hero() {
  // Marrom com texto creme é o par principal do brandbook (8,17:1), e o que o
  // rodapé já usava. Antes o hero era azul-claro com título branco e uma
  // segunda linha laranja a 1,22:1 — praticamente invisível.
  return (
    <section className="hero-section relative bg-maya-brown overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
      {/* A marca d'água do logotipo saiu daqui: o cabeçalho logo acima já traz
          o logotipo, e no celular ela colidia com o título. */}

      {/* Maya — canto inferior direito (diagonal) */}
      <div className="absolute bottom-20 right-4 md:bottom-24 md:right-10 lg:bottom-16 lg:right-16 z-10 hidden sm:block">
        <Image
          src="/images/maya-hero.png"
          alt="Maya - Mascote do Projeto"
          width={900}
          height={1001}
          className="w-36 md:w-48 lg:w-64 h-auto object-contain"
          priority
          quality={100}
          unoptimized
        />
      </div>

      {/* Decorative paw prints */}
      <div className="absolute top-12 right-1/3 opacity-[0.08]">
        <PawPrint size={45} className="text-white rotate-[25deg]" />
      </div>
      <div className="absolute top-1/3 left-[8%] opacity-[0.06] hidden md:block">
        <PawPrint size={70} className="text-white -rotate-[15deg]" />
      </div>
      <div className="absolute top-[15%] right-[10%] opacity-[0.07] hidden lg:block">
        <PawPrint size={55} className="text-white rotate-[40deg]" />
      </div>
      <div className="absolute bottom-[30%] right-[25%] opacity-[0.06] hidden md:block">
        <PawPrint size={40} className="text-white -rotate-[30deg]" />
      </div>
      <div className="absolute bottom-[20%] left-[15%] opacity-[0.08] hidden lg:block">
        <PawPrint size={50} className="text-white rotate-[10deg]" />
      </div>
      <div className="absolute top-[55%] right-[8%] opacity-[0.05] hidden lg:block">
        <PawPrint size={35} className="text-white rotate-[60deg]" />
      </div>
      <div className="absolute bottom-[45%] left-[35%] opacity-[0.07] hidden md:block">
        <PawPrint size={30} className="text-white -rotate-[45deg]" />
      </div>

      {/* Conteúdo centralizado */}
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display text-maya-cream leading-tight">
            Nós acreditamos que<br />
            {/* maya-orange-light é o laranja da marca clareado até 4,51:1
                sobre o marrom. O laranja original ficava em 3,61. */}
            <span className="text-maya-orange-light">o amor transforma.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-maya-beige max-w-xl">
            Do resgate, à adoção. Juntos, transformamos histórias de abandono em
            histórias de amor e esperança.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/adocao" className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-maya-green text-maya-brown font-bold rounded-2xl hover:bg-maya-green/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <PawPrint size={20} />
              Quero Adotar
            </Link>
            <Link href="/doacoes" className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-transparent text-maya-cream font-bold rounded-2xl border-2 border-maya-cream/70 hover:bg-maya-cream hover:text-maya-brown transition-all hover:-translate-y-0.5">
              <Heart size={20} />
              Quero Doar
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          {/* Casa com o fundo da seção seguinte (maya-cream) */}
          <path d="M0,40 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" fill="#F4EFE8"/>
        </svg>
      </div>
    </section>
  )
}
