import ComingSoon from '@/components/ComingSoon'
import { Users } from 'lucide-react'

export default function QuemSomosPage() {
  return (
    <ComingSoon
      title="Quem Somos"
      description="Estamos preparando uma página especial para contar a história do Projeto Maya — nossa missão, equipe e o impacto que já geramos juntos. Em breve!"
      icon={Users}
      backHref="/"
      backLabel="Voltar ao início"
      features={[
        'História e origem do Projeto Maya',
        'Conheça nossa equipe e voluntários',
        'Impacto em números: resgates, adoções e campanhas',
        'Transparência: como usamos cada doação',
        'Parceiros e apoiadores da causa',
      ]}
    />
  )
}


