import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

export default function LoadingSpinner({ size = 40, className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Loader2 size={size} className="animate-spin text-maya-green" />
      {text && <p className="text-maya-brown/70 animate-pulse">{text}</p>}
    </div>
  )
}
