'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ComingSoon from '@/components/ComingSoon'
import { ClipboardList } from 'lucide-react'

export default function AdminAdotantesPage() {
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
      title="Gestão de Adotantes"
      description="O módulo de gestão de adotantes está em desenvolvimento. Em breve será possível acompanhar todo o processo de adoção, desde a triagem até o pós-adoção, diretamente pelo painel administrativo."
      icon={ClipboardList}
      backHref="/admin"
      backLabel="Voltar ao Painel Admin"
      features={[
        'Ficha completa de cada adotante',
        'Acompanhamento do processo de adoção',
        'Histórico de adoções por família',
        'Visitas domiciliares e follow-up',
        'Alertas de desistência e renegociação',
      ]}
    />
  )
}
