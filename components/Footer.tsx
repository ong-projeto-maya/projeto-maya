import Link from 'next/link'
import { Heart, Instagram, Mail, PawPrint, ArrowRight, AlertTriangle } from 'lucide-react'
import { EMAIL_CONTATO } from '@/lib/contato'

export default function Footer() {
  return (
    <footer className="relative bg-maya-brown dark:bg-gray-900 text-white transition-colors duration-200 overflow-hidden">
      {/* Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 md:h-12">
          {/* Casa com a faixa de campanhas, logo acima (maya-blue-dark) */}
          <path d="M0,30 C360,60 720,0 1440,30 L1440,0 L0,0 Z" fill="currentColor" className="text-maya-blue-dark dark:text-gray-800" />
        </svg>
      </div>

      {/* Decorative paw prints */}
      <div className="absolute top-20 right-[10%] opacity-[0.04]">
        <PawPrint size={80} className="text-white rotate-[20deg]" />
      </div>
      <div className="absolute bottom-20 left-[5%] opacity-[0.04] hidden md:block">
        <PawPrint size={60} className="text-white -rotate-[15deg]" />
      </div>

      {/* CTA Banner */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl mb-3">
            Quer fazer parte dessa causa?
          </h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Cada gesto conta. Doe, adote, seja voluntário ou simplesmente compartilhe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/doacoes" className="inline-flex items-center gap-2 justify-center px-6 py-3 bg-maya-green text-maya-brown font-bold rounded-xl hover:bg-maya-cream transition-all hover:-translate-y-0.5">
              <Heart size={18} />
              Fazer uma Doação
            </Link>
            <Link href="/adocao" className="inline-flex items-center gap-2 justify-center px-6 py-3 bg-white/15 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-all hover:-translate-y-0.5">
              <PawPrint size={18} />
              Quero Adotar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Missão */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center mb-4">
              {/* Sobre fundo marrom o brandbook aplica a versão bege do
                  logotipo (página 13), que mantém a Maya colorida. Antes
                  era o logotipo marrom forçado a branco por filtro CSS
                  (brightness-0 invert), o que apagava o desenho dela. */}
              <img
                src="/logo-bege.png"
                alt="Projeto Maya"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              Dedicados ao resgate, cuidado e adoção responsável de animais. 
              Cada vida importa, cada doação transforma.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white/90">Links Rápidos</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-white/60 hover:text-maya-green transition-colors inline-flex items-center gap-1 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Início
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="text-white/60 hover:text-maya-green transition-colors inline-flex items-center gap-1 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/adocao" className="text-white/60 hover:text-maya-green transition-colors inline-flex items-center gap-1 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Adotar
                </Link>
              </li>
              <li>
                <Link href="/campanhas" className="text-white/60 hover:text-maya-green transition-colors inline-flex items-center gap-1 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Campanhas
                </Link>
              </li>
              <li>
                <Link href="/doador/login" className="text-maya-green hover:text-maya-green/80 font-semibold transition-colors inline-flex items-center gap-1">
                  <Heart size={14} className="fill-maya-green" />
                  Área do Doador
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white/90">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <a href={`mailto:${EMAIL_CONTATO}`} className="text-white/60 hover:text-maya-green text-sm transition-colors break-all">
                  {EMAIL_CONTATO}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram size={16} />
                </div>
                <a href="https://instagram.com/projeto.maya" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-maya-green text-sm transition-colors">
                  @projeto.maya
                </a>
              </li>
              <li className="mt-4">
                <Link
                  href="/reportar-resgate"
                  className="inline-flex items-center gap-2 text-maya-orange-light hover:text-maya-cream font-semibold transition-colors text-sm"
                >
                  <AlertTriangle size={14} />
                  Reportar Resgate
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex items-center justify-center text-maya-beige text-sm">
          <p>&copy; 2026 Projeto Maya. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
