'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ComingSoon from '@/components/ComingSoon'
import { BarChart3 } from 'lucide-react'

export default function AdminRelatoriosPage() {
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
      title="Relatórios"
      description="O módulo de relatórios está em desenvolvimento. Em breve você terá acesso a dashboards completos com métricas de doações, adoções, voluntários e impacto do Projeto Maya."
      icon={BarChart3}
      backHref="/admin"
      backLabel="Voltar ao Painel Admin"
      features={[
        'Dashboard financeiro com arrecadação mensal',
        'Métricas de adoções por período e espécie',
        'Taxa de sucesso e follow-up pós-adoção',
        'Engajamento e crescimento de voluntários',
        'Exportação de relatórios em PDF e Excel',
      ]}
    />
  )
}
