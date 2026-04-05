import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('subscription/cancel')

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

    const { data: sub } = await supabase
      .from('assinaturas')
      .select('id, stripe_subscription_id')
      .eq('doador_email', user.email)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 })
    }

    await stripe.subscriptions.update(
      sub.stripe_subscription_id,
      { cancel_at_period_end: true },
      { idempotencyKey: `cancel-${user.id}-${sub.id}` },
    )

    await supabase
      .from('assinaturas')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    log.error({ error }, 'cancel subscription failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
