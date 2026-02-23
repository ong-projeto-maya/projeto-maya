'use client'

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verificar preferência salva ou do sistema
    const stored = localStorage.getItem('maya_dark_mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialDark = stored !== null ? stored === 'true' : prefersDark
    setIsDark(initialDark)
    
    // Aplicar a classe dark ao documento
    if (initialDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
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

  return { isDark, toggleDarkMode, mounted }
}
