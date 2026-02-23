'use client'

import { useState, useEffect } from 'react'

interface User {
  username: string
  role: 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há sessão ativa
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('maya_admin_user')
        const loginTime = localStorage.getItem('maya_admin_login_time')
        
        if (storedUser && loginTime) {
          // Verificar se sessão expirou (24 horas)
          const elapsed = Date.now() - parseInt(loginTime)
          const twentyFourHours = 24 * 60 * 60 * 1000
          
          if (elapsed < twentyFourHours) {
            setUser(JSON.parse(storedUser))
          } else {
            // Sessão expirada
            logout()
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (username: string, password: string): boolean => {
    // TODO: Em produção, validar com backend/API
    // Credenciais de exemplo (MUDAR EM PRODUÇÃO!)
    const validCredentials = [
      { username: 'admin', password: 'maya2024' },
      { username: 'projetomaya', password: 'admin123' }
    ]

    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    )

    if (isValid) {
      const userData: User = {
        username,
        role: 'admin'
      }
      
      localStorage.setItem('maya_admin_user', JSON.stringify(userData))
      localStorage.setItem('maya_admin_login_time', String(Date.now()))
      setUser(userData)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem('maya_admin_user')
    localStorage.removeItem('maya_admin_login_time')
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }
}
