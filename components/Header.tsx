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
  ClipboardList, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  MapPin, 
  MessageSquare,
  Search,
  Bell,
  User,
  LogOut
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
  const pathname = usePathname()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()
  const { doador } = useDoador()
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Scroll effect - encolhe menu ao rolar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
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
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/adocao', label: 'Adotar', icon: PawPrint, badge: hasNewAnimals },
    { href: '/doacoes', label: 'Doar', icon: Heart },
    { href: '/quiz', label: 'Quiz', icon: ClipboardList },
    { href: '/eventos', label: 'Eventos', icon: Calendar },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/localizacao', label: 'Mapa', icon: MapPin },
    { href: '/contato', label: 'Contato', icon: MessageSquare },
  ]

  return (
    <>
      <header 
        className={`bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-all duration-300">
              <img 
                src="/logo-2.png" 
                alt="Projeto Maya" 
                className={`w-auto transition-all duration-300 ${
                  isScrolled ? 'h-8' : 'h-12'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-maya-olive/10 text-maya-olive dark:bg-maya-olive/20'
                        : 'text-maya-brown dark:text-white hover:bg-maya-olive/5 dark:hover:bg-gray-700'
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
                className="p-2 text-maya-brown dark:text-white hover:bg-maya-olive/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              {/* Favorites */}
              <Link
                href="/favoritos"
                className="relative p-2 text-maya-brown dark:text-white hover:bg-maya-olive/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Favoritos"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maya-olive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <button
                className="relative p-2 text-maya-brown dark:text-white hover:bg-maya-olive/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Notificações"
              >
                <Bell size={20} />
                {hasNewAnimals && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

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
                  className="flex items-center gap-2 px-3 py-2 bg-maya-olive/10 dark:bg-maya-olive/20 text-maya-olive dark:text-maya-olive-light rounded-lg hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors ml-2"
                >
                  <User size={16} />
                  <span className="text-sm font-medium">Minha Conta</span>
                </Link>
              ) : (
                <Link 
                  href="/doador/login" 
                  className="flex items-center gap-2 px-3 py-2 border-2 border-maya-olive text-maya-olive dark:text-maya-olive-light rounded-lg hover:bg-maya-olive hover:text-white dark:hover:bg-maya-olive dark:hover:text-white transition-colors ml-2 font-medium"
                >
                  <User size={16} />
                  <span className="text-sm">Área do Doador</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 xl:hidden">
              {/* Favorites Mobile */}
              <Link
                href="/favoritos"
                className="relative p-2 text-maya-brown dark:text-white"
                aria-label="Favoritos"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maya-olive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-maya-olive/20 dark:border-gray-600 focus:border-maya-olive dark:focus:border-maya-olive focus:outline-none text-maya-brown dark:text-white bg-white dark:bg-gray-700"
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
            <h2 className="font-display font-bold text-xl text-maya-brown dark:text-white">Menu</h2>
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
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-maya-olive focus:outline-none text-sm bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-maya-olive text-white'
                      : 'text-maya-brown dark:text-white hover:bg-maya-olive/10 dark:hover:bg-gray-700'
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
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-maya-olive/10 dark:bg-maya-olive/20 text-maya-olive dark:text-maya-olive-light rounded-xl hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                <span className="font-medium">Minha Conta (Doador)</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/doador/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-maya-olive text-maya-olive dark:text-maya-olive-light rounded-xl hover:bg-maya-olive hover:text-white dark:hover:bg-maya-olive dark:hover:text-white transition-colors"
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
