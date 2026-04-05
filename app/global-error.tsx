'use client'

// global-error.tsx — catches unhandled React rendering errors in the App Router.
// Sentry captures the error before showing the fallback UI.
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Algo deu errado</h1>
        <p className="text-gray-600">
          Ocorreu um erro inesperado. Nossa equipe já foi notificada.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
