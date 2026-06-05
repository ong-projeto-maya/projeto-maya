'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Search, Eye, Trash2, X, Check, Calendar, Phone, AtSign, Tag } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createAdminClient } from '@/lib/supabase-admin'

interface Mensagem {
  id: string
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  created_at: string
  lida: boolean
}

const subjectLabels: Record<string, string> = {
  adocao: 'Interesse em Adoção',
  doacao: 'Doações',
  voluntario: 'Voluntariado',
  apadrinhamento: 'Apadrinhamento',
  duvida: 'Dúvida Geral',
  outro: 'Outro',
}

export default function AdminMensagensPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createAdminClient(), [])

  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLida, setFilterLida] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedMsg, setSelectedMsg] = useState<Mensagem | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchMensagens = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('mensagens')
        .select('*')
        .order('created_at', { ascending: false })
      setMensagens((data ?? []) as Mensagem[])
      setIsLoading(false)
    }
    fetchMensagens()
  }, [isAuthenticated, supabase])

  const handleMarkRead = async (id: string, lida: boolean) => {
    await supabase.from('mensagens').update({ lida }).eq('id', id)
    setMensagens(prev => prev.map(m => m.id === id ? { ...m, lida } : m))
    if (selectedMsg?.id === id) setSelectedMsg(prev => prev ? { ...prev, lida } : prev)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('mensagens').delete().eq('id', id)
    setMensagens(prev => prev.filter(m => m.id !== id))
    if (selectedMsg?.id === id) setSelectedMsg(null)
    setSuccessMessage('Mensagem excluída com sucesso!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleOpen = async (msg: Mensagem) => {
    setSelectedMsg(msg)
    if (!msg.lida) {
      await handleMarkRead(msg.id, true)
    }
  }

  if (loading || !isAuthenticated) return null

  const filtered = mensagens.filter(m => {
    const matchSearch = !searchTerm ||
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLida =
      filterLida === 'all' ||
      (filterLida === 'unread' && !m.lida) ||
      (filterLida === 'read' && m.lida)
    return matchSearch && matchLida
  })

  const unreadCount = mensagens.filter(m => !m.lida).length

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green/80 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display text-maya-brown dark:text-white mb-2 flex items-center gap-3">
                Mensagens de Contato
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-maya-pink text-white text-sm font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-maya-brown/70 dark:text-gray-300">
                {mensagens.length} mensagem{mensagens.length !== 1 ? 's' : ''} recebida{mensagens.length !== 1 ? 's' : ''}
                {unreadCount > 0 && ` · ${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <Check size={18} />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: list */}
          <div className="lg:w-2/5 flex flex-col gap-4">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'unread', 'read'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterLida(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterLida === f
                        ? 'bg-maya-green text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {f === 'all' ? 'Todas' : f === 'unread' ? 'Não lidas' : 'Lidas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages list */}
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maya-green mx-auto mb-3" />
                  <p className="text-maya-brown/60 dark:text-gray-400 text-sm">Carregando...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
                  <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-maya-brown/60 dark:text-gray-400 text-sm">Nenhuma mensagem encontrada</p>
                </div>
              ) : filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleOpen(msg)}
                  className={`w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border-2 ${
                    selectedMsg?.id === msg.id
                      ? 'border-maya-green'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`font-semibold truncate text-sm ${msg.lida ? 'text-maya-brown/70 dark:text-gray-400' : 'text-maya-brown dark:text-white'}`}>
                      {msg.nome}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!msg.lida && <span className="w-2 h-2 bg-maya-pink rounded-full" />}
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-maya-green font-medium mb-1">
                    {subjectLabels[msg.assunto] ?? msg.assunto}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {msg.mensagem}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: detail */}
          <div className="lg:flex-1">
            {selectedMsg ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden sticky top-6">
                {/* Detail header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="font-display text-xl text-maya-brown dark:text-white">
                    {subjectLabels[selectedMsg.assunto] ?? selectedMsg.assunto}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkRead(selectedMsg.id, !selectedMsg.lida)}
                      className={`p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 ${
                        selectedMsg.lida
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          : 'bg-maya-green/10 text-maya-green hover:bg-maya-green/20'
                      }`}
                      title={selectedMsg.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                    >
                      <Eye size={15} />
                      {selectedMsg.lida ? 'Não lida' : 'Lida'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                      title="Excluir mensagem"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedMsg(null)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="px-6 py-4 bg-maya-beige/50 dark:bg-gray-700/30 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <AtSign size={14} className="text-maya-brown/40 flex-shrink-0" />
                    <a href={`mailto:${selectedMsg.email}`} className="text-maya-green hover:underline truncate">
                      {selectedMsg.email}
                    </a>
                  </div>
                  {selectedMsg.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-maya-brown/40 flex-shrink-0" />
                      <a href={`tel:${selectedMsg.telefone}`} className="text-maya-brown dark:text-gray-300">
                        {selectedMsg.telefone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-maya-brown/40 flex-shrink-0" />
                    <span className="text-maya-brown/70 dark:text-gray-400">
                      {new Date(selectedMsg.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })} às {new Date(selectedMsg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag size={14} className="text-maya-brown/40 flex-shrink-0" />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedMsg.lida
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        : 'bg-maya-pink/10 text-maya-pink'
                    }`}>
                      {selectedMsg.lida ? 'Lida' : 'Não lida'}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="p-6">
                  <p className="font-bold text-maya-brown dark:text-white mb-1 text-lg">{selectedMsg.nome}</p>
                  <p className="text-maya-brown/80 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMsg.mensagem}
                  </p>
                </div>

                {/* Reply actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: ${subjectLabels[selectedMsg.assunto] ?? selectedMsg.assunto} - Projeto Maya`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Responder por E-mail
                  </a>
                  {selectedMsg.telefone && (
                    <a
                      href={`https://wa.me/55${selectedMsg.telefone.replace(/\D/g, '')}?text=Olá ${selectedMsg.nome}! Recebemos sua mensagem pelo site do Projeto Maya sobre "${subjectLabels[selectedMsg.assunto] ?? selectedMsg.assunto}".`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center h-full flex flex-col items-center justify-center">
                <Mail className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-maya-brown/50 dark:text-gray-500 font-medium">
                  Selecione uma mensagem para visualizar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
