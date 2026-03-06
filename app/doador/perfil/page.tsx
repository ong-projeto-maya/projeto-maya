'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ArrowLeft, Mail, Phone, FileText, Save, LogOut } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'

export default function PerfilPage() {
  const { doador, isLoading, updateProfile, logout } = useDoador()
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!isLoading && !doador) {
      router.push('/doador/login')
    } else if (doador) {
      setName(doador.name)
      setPhone(doador.phone || '')
      setCpf(doador.cpf || '')
    }
  }, [doador, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maya-green mx-auto mb-4"></div>
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!doador) {
    return null
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')

    updateProfile({ name, phone, cpf })

    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 500)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/doador/dashboard"
            className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-display text-maya-brown dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Gerencie suas informações pessoais
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <div className="text-sm font-medium">{successMessage}</div>
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
            <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-6">
              Informações Pessoais
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={doador.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-maya-brown/50 dark:text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-maya-brown/60 dark:text-gray-400 mt-2">
                  O email não pode ser alterado. Entre em contato conosco se precisar mudá-lo.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  CPF
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400" size={20} />
                  <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  />
                </div>
                <p className="text-xs text-maya-brown/60 dark:text-gray-400 mt-2">
                  Necessário para emissão de recibos para declaração de IR
                </p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save size={20} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-6">
              Ações da Conta
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => alert('Funcionalidade de alterar senha será implementada')}
                className="w-full px-6 py-4 bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white rounded-xl hover:bg-maya-green/10 dark:hover:bg-gray-600 transition-colors font-semibold text-left"
              >
                Alterar Senha
              </button>

              <button
                onClick={() => alert('Funcionalidade de exportar dados será implementada')}
                className="w-full px-6 py-4 bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white rounded-xl hover:bg-maya-green/10 dark:hover:bg-gray-600 transition-colors font-semibold text-left"
              >
                Exportar Meus Dados
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold text-left inline-flex items-center gap-2"
              >
                <LogOut size={20} />
                Sair da Conta
              </button>

              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
                    alert('Funcionalidade de excluir conta será implementada')
                  }
                }}
                className="w-full px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold text-left"
              >
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
