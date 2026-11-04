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
/**
 * One limiter per (max, window) pair, reused across requests.
 *
 * Each rule in middleware.ts has its own window, so a single cached limiter
 * would be wrong — the key has to carry the window. A previous version declared
 * a cache variable and never assigned it, so every request built a fresh
 * Ratelimit and a fresh Redis client.
 */
const limiterCache = new Map<string, import('@upstash/ratelimit').Ratelimit>()

function getUpstashLimiter(
  max: number,
  windowSeconds: number
): import('@upstash/ratelimit').Ratelimit | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const cacheKey = `${max}:${windowSeconds}`
  const cached = limiterCache.get(cacheKey)
  if (cached) return cached

  // Lazy import — Upstash packages are ESM-compatible and edge-safe
  const { Ratelimit } = require('@upstash/ratelimit') as typeof import('@upstash/ratelimit')
  const { Redis }     = require('@upstash/redis')     as typeof import('@upstash/redis')

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
    analytics: false,
    prefix: 'maya_rl',
  })
  limiterCache.set(cacheKey, limiter)
  return limiter
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

let warnedAboutFallback = false

/**
 * The in-memory fallback counts per instance and resets on every cold start.
 * On Vercel that means the limits barely hold in production, and silently —
 * nothing in the app says the limiter is not really limiting. Say it once, so
 * it shows up in the logs instead of being discovered the hard way.
 */
function warnIfProductionFallback(): void {
  if (warnedAboutFallback) return
  warnedAboutFallback = true
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN are not set: falling back to ' +
      'an in-memory counter. It is per instance and resets on cold start, so ' +
      'the limits in middleware.ts are not actually enforced.'
    )
  }
}

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
  const limiter = getUpstashLimiter(max, windowSeconds)

  if (limiter) {
    try {
      const { success } = await limiter.limit(`${ip}:${identifier}`)
      return !success // blocked when success === false
    } catch {
      // If Redis is temporarily unavailable, fail-open (allow the request)
      // to avoid a Redis outage taking down the whole application.
      return false
    }
  }

  warnIfProductionFallback()
  // Fallback: in-memory. Fine for dev and CI; see the warning above for why it
  // is not real rate limiting in production.
  return memRateLimit(`${ip}:${identifier}`, max, windowSeconds * 1_000)
}

/**
 * Extracts the caller's IP, in order of how hard it is to forge.
 *
 * This used to read the FIRST entry of `x-forwarded-for`, which is whatever the
 * client sent: anyone could put a different address in that header on every
 * request and get a fresh rate-limit bucket each time, which defeated every
 * rule in middleware.ts at once.
 *
 * - `request.ip` comes from the platform (Vercel fills it in) and the client
 *   cannot touch it.
 * - `x-real-ip` is overwritten by the proxy, so it is trustworthy behind one.
 * - `x-forwarded-for` is a chain and each proxy APPENDS to it. The rightmost
 *   entry is the one written by the proxy closest to us, so that is the one to
 *   use — never the leftmost, which the client controls.
 *
 * Falling back to a constant means every caller shares one bucket: stricter
 * than intended, but never weaker, which is the safe direction for a limiter.
 */
export function getClientIp(request: NextRequest): string {
  if (request.ip) return request.ip

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const chain = forwarded.split(',').map(part => part.trim()).filter(Boolean)
    const nearest = chain[chain.length - 1]
    if (nearest) return nearest
  }

  return '127.0.0.1'
}
