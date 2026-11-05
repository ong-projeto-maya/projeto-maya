import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Routes that require donor authentication
const DONOR_ROUTES = ['/doador/dashboard', '/doador/perfil', '/doador/assinatura', '/doador/doacoes']
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
  //
  // 60/min, not 10. These pages receive every redirect from an expired
  // session, so a single person clicking around while logged out reaches 10
  // easily — and on mobile, thousands of people share one carrier IP through
  // CGNAT, so one visitor's browsing locks out everyone else behind it. The
  // e2e suite tripped this on its own, which is how it was caught.
  ['/doador/login',                60, 60],
  ['/admin/login',                 60, 60],
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
        const mensagem = 'Muitas requisições. Tente novamente em instantes.'
        const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
        // Uma página bloqueada devolvia o JSON de erro como corpo da navegação,
        // então a pessoa via `{"error":"..."}` cru na tela. Rota de API continua
        // em JSON, que é o que quem a chama sabe ler.
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: mensagem },
            { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'application/json' } }
          )
        }
        // Nao da para mostrar o aviso dentro da tela de login, em vermelho
        // acima dos campos: o middleware barra ANTES de a pagina existir, entao
        // nao ha React rodando para desenhar nada. Deixar passar so para exibir
        // o aviso anularia o limite. Entao a saida e esta pagina, com a cara do
        // site em vez de cara de erro de servidor. Cores de tailwind.config.ts;
        // middleware roda no Edge e nao enxerga o CSS do app.
        return new NextResponse(
          `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">` +
          `<meta name="viewport" content="width=device-width,initial-scale=1">` +
          `<title>Muitas tentativas · Projeto Maya</title></head>` +
          `<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;` +
          `background:#D9D3D3;color:#564334;font-family:system-ui,-apple-system,sans-serif;padding:1.5rem">` +
          `<main style="background:#fff;border-radius:1rem;padding:2.5rem 2rem;max-width:26rem;width:100%;` +
          `text-align:center;box-shadow:0 10px 25px rgba(86,67,52,.12)">` +
          `<p style="font-size:2.5rem;margin:0 0 .5rem">🐾</p>` +
          `<h1 style="font-size:1.35rem;margin:0 0 .75rem;font-weight:700">Calma aí</h1>` +
          `<p style="margin:0 0 1.75rem;line-height:1.5;opacity:.85">${mensagem}</p>` +
          `<a href="${pathname}" style="display:inline-block;background:#B2C09D;color:#564334;` +
          `text-decoration:none;font-weight:600;padding:.75rem 1.75rem;border-radius:1rem">Tentar de novo</a>` +
          // Quem foi barrado de verdade precisa de uma saida que nao dependa do
          // site. Sem numero configurado, o bloco nao aparece em vez de virar
          // um link quebrado para wa.me/
          (whatsapp
            ? `<p style="margin:1.75rem 0 0;font-size:.9rem;opacity:.75">Precisa falar com a gente?<br>` +
              `<a href="https://wa.me/${whatsapp}" style="color:#564334;font-weight:600">Chamar no WhatsApp</a></p>`
            : '') +
          `</main></body></html>`,
          { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'text/html; charset=utf-8' } }
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
  ],
}
