import Link from 'next/link'
import Image from 'next/image'
import { Heart, PawPrint } from 'lucide-react'
import PawTrail from './PawTrail'

export default function Hero() {
  // Marrom com texto creme é o par principal do brandbook (8,17:1), e o que o
  // rodapé já usava. Antes o hero era azul-claro com título branco e uma
  // segunda linha laranja a 1,22:1 — praticamente invisível.
  //
  // A Maya saiu de `position: absolute` e entrou na grade. Antes ela ficava
  // solta no canto inferior direito, por baixo do bloco de texto centralizado;
  // como o texto ocupava de 4% a 96% da largura e ela de 71% a 95%, os dois
  // dividiam o mesmo terço da tela e o texto caía em cima dela — a Raquel
  // reparou que o botão "Quero Doar" ficava em cima do focinho. Em coluna
  // própria isso não tem como acontecer em largura nenhuma.
  return (
    <section className="hero-section relative bg-maya-brown overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
      {/* Rastro de pegadas no fundo. Antes havia sete patinhas paradas
          espalhadas pelo hero; a Ana pediu para tirar. */}
      <PawTrail />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:gap-16">
          {/* Texto */}
          <div className="flex flex-col items-center text-center space-y-8 md:items-start md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-maya-cream leading-tight text-balance">
              Nós acreditamos que{' '}
              {/* maya-orange-light é o laranja da marca clareado até 4,51:1
                  sobre o marrom. O laranja original ficava em 3,61. */}
              <span className="text-maya-orange-light">o amor transforma.</span>
            </h1>

            <p className="text-lg md:text-xl text-maya-beige max-w-xl">
              Do resgate, à adoção. Juntos, transformamos histórias de abandono em
              histórias de amor e esperança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/adocao"
                className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-maya-green text-maya-brown font-bold rounded-2xl hover:bg-maya-green/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <PawPrint size={20} />
                Quero Adotar
              </Link>
              <Link
                href="/doacoes"
                className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-transparent text-maya-cream font-bold rounded-2xl border-2 border-maya-cream/70 hover:bg-maya-cream hover:text-maya-brown transition-all hover:-translate-y-0.5"
              >
                <Heart size={20} />
                Quero Doar
              </Link>
            </div>
          </div>

          {/* Maya — coluna própria, à direita no desktop e abaixo no celular */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/maya-hero.png"
              alt="Maya, a cachorrinha que dá nome ao projeto"
              width={900}
              height={1001}
              className="w-40 sm:w-48 md:w-52 lg:w-72 h-auto object-contain"
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          {/* Casa com o fundo da seção seguinte (maya-cream) */}
          <path d="M0,40 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" fill="#F4EFE8" />
        </svg>
      </div>
    </section>
  )
}
