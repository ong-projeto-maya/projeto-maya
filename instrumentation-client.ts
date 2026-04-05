// instrumentation-client.ts — Sentry browser initialisation (replaces sentry.client.config.ts).
// Next.js loads this file automatically in the browser for App Router projects.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 10% of transactions sampled in production, 100% in dev/staging
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture session replays only on errors to stay within the free tier
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,    // LGPD: mask PII in recordings
      blockAllMedia: true,
    }),
  ],

  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
})

// Required by Sentry to instrument client-side navigations in Next.js App Router
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
