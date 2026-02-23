import Link from 'next/link'
import { Heart, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-maya-brown dark:bg-gray-900 text-white transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Missão */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/logo-2.png" 
                alt="Projeto Maya" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Dedicados ao resgate, cuidado e adoção responsável de animais. 
              Cada vida importa, cada doação transforma.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-maya-olive transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="mailto:contato@projetomaya.org" 
                className="hover:text-maya-olive transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-maya-olive transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-white/80 hover:text-maya-olive transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/adocao" className="text-white/80 hover:text-maya-olive transition-colors">
                  Adotar
                </Link>
              </li>
              <li>
                <Link href="/doacoes" className="text-white/80 hover:text-maya-olive transition-colors">
                  Doar
                </Link>
              </li>
              <li>
                <Link href="/doador/login" className="text-maya-olive-light hover:text-maya-olive font-semibold transition-colors inline-flex items-center gap-1">
                  <Heart size={14} className="fill-maya-olive-light" />
                  Área do Doador
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">
                  São Paulo, SP<br />Brasil
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} />
                <span className="text-white/80 text-sm">
                  (11) 9 9999-9999
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} />
                <span className="text-white/80 text-sm">
                  contato@projetomaya.org
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>© 2026 Projeto Maya. Todos os direitos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-2">
            Feito com <Heart size={16} className="text-maya-olive fill-maya-olive" /> para os animais
          </p>
        </div>
      </div>
    </footer>
  )
}
