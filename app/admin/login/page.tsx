'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, AlertCircle, PawPrint } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Se já está autenticado, redirecionar para dashboard
    if (!loading && isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(username, password)

    if (success) {
      router.push('/admin')
    } else {
      setError('Usuário ou senha incorretos')
      setIsLoading(false)
      // Limpar senha por segurança
      setPassword('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-12 h-12 text-maya-olive mx-auto mb-4 animate-pulse" />
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
            <div className="w-12 h-12 bg-maya-olive rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white">
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
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maya-brown/40 dark:text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive dark:focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="Digite seu usuário"
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
                  className="w-full pl-10 pr-12 py-3 border-2 border-maya-olive/20 dark:border-gray-600 rounded-xl focus:border-maya-olive dark:focus:border-maya-olive focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400 hover:text-maya-olive dark:hover:text-maya-olive transition-colors"
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
              className="w-full bg-maya-olive hover:bg-maya-olive-light text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Informação de Credenciais (Apenas para demonstração) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-maya-olive/10 dark:bg-maya-olive/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-maya-brown dark:text-white mb-2">
                🔒 Credenciais de Demonstração:
              </p>
              <div className="text-xs text-maya-brown/70 dark:text-gray-300 space-y-1">
                <p>Usuário: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">admin</code></p>
                <p>Senha: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">maya2024</code></p>
              </div>
              <p className="text-xs text-maya-brown/60 dark:text-gray-400 mt-2">
                ⚠️ Em produção, remova estas informações e implemente autenticação real via backend.
              </p>
            </div>
          </div>
        </div>

        {/* Link para Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-maya-olive hover:text-maya-olive-light font-semibold"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}
