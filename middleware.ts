import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Routes that require donor authentication
const DONOR_ROUTES = ['/doador/dashboard', '/doador/perfil', '/doador/assinatura', '/doador/doacoes', '/doador/animais']
// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin']
// Admin routes that are publicly accessible (login page)
const ADMIN_PUBLIC = ['/admin/login']

// Rate-limit rules: [path prefix, maxRequests per window, windowSeconds]
const RATE_LIMIT_RULES: [string, number, number][] = [
  ['/api/create-checkout-session', 10, 60],   // 10 checkouts / min per IP
  ['/api/subscription/pause',       5, 60],
  ['/api/subscription/resume',      5, 60],
  ['/api/subscription/cancel',      5, 60],
  ['/api/subscription/change-amount', 5, 60],
  ['/api/delete-account',           3, 60],
  // These two limit how often the login PAGE can be loaded, not how often a
  // password can be tried: the sign-in call goes from the browser straight to
  // Supabase Auth and never passes through this middleware. Real brute-force
  // protection is Supabase's own auth rate limiting, configured in the
  // dashboard. This only slows down someone hammering the page itself.
  ['/doador/login',                10, 60],
  ['/admin/login',                 10, 60],
]

// A rule only takes effect if its path is also in `config.matcher` below:
// outside the matcher the middleware never runs for that request. Add a rule
// and its matcher entry together.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // --- Rate limiting (Upstash Redis in production, in-memory fallback in dev) ---
  for (const [prefix, max, windowSeconds] of RATE_LIMIT_RULES) {
    if (pathname.startsWith(prefix)) {
      const ip = getClientIp(request)
      const blocked = await checkRateLimit(ip, prefix, max, windowSeconds)
      if (blocked) {
        return NextResponse.json(
          { error: 'Muitas requisições. Tente novamente em instantes.' },
          { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'application/json' } }
        )
      }
      // API routes: no auth check needed — return after rate-limit pass
      if (pathname.startsWith('/api/')) return response
      break
    }
  }

  // --- Admin route protection ---
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  const isAdminPublic = ADMIN_PUBLIC.some(r => pathname.startsWith(r))

  if (isAdminRoute && !isAdminPublic) {
    // Fail-safe: if Supabase credentials are missing, redirect to login
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    // Fail-safe: if Supabase credentials are missing, redirect to login
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const loginUrl = new URL('/doador/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    '/api/subscription/change-amount',
    '/api/delete-account',
    // Auth-protected page routes
    '/admin/:path*',
    // The donor login page: rate-limited against password guessing. It was
    // missing here, so its rule above did nothing.
    '/doador/login',
    '/doador/dashboard/:path*',
    '/doador/perfil/:path*',
    '/doador/assinatura/:path*',
    '/doador/doacoes/:path*',
    '/doador/animais/:path*',
  ],
}
