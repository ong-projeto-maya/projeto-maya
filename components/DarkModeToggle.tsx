'use client'

import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function DarkModeToggle() {
  const { isDark, toggleDarkMode, mounted } = useDarkMode()

  // Evitar problemas de hidratação
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-maya-beige flex items-center justify-center">
        <Moon className="w-5 h-5 text-maya-brown" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="w-10 h-10 rounded-full bg-maya-beige dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-maya-brown dark:text-white" />
      )}
    </button>
  )
}
