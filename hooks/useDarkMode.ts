'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Rotas onde o modo escuro vale.
 *
 * Só a área logada. O site público nunca teve regras `dark:` nos seus
 * componentes — ligar o escuro ali deixava o cabeçalho preto e o resto claro,
 * com os cards de "Como Ajudar" em texto marrom sobre fundo quase preto
 * (contraste 1,57:1, quando o mínimo da norma é 4,5). A identidade da marca
 * também é de luz quente: tons terrosos, fundo sólido claro atrás do animal.
 *
 * O mesmo recorte está no script de inicialização em `app/layout.tsx`. Se
 * mudar aqui, mude lá também — senão a página pisca.
 */
const ROTAS_COM_MODO_ESCURO = ['/admin', '/doador']

export function aceitaModoEscuro(pathname: string | null): boolean {
  if (!pathname) return false
  return ROTAS_COM_MODO_ESCURO.some((rota) => pathname.startsWith(rota))
}

export function useDarkMode() {
  const pathname = usePathname()
  const disponivel = aceitaModoEscuro(pathname)

  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!disponivel) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
      return
    }

    // Preferência salva pelo usuário; na falta dela, a do sistema
    const stored = localStorage.getItem('maya_dark_mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const initialDark = stored !== null ? stored === 'true' : prefersDark
    setIsDark(initialDark)

    if (initialDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [disponivel])

  const toggleDarkMode = () => {
    if (!disponivel) return

    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('maya_dark_mode', String(newValue))

      if (newValue) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      return newValue
    })
  }

  return { isDark, toggleDarkMode, mounted, disponivel }
}
