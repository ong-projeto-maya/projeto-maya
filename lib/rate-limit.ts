/**
 * lib/rate-limit.ts
 *
 * Distributed sliding-window rate limiter backed by Upstash Redis.
 * Falls back to an in-memory Map when Upstash env vars are absent (local dev / CI).
 *
 * Usage in middleware.ts:
 *   import { checkRateLimit } from '@/lib/rate-limit'
 *   const blocked = await checkRateLimit(ip, identifier, max, windowSeconds)
 *   if (blocked) return NextResponse.json(..., { status: 429 })
 *
 * Required env vars (Upstash, optional — falls back to in-memory):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import type { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// In-memory fallback (single-instance only — used in dev / CI)
// ---------------------------------------------------------------------------
interface MemWindow { count: number; resetAt: number }
const memStore = new Map<string, MemWindow>()
let lastMemPrune = Date.now()

function memRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  // Periodic prune to avoid memory growth
  if (now - lastMemPrune > 60_000) {
    lastMemPrune = now
    for (const [k, w] of memStore) {
      if (now > w.resetAt) memStore.delete(k)
    }
  }
  const entry = memStore.get(key)
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs })
    return false // allowed
  }
  entry.count += 1
  return entry.count > max // blocked
}

// ---------------------------------------------------------------------------
// Upstash Redis sliding window
// ---------------------------------------------------------------------------
let _ratelimit: import('@upstash/ratelimit').Ratelimit | null = null

function getUpstashLimiter(
  max: number,
  windowSeconds: number
): import('@upstash/ratelimit').Ratelimit | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  // Lazy import — Upstash packages are ESM-compatible and edge-safe
  const { Ratelimit } = require('@upstash/ratelimit') as typeof import('@upstash/ratelimit')
  const { Redis }     = require('@upstash/redis')     as typeof import('@upstash/redis')

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
    analytics: false,
    prefix: 'maya_rl',
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the request EXCEEDS the rate limit and should be blocked.
 *
 * @param ip            Caller IP (already extracted by middleware)
 * @param identifier    Route path or action name, e.g. '/api/create-checkout-session'
 * @param max           Maximum allowed requests per window
 * @param windowSeconds Window size in seconds
 */
export async function checkRateLimit(
  ip: string,
  identifier: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      const limiter = getUpstashLimiter(max, windowSeconds)!
      const key     = `${ip}:${identifier}`
      const { success } = await limiter.limit(key)
      return !success // blocked when success === false
    } catch {
      // If Redis is temporarily unavailable, fail-open (allow the request)
      // to avoid a Redis outage taking down the whole application.
      return false
    }
  }

  // Fallback: in-memory (dev / CI)
  return memRateLimit(`${ip}:${identifier}`, max, windowSeconds * 1_000)
}

/** Extracts the best available IP from a Next.js request. */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}
