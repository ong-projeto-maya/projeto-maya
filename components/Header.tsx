'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Heart, 
  Home, 
  PawPrint, 
  Calendar, 
  MessageSquare,
  Search,
  Bell,
  User,
  LogOut,
  Target,
  ChevronDown,
  BookOpen,
  HelpCircle,
  MapPin,
  ClipboardList,
  Users,
  AlertTriangle,
  HandHeart,
} from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import { useDoador } from '@/hooks/useDoador'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasNewAnimals, setHasNewAnimals] = useState(true) // Mock - seria dinâmico
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()
  const { doador } = useDoador()
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Sombra mais forte depois que a página sai do topo.
  //
  // Com histerese: marca ao passar de 80px e só desmarca abaixo de 30. Sem
  // isso, o limiar único fazia o estado piscar a cada pixel de inércia do
  // trackpad em torno dele, e o topo tremia.
  //
  // Medição fora do rAF causaria layout síncrono a cada evento de rolagem, por
  // isso a leitura de scrollY espera o próximo quadro. O listener é passivo:
  // não chamamos preventDefault, e avisar o navegador disso deixa a rolagem
  // fora da thread principal.
  useEffect(() => {
    let agendado = false
    const handleScroll = () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(() => {
        agendado = false
        const y = window.scrollY
        setIsScrolled((antes) => (antes ? y > 30 : y > 80))
      })
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Início', icon: Home },
    { 
      href: '/adocao', 
      label: 'Adotar', 
      icon: PawPrint, 
      badge: hasNewAnimals,
      submenu: [
        { href: '/adocao', label: 'Ver Animais', icon: PawPrint },
        { href: '/quiz', label: 'Quiz de Compatibilidade', icon: ClipboardList },
      ]
    },
    // Todo item de menu com submenu também é um link. Clicar no pai leva à
    // página principal do grupo; passar o mouse abre o submenu. Antes o pai
    // era um <button> sem destino, que só servia para revelar os filhos.
    {
      href: '/doacoes',
      label: 'Como Ajudar',
      icon: Heart,
      submenu: [
        { href: '/doacoes', label: 'Fazer Doação', icon: Heart },
        { href: '/campanhas', label: 'Campanhas Ativas', icon: Target },
        // A página /voluntariado era um "em breve" com lista de features que ninguém
        // pediu. A página de contato já encaminha para o WhatsApp da ONG ao enviar,
        // que é como o card da home sempre tratou voluntariado.
        { href: '/contato', label: 'Seja Voluntário', icon: HandHeart },
      ]
    },
    {
      href: '/quem-somos',
      label: 'Institucional',
      icon: BookOpen,
      submenu: [
        { href: '/quem-somos', label: 'Quem Somos', icon: Users },
        { href: '/eventos', label: 'Eventos', icon: Calendar },
        { href: '/manual-cuidados', label: 'Manual de Cuidados', icon: BookOpen },
      ]
    },
    {
      href: '/contato',
      label: 'Contato',
      icon: MessageSquare,
      submenu: [
        { href: '/contato', label: 'Fale Conosco', icon: MessageSquare },
        { href: '/reportar-resgate', label: 'Reportar Resgate', icon: AlertTriangle },
      ]
    },
  ]

  return (
    <>
      {/* A altura do topo é fixa e só a sombra muda ao rolar.
          Antes o header encolhia (py-4 -> py-2, logo h-12 -> h-8) dentro de um
          transition-all de 500ms. Como ele é sticky e está no fluxo, animar o
          padding reposicionava a página inteira a cada quadro da transição, e
          qualquer vaivém em torno do limiar reiniciava a animação. Daí o
          tremor. Agora a única propriedade animada é a sombra, que o
          compositor resolve sem recalcular layout. */}
      <header
        className={`bg-maya-cream/95 dark:bg-gray-800/95 backdrop-blur-md sticky top-0 z-50 py-4 transition-shadow duration-300 ease-out ${
          isScrolled ? 'shadow-lg' : 'shadow-md'
        }`}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo-2.png"
                alt="Projeto Maya"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {navLinks.map((link, idx) => {
                const Icon = link.icon
                const active = link.href && isActive(link.href)
                const hasSubmenu = link.submenu && link.submenu.length > 0
                
                if (hasSubmenu) {
                  return (
                    <div 
                      key={idx}
                      className="relative"
                      onMouseEnter={() => {
                        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
                        setOpenDropdown(link.label)
                      }}
                      onMouseLeave={() => {
                        dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 300)
                      }}
                      onFocus={() => setOpenDropdown(link.label)}
                    >
                      <Link
                        href={link.href!}
                        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                          active
                            ? 'bg-maya-green/25 text-maya-green-dark dark:bg-maya-green/20 dark:text-maya-green'
                            : 'text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={16} />
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                        {link.badge && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </Link>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === link.label && (
                        <div className="absolute top-full left-0 pt-2 w-56 z-50">
                          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-maya-green/10 dark:border-gray-700 py-2">
                          {link.submenu!.map((sublink) => {
                            const SubIcon = sublink.icon
                            const subActive = isActive(sublink.href)
                            return (
                              <Link
                                key={sublink.href}
                                href={sublink.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  subActive
                                    ? 'bg-maya-green/25 text-maya-green-dark dark:bg-maya-green/20 dark:text-maya-green'
                                    : 'text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700'
                                }`}
                              >
                                <SubIcon size={16} />
                                {sublink.label}
                              </Link>
                            )
                          })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-maya-green/25 text-maya-green-dark dark:bg-maya-green/20 dark:text-maya-green'
                        : 'text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                    {link.badge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              {/* Favorites - only when logged in */}
              {(doador || user) && (
                <Link
                  href="/favoritos"
                  className="relative p-2 text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Favoritos"
                >
                  <Heart size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-maya-orange-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Notifications - only when logged in */}
              {(doador || user) && (
                <button
                  className="relative p-2 text-maya-brown dark:text-white hover:bg-maya-green/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Notificações"
                >
                  <Bell size={20} />
                  {hasNewAnimals && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              )}

              {/* Dark Mode */}
              <DarkModeToggle />

              {/* Admin Profile, Donor Profile or Login */}
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium text-maya-brown dark:text-white">Admin</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-maya-brown dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : doador ? (
                  <Link
                    href="/doador/dashboard"
                    className="flex items-center gap-2 px-3 py-2 bg-maya-green/25 dark:bg-maya-green/20 text-maya-green-dark dark:text-maya-green rounded-lg hover:bg-maya-green/40 dark:hover:bg-maya-green/30 transition-colors ml-2"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">Minha Conta</span>
                  </Link>
                ) : (
                  <Link 
                    href="/doador/login" 
                    className="flex items-center gap-2 px-3 py-2 border-2 border-maya-green-dark text-maya-green-dark dark:border-maya-green dark:text-maya-green rounded-lg hover:bg-maya-green-dark hover:text-maya-cream dark:hover:bg-maya-green dark:hover:text-gray-900 transition-colors ml-2 font-medium"
                >
                  <User size={16} />
                  <span className="text-sm">Área do Doador</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 xl:hidden">
              {/* Favorites Mobile - only when logged in */}
              {(doador || user) && (
                <Link
                  href="/favoritos"
                  className="relative p-2 text-maya-brown dark:text-white"
                  aria-label="Favoritos"
                >
                  <Heart size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-maya-orange-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              )}

              <DarkModeToggle />
              
              <button
                className="text-maya-brown dark:text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          {isSearchOpen && (
            <div ref={searchRef} className="hidden xl:block mt-4 pb-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar animais por nome, raça ou características..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-maya-green/20 dark:border-gray-600 focus:border-maya-green dark:focus:border-maya-green focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
                  autoFocus
                />
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 z-50 xl:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-display text-xl text-maya-brown dark:text-white">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-maya-brown dark:text-white" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar animais..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-maya-green focus:outline-none text-sm bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link, idx) => {
              const Icon = link.icon
              const active = link.href && isActive(link.href)
              const hasSubmenu = link.submenu && link.submenu.length > 0
              const isExpanded = openDropdown === link.label
              
              // No celular o rótulo e a seta são dois alvos separados: o
              // rótulo navega e fecha o menu, a seta abre a lista. Um único
              // botão que só expandia obrigava a descer um nível para então
              // escolher a página do próprio grupo.
              if (hasSubmenu) {
                return (
                  <div key={idx}>
                    <div
                      className={`flex items-center rounded-xl transition-all ${
                        active
                          ? 'bg-maya-green/25 text-maya-green-dark'
                          : 'text-maya-brown dark:text-white hover:bg-maya-green/10 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Link
                        href={link.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0"
                      >
                        <Icon size={20} />
                        <span className="font-medium">{link.label}</span>
                        {link.badge && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isExpanded ? null : link.label)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? `Fechar ${link.label}` : `Abrir ${link.label}`}
                        className="px-4 py-3 shrink-0"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    
                    {/* Submenu */}
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.submenu!.map((sublink) => {
                          const SubIcon = sublink.icon
                          const subActive = isActive(sublink.href)
                          return (
                            <Link
                              key={sublink.href}
                              href={sublink.href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                                subActive
                                  ? 'bg-maya-green text-maya-brown'
                                  : 'text-maya-brown dark:text-white/80 hover:bg-maya-green/10 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <SubIcon size={18} />
                              <span>{sublink.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-maya-green text-maya-brown'
                      : 'text-maya-brown dark:text-white hover:bg-maya-green/10 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="font-medium text-maya-brown dark:text-white">Área Admin</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              </>
            ) : doador ? (
              <Link
                href="/doador/dashboard"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-maya-green/25 dark:bg-maya-green/20 text-maya-green-dark dark:text-maya-green rounded-xl hover:bg-maya-green/40 dark:hover:bg-maya-green/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                <span className="font-medium">Minha Conta (Doador)</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/doador/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-maya-green-dark text-maya-green-dark dark:border-maya-green dark:text-maya-green rounded-xl hover:bg-maya-green-dark hover:text-maya-cream dark:hover:bg-maya-green dark:hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="font-medium">Área do Doador</span>
                </Link>
                <p className="text-xs text-center text-maya-brown/60 dark:text-gray-400 px-2">
                  Acompanhe suas doações e veja seu impacto
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
