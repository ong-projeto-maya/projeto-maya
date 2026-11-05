'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, User, Eye, EyeOff, AlertCircle, PawPrint } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { safeRedirectPath } from '@/lib/safeRedirect'

function AdminLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, loading } = useAuth()

  // Same as the donor login: the middleware saved where the admin was going.
  // safeRedirectPath keeps the target inside /admin.
  const destination = safeRedirectPath(searchParams.get('redirectTo'), '/admin', '/admin')

  useEffect(() => {
    // Se já está autenticado, redirecionar para dashboard
    if (!loading && isAuthenticated) {
      router.push(destination)
    }
  }, [isAuthenticated, loading, router, destination])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(username, password)

    if (success) {
      router.push(destination)
    } else {
      setError('E-mail ou senha incorretos')
      setIsLoading(false)
      // Limpar senha por segurança
      setPassword('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-12 h-12 text-maya-green mx-auto mb-4 animate-pulse" />
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Projeto Maya" 
              className="h-24 w-auto drop-shadow-2xl"
            />
          </div>
          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-display text-maya-brown dark:text-white">
              Acesso Administrativo
            </h1>
          </div>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Projeto Maya Dashboard
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerta de Erro */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Campo Usuário */}
            <div>
              <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                E-mail ou usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maya-brown/40 dark:text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border-2 border-maya-green/20 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maya-brown/40 dark:text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-maya-green/20 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400 hover:text-maya-green dark:hover:text-maya-green transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-maya-green hover:bg-maya-green text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>


        </div>

        {/* Link para Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-maya-green hover:text-maya-green font-semibold"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Same reason as the donor login: useSearchParams suspends, and this page is
 * statically prerendered, so the form goes inside a Suspense boundary.
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-maya-beige dark:bg-gray-900" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
