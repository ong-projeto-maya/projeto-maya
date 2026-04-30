'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ComingSoon from '@/components/ComingSoon'
import { Users } from 'lucide-react'

export default function AdminVoluntariosPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) return null

  return (
    <ComingSoon
      title="Gestão de Voluntários"
      description="O módulo de gestão de voluntários está em desenvolvimento. Em breve você poderá cadastrar, organizar escalas e acompanhar a participação de cada voluntário diretamente pelo painel administrativo."
      icon={Users}
      backHref="/admin"
      backLabel="Voltar ao Painel Admin"
      features={[
        'Cadastro e perfil de voluntários',
        'Controle de presença e escalas',
        'Notificação e comunicação em massa',
        'Relatório de horas e atividades',
        'Emissão de certificados digitais',
      ]}
    />
  )
}
