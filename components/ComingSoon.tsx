import Link from 'next/link'
import { ArrowLeft, Construction, Home, Heart, PawPrint, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  icon?: LucideIcon
  backHref?: string
  backLabel?: string
  features?: string[]
}

export default function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
  backHref = '/',
  backLabel = 'Voltar ao início',
  features = [],
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center py-20 relative overflow-hidden">
      {/* Decorative paw prints */}
      <div className="absolute top-10 left-[5%] opacity-[0.06] rotate-[-20deg] pointer-events-none">
        <PawPrint size={120} className="text-maya-brown dark:text-white" />
      </div>
      <div className="absolute bottom-16 right-[6%] opacity-[0.06] rotate-[15deg] pointer-events-none">
        <PawPrint size={90} className="text-maya-brown dark:text-white" />
      </div>
      <div className="absolute top-1/2 right-[3%] -translate-y-1/2 opacity-[0.04] rotate-[30deg] pointer-events-none hidden md:block">
        <PawPrint size={60} className="text-maya-brown dark:text-white" />
      </div>
      <div className="absolute top-1/3 left-[2%] opacity-[0.04] rotate-[-10deg] pointer-events-none hidden md:block">
        <PawPrint size={50} className="text-maya-brown dark:text-white" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Back link */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-maya-sand dark:text-gray-400 hover:text-maya-brown dark:hover:text-white transition-colors mb-10 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          {/* Icon with animated ring */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-maya-green/15 dark:bg-maya-green/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-maya-green/25 dark:bg-maya-green/30 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-maya-green" />
                </div>
              </div>
              {/* Orbiting paw */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
                <Clock size={16} className="text-maya-orange" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-maya-orange/10 dark:bg-maya-orange/20 text-maya-orange rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-maya-orange rounded-full animate-pulse" />
            Em Breve
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg text-maya-brown/70 dark:text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Coming features */}
          {features.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-10 text-left">
              <h3 className="font-display text-lg text-maya-brown dark:text-white mb-4 flex items-center gap-2">
                <PawPrint size={18} className="text-maya-green" />
                O que está chegando
              </h3>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-maya-brown/80 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-maya-green/15 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-maya-green" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center gap-2 justify-center">
              <Home size={18} />
              Ir à Home
            </Link>
            <Link href="/contato" className="btn-secondary inline-flex items-center gap-2 justify-center">
              <Heart size={18} />
              Fale Conosco
            </Link>
          </div>

          {/* Paw divider */}
          <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
            <div className="h-px w-16 bg-maya-brown dark:bg-white" />
            <PawPrint size={16} className="text-maya-brown dark:text-white" />
            <div className="h-px w-16 bg-maya-brown dark:bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
