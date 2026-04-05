import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('create-portal-session')

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Find the active Stripe subscription ID for this user
    const { data: sub } = await supabase
      .from('assinaturas')
      .select('stripe_subscription_id')
      .eq('doador_email', user.email)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 })
    }

    // Retrieve the Stripe subscription to get the customer ID
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
    const customerId =
      typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/doador/assinatura`

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    log.error({ err }, 'create-portal-session failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
