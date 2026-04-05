// This file configures Sentry for the Node.js runtime (server components,
// API route handlers, Server Actions).
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Attach the user's IP only when they consent (LGPD compliance)
  sendDefaultPii: false,

  enabled: !!process.env.SENTRY_DSN,
})
