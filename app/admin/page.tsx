'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PawPrint, Heart, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, AlertTriangle, Dog, Cat, LogOut } from 'lucide-react'
import { animals, stats } from '@/data/animals'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'animals' | 'donations'>('overview')
  const router = useRouter()
  const { user, loading, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    // Redirecionar para login se não autenticado
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout()
      router.push('/admin/login')
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-12 h-12 text-maya-olive mx-auto mb-4 animate-pulse" />
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderizar se não autenticado (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img 
              src="/logo.png" 
              alt="Projeto Maya" 
              className="h-16 w-auto hidden sm:block"
            />
            <div>
              <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2">
                Dashboard Administrativo
              </h1>
              <p className="text-maya-brown/60 dark:text-gray-400">
                Gerencie animais, doações e estatísticas do Projeto Maya
              </p>
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-maya-brown dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-maya-brown/60 dark:text-gray-400">
                Administrador
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Dashboard em Desenvolvimento
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Esta é uma versão de demonstração. Para funcionalidade completa, é necessário conectar um banco de dados (Supabase, Firebase, etc) e implementar autenticação.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-olive/10 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-maya-olive" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.rescued}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Animais Resgatados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.adopted}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Adoções Realizadas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              {stats.volunteers}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">Voluntários Ativos</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-maya-blue/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-maya-blue" />
              </div>
              <span className="text-xs font-semibold text-maya-olive bg-maya-olive/10 px-2 py-1 rounded-full">
                {Math.round((stats.currentDonations / stats.monthlyGoal) * 100)}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-maya-brown dark:text-white mb-1">
              R$ {stats.currentDonations.toLocaleString()}
            </h3>
            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Meta: R$ {stats.monthlyGoal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-maya-olive border-b-2 border-maya-olive'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-olive'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('animals')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'animals'
                  ? 'text-maya-olive border-b-2 border-maya-olive'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-olive'
              }`}
            >
              Animais
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'donations'
                  ? 'text-maya-olive border-b-2 border-maya-olive'
                  : 'text-maya-brown/60 dark:text-gray-400 hover:text-maya-olive'
              }`}
            >
              Doações
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-4">
                Atividades Recentes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-maya-beige dark:bg-gray-700 rounded-lg">
                  <Heart className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-maya-brown dark:text-white">
                      Nova adoção realizada
                    </p>
                    <p className="text-xs text-maya-brown/60 dark:text-gray-400">
                      Mel foi adotada - Há 2 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-maya-beige dark:bg-gray-700 rounded-lg">
                  <DollarSign className="w-5 h-5 text-maya-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-maya-brown dark:text-white">
                      Doação recebida: R$ 100
                    </p>
                    <p className="text-xs text-maya-brown/60 dark:text-gray-400">
                      Doação mensal - Há 3 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-maya-beige dark:bg-gray-700 rounded-lg">
                  <PawPrint className="w-5 h-5 text-maya-olive mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-maya-brown dark:text-white">
                      Novo resgate realizado
                    </p>
                    <p className="text-xs text-maya-brown/60 dark:text-gray-400">
                      Cachorro encontrado - Há 5 horas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-4">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/animais"
                  className="p-4 bg-maya-olive/10 hover:bg-maya-olive/20 rounded-xl transition-colors text-left"
                >
                  <Plus className="w-6 h-6 text-maya-olive mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Gerenciar Animais
                  </p>
                </Link>
                <Link
                  href="/admin/eventos"
                  className="p-4 bg-maya-blue/10 hover:bg-maya-blue/20 rounded-xl transition-colors text-left"
                >
                  <Edit className="w-6 h-6 text-maya-blue mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Gerenciar Eventos
                  </p>
                </Link>
                <Link
                  href="/doacoes"
                  className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-xl transition-colors text-left"
                >
                  <DollarSign className="w-6 h-6 text-green-500 mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Ver Doações
                  </p>
                </Link>
                <Link
                  href="/adocao"
                  className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-colors text-left"
                >
                  <PawPrint className="w-6 h-6 text-purple-500 mb-2" />
                  <p className="font-semibold text-maya-brown dark:text-white text-sm">
                    Ver Site
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'animals' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white">
                Gerenciar Animais
              </h2>
              <Link
                href="/admin/animais"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Ir para Gerenciamento
              </Link>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Idade</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-maya-brown dark:text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal) => (
                      <tr key={animal.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-maya-beige/50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={animal.image} alt={animal.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-semibold text-maya-brown dark:text-white">{animal.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-maya-brown/70 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            {animal.type === 'dog' ? (
                              <>
                                <Dog size={16} />
                                Cão
                              </>
                            ) : (
                              <>
                                <Cat size={16} />
                                Gato
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-maya-brown/70 dark:text-gray-300">{animal.age}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            animal.isAdopted
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-maya-olive/10 text-maya-olive'
                          }`}>
                            {animal.isAdopted ? 'Adotado' : 'Disponível'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-maya-beige dark:hover:bg-gray-600 rounded-lg transition-colors">
                              <Edit size={16} className="text-maya-brown dark:text-gray-300" />
                            </button>
                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-6">
              Relatório de Doações
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-maya-brown dark:text-white">Meta Mensal</span>
                <span className="text-maya-olive font-bold">
                  {Math.round((stats.currentDonations / stats.monthlyGoal) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-maya-olive to-maya-olive-light h-full transition-all duration-500"
                  style={{ width: `${(stats.currentDonations / stats.monthlyGoal) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2 text-maya-brown/60 dark:text-gray-400">
                <span>R$ {stats.currentDonations.toLocaleString()}</span>
                <span>R$ {stats.monthlyGoal.toLocaleString()}</span>
              </div>
            </div>

            {/* Mock Donations Table */}
            <div className="bg-maya-beige dark:bg-gray-700 rounded-xl p-6 text-center">
              <DollarSign className="w-12 h-12 text-maya-olive mx-auto mb-3" />
              <p className="text-maya-brown/70 dark:text-gray-300 mb-4">
                Conecte um banco de dados para ver o histórico completo de doações
              </p>
              <Link href="/doacoes" className="btn-primary inline-block">
                Ir para Página de Doações
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
