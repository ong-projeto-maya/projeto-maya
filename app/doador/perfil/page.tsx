'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ArrowLeft, Mail, Phone, FileText, Save, LogOut, Lock, Download, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'
import { createClient } from '@/lib/supabase'

export default function PerfilPage() {
  const { doador, isLoading, updateProfile, logout } = useDoador()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMessage, setPwMessage] = useState('')

  // Delete account
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')
    try {
      await updateProfile({ name, phone, cpf })
      setSuccessMessage('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch {
      setErrorMessage('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPwMessage('As senhas não coincidem.')
      return
    }
    if (newPassword.length < 6) {
      setPwMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    setPwSaving(true)
    setPwMessage('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwSaving(false)
    if (error) {
      setPwMessage('Erro ao alterar senha. Tente novamente.')
    } else {
      setPwMessage('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => { setPwMessage(''); setShowPasswordForm(false) }, 2500)
    }
  }

  const handleExportData = () => {
    const data = {
      perfil: {
        nome: doador.name,
        email: doador.email,
        telefone: doador.phone ?? null,
        cpf: doador.cpf ?? null,
        nivel: doador.level,
        total_doado: doador.totalDonated,
        contagem_doacoes: doador.donationCount,
        primeira_doacao: doador.firstDonation,
      },
      doacoes: doador.donations.map(d => ({
        id: d.id,
        data: d.date,
        valor: d.amount,
        tipo: d.type,
        status: d.status,
        campanha: d.campaignName ?? null,
      })),
      exportado_em: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maya-meus-dados-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()
    if (!user || !session) { setDeleteError('Sessão expirada. Faça login novamente.'); setDeleteLoading(false); return }
    const res = await fetch('/api/delete-account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const { error } = await res.json()
    if (error) { setDeleteError('Erro ao excluir conta. Entre em contato conosco.'); setDeleteLoading(false); return }
    await logout()
    router.push('/?conta=excluida')
  }

  const handleLogout = async () => {
    await logout()
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
          {/* Success / Error Messages */}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <div className="text-sm font-medium">{successMessage}</div>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <div className="text-sm font-medium">{errorMessage}</div>
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
              {/* Change Password */}
              <div>
                <button
                  onClick={() => { setShowPasswordForm(p => !p); setPwMessage('') }}
                  className="w-full px-6 py-4 bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white rounded-xl hover:bg-maya-green/10 dark:hover:bg-gray-600 transition-colors font-semibold text-left inline-flex items-center gap-2"
                >
                  <Lock size={20} />
                  Alterar Senha
                </button>
                {showPasswordForm && (
                  <form onSubmit={handleChangePassword} className="mt-3 bg-maya-beige/50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Nova senha (mín. 6 caracteres)"
                        required
                        className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white text-sm"
                      />
                      <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-maya-brown/40 dark:text-gray-400">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirmar nova senha"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green dark:focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white text-sm"
                    />
                    {pwMessage && (
                      <p className={`text-sm font-medium ${pwMessage.includes('sucesso') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {pwMessage}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="btn-primary w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pwSaving ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>
                  </form>
                )}
              </div>

              {/* Export Data */}
              <button
                onClick={handleExportData}
                className="w-full px-6 py-4 bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white rounded-xl hover:bg-maya-green/10 dark:hover:bg-gray-600 transition-colors font-semibold text-left inline-flex items-center gap-2"
              >
                <Download size={20} />
                Exportar Meus Dados
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold text-left inline-flex items-center gap-2"
              >
                <LogOut size={20} />
                Sair da Conta
              </button>

              {/* Delete Account */}
              <div>
                <button
                  onClick={() => { setShowDeleteModal(true); setDeleteError('') }}
                  disabled={deleteLoading}
                  className="w-full px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold text-left inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                  Excluir Conta
                </button>
                {deleteError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-maya-brown dark:text-white">
                Excluir Conta
              </h3>
            </div>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-2">
              Tem certeza que deseja excluir sua conta? Esta ação <strong>não pode ser desfeita</strong>.
            </p>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-6">
              Todos os seus dados, histórico de doações e informações de perfil serão removidos permanentemente.
            </p>
            {deleteError && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-maya-brown dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
