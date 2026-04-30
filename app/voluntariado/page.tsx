import ComingSoon from '@/components/ComingSoon'
import { HandHeart } from 'lucide-react'

export default function VoluntariadoPage() {
  return (
    <ComingSoon
      title="Seja Voluntário"
      description="Estamos preparando uma plataforma completa para conectar voluntários ao Projeto Maya. Em breve você poderá se cadastrar, escolher sua área de atuação e começar a fazer a diferença!"
      icon={HandHeart}
      backHref="/"
      backLabel="Voltar ao início"
      features={[
        'Cadastro de voluntários com área de interesse',
        'Agenda de atividades e escala de apoio',
        'Acompanhamento do impacto gerado por cada voluntário',
        'Canal direto com a coordenação do Projeto Maya',
        'Certificado de voluntariado digital',
      ]}
    />
  )
}
