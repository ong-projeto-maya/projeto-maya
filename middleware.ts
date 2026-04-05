import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require donor authentication
const DONOR_ROUTES = ['/doador/dashboard', '/doador/perfil', '/doador/assinatura', '/doador/doacoes', '/doador/animais']
// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin']
// Admin routes that are publicly accessible (login page)
const ADMIN_PUBLIC = ['/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

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
    '/admin/:path*',
    '/doador/dashboard/:path*',
    '/doador/perfil/:path*',
    '/doador/assinatura/:path*',
    '/doador/doacoes/:path*',
    '/doador/animais/:path*',
  ],
}
