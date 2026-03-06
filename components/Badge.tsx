import { Heart, Sparkles, PawPrint, Check } from 'lucide-react'

type BadgeType = 
  | 'adotado' 
  | 'srd' 
  | 'dessa-cor' 
  | 'novo' 
  | 'resgatado' 
  | 'quer-adotar'

interface BadgeProps {
  type: BadgeType
  className?: string
}

export default function Badge({ type, className = '' }: BadgeProps) {
  const badges = {
    'adotado': {
      text: 'ADOTADO',
      icon: Heart,
      colors: 'bg-maya-green text-white',
      iconColor: 'fill-white'
    },
    'srd': {
      text: 'SEM RAÇA DEFINIDA COM ORGULHO',
      icon: Sparkles,
      colors: 'bg-maya-brown text-white',
      iconColor: 'text-white'
    },
    'dessa-cor': {
      text: '"DESSA COR EU NÃO TENHO"',
      icon: null,
      colors: 'bg-maya-orange text-white',
      iconColor: ''
    },
    'novo': {
      text: 'NOVO',
      icon: Sparkles,
      colors: 'bg-maya-blue text-white',
      iconColor: 'text-white'
    },
    'resgatado': {
      text: 'RESGATADO',
      icon: PawPrint,
      colors: 'bg-maya-sand text-white',
      iconColor: 'text-white'
    },
    'quer-adotar': {
      text: 'QUER ME ADOTAR?',
      icon: Heart,
      colors: 'bg-maya-pink text-white',
      iconColor: 'text-white'
    }
  }

  const badge = badges[type]
  const Icon = badge.icon

  return (
    <div 
      className={`
        inline-flex items-center gap-2 
        px-4 py-2 rounded-full 
        font-body font-bold text-xs 
        uppercase tracking-wider
        shadow-lg
        ${badge.colors}
        ${className}
      `}
    >
      {Icon && <Icon size={14} className={badge.iconColor} />}
      <span>{badge.text}</span>
    </div>
  )
}

// Export helper para usar badges diretamente
export function AdoptedBadge({ className = '' }: { className?: string }) {
  return <Badge type="adotado" className={className} />
}

export function SRDBadge({ className = '' }: { className?: string }) {
  return <Badge type="srd" className={className} />
}

export function NewBadge({ className = '' }: { className?: string }) {
  return <Badge type="novo" className={className} />
}

export function RescuedBadge({ className = '' }: { className?: string }) {
  return <Badge type="resgatado" className={className} />
}

export function WantToAdoptBadge({ className = '' }: { className?: string }) {
  return <Badge type="quer-adotar" className={className} />
}

export function DessaCorBadge({ className = '' }: { className?: string }) {
  return <Badge type="dessa-cor" className={className} />
}
