import { NextResponse } from 'next/server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('create-portal-session')

/**
 * PagBank does not provide a hosted billing portal equivalent to Stripe's.
 * Subscription management is handled directly via /api/subscription/* endpoints.
 * This route returns the management URL so existing callers redirect to the
 * in-app subscription page instead.
 */
export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  log.info('create-portal-session redirecting to in-app subscription management')
  return NextResponse.json({ url: `${siteUrl}/doador/assinatura` })
}
