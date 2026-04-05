import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require donor authentication
const DONOR_ROUTES = ['/doador/dashboard', '/doador/perfil', '/doador/assinatura', '/doador/doacoes', '/doador/animais']
// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin']
// Admin routes that are publicly accessible (login page)
const ADMIN_PUBLIC = ['/admin/login']

// ---------------------------------------------------------------------------
// Simple sliding-window rate limiter (per-IP, per serverless instance).
// Limits the mutation API endpoints that cost money or have abuse potential.
// ---------------------------------------------------------------------------
interface Window { count: number; resetAt: number }
const rateLimitMap = new Map<string, Window>()

/** Returns true when the request should be blocked. */
function isRateLimited(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  if (entry.count > maxRequests) return true
  return false
}

// Periodically prune stale entries to avoid memory growth on long-lived instances
let lastPrune = Date.now()
function maybePrune() {
  const now = Date.now()
  if (now - lastPrune < 60_000) return
  lastPrune = now
  for (const [key, win] of rateLimitMap) {
    if (now > win.resetAt) rateLimitMap.delete(key)
  }
}

// Rate-limit rules: [path prefix, maxRequests per window, windowMs]
const RATE_LIMIT_RULES: [string, number, number][] = [
  ['/api/create-checkout-session', 10, 60_000],   // 10 checkouts / min per IP
  ['/api/subscription/pause',      5,  60_000],
  ['/api/subscription/resume',     5,  60_000],
  ['/api/subscription/cancel',     5,  60_000],
  ['/api/delete-account',          3,  60_000],
  ['/doador/login',                10, 60_000],   // brute-force protection
  ['/admin/login',                 10, 60_000],
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // --- Rate limiting ---
  maybePrune()
  for (const [prefix, max, windowMs] of RATE_LIMIT_RULES) {
    if (pathname.startsWith(prefix)) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        request.headers.get('x-real-ip') ??
        '127.0.0.1'
      if (isRateLimited(`${ip}:${prefix}`, max, windowMs)) {
        return NextResponse.json(
          { error: 'Muitas requisições. Tente novamente em instantes.' },
          { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'application/json' } }
        )
      }
      // API routes: no auth needed here — return after rate-limit check
      if (pathname.startsWith('/api/')) return response
      break
    }
  }

  // --- Admin route protection ---
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  const isAdminPublic = ADMIN_PUBLIC.some(r => pathname.startsWith(r))

  if (isAdminRoute && !isAdminPublic) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { storageKey: 'maya_admin_supabase' },
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify admin_users entry server-side
    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (!adminRecord || adminRecord.role !== 'admin') {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  // --- Donor route protection ---
  const isDonorRoute = DONOR_ROUTES.some(r => pathname.startsWith(r))

  if (isDonorRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const loginUrl = new URL('/doador/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  return response
}

export const config = {
  matcher: [
    // API routes that need rate limiting
    '/api/create-checkout-session',
    '/api/subscription/pause',
    '/api/subscription/resume',
    '/api/subscription/cancel',
    '/api/delete-account',
    // Auth-protected page routes
    '/admin/:path*',
    '/doador/dashboard/:path*',
    '/doador/perfil/:path*',
    '/doador/assinatura/:path*',
    '/doador/doacoes/:path*',
    '/doador/animais/:path*',
  ],
}
