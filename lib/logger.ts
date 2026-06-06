/**
 * Structured logger for server-side use (API routes, webhook, storage).
 * Uses Pino in production for JSON output, and a pretty console wrapper in development.
 */
import 'server-only'
import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // In development, log human-readable output; in production, machine-readable JSON.
  ...(isDev
    ? {
        transport: {
          target: 'pino/file',
          options: { destination: 1 }, // stdout
        },
      }
    : {}),
  base: {
    service: 'projeto-maya',
    env: process.env.NODE_ENV,
  },
  // Serialize Error objects under both 'err' and 'error' keys
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
  redact: {
    // Never log these fields even if accidentally passed to logger
    paths: ['email', 'password', 'token', 'authorization', '*.access_token', '*.email'],
    censor: '[REDACTED]',
  },
})

export function createRouteLogger(route: string) {
  return logger.child({ route })
}
