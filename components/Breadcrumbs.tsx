'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  adocao: 'Adoção',
  doacoes: 'Doações',
  quiz: 'Quiz',
  eventos: 'Eventos',
  blog: 'Blog',
  faq: 'FAQ',
  contato: 'Contato',
  localizacao: 'Localização',
  admin: 'Admin',
  favoritos: 'Favoritos',
  sucesso: 'Sucesso',
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  // Não mostrar breadcrumbs na home ou páginas admin
  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', href: '/' },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Se for um ID numérico, pegar o nome do animal ou categoria
    const isLast = index === segments.length - 1
    const label = routeLabels[segment] || (isLast ? 'Detalhes' : segment)
    
    breadcrumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: currentPath,
    })
  })

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            const isFirst = index === 0

            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight 
                    size={16} 
                    className="text-maya-brown/30 dark:text-gray-500" 
                  />
                )}
                
                {isLast ? (
                  <span className="text-maya-olive dark:text-maya-olive-light font-medium flex items-center gap-1">
                    {isFirst && <Home size={14} />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-maya-brown/60 dark:text-gray-400 hover:text-maya-olive dark:hover:text-maya-olive-light transition-colors flex items-center gap-1"
                  >
                    {isFirst && <Home size={14} />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
