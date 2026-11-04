'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogIn, Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

export default function DoadorLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { doador, isLoading: authLoading, login } = useDoador()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && doador) {
      router.push('/doador/dashboard')
    }
  }, [doador, authLoading, router])

  // Enquanto verifica sessão existente, não mostra o formulário
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Sessão ativa confirmada — aguarda redirect do useEffect
  if (doador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    try {
      const errorMsg = await login(email, password)
      if (errorMsg) {
        setError(errorMsg)
      } else {
        router.push('/doador/dashboard')
      }
    } catch (e) {
      console.error('[login] exception:', e)
      setError('Erro ao entrar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Projeto Maya"
              width={388}
              height={141}
              quality={100}
              className="h-24 w-auto drop-shadow-2xl dark:brightness-0 dark:invert"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display text-maya-brown dark:text-white mb-2">
              Área do Doador
            </h2>
            <p className="text-maya-brown/70 dark:text-gray-400">
              Acesse sua conta para ver seu impacto
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <div className="text-sm">{error}</div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400 hover:text-maya-brown dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Entrando...</>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="text-sm text-maya-brown/60 dark:text-gray-400">ou</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-maya-brown/70 dark:text-gray-400 mb-3">
              Ainda não é um doador?
            </p>
            <Link
              href="/doador/registro"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-maya-beige dark:bg-gray-700 text-maya-green dark:text-maya-green rounded-xl hover:bg-maya-green/10 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              <Heart size={20} />
              Criar Conta de Doador
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-maya-brown/60 dark:text-gray-400 hover:text-maya-green dark:hover:text-maya-green"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
