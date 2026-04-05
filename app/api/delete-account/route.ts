import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('delete-account')

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // 1. Cancel any active Stripe subscriptions first (DA-C2)
    const { data: activeSubs } = await supabase
      .from('assinaturas')
      .select('stripe_subscription_id')
      .eq('doador_email', user.email ?? '')
      .in('status', ['active', 'paused'])

    for (const sub of activeSubs ?? []) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id)
      } catch (stripeErr) {
        // Log but don't block account deletion if Stripe cancel fails
        log.error({ error: stripeErr }, 'stripe cancel error during account deletion')
      }
    }

    // 2. Cascade-delete all personal data (LGPD right to erasure — Art. 18, IV)
    //    Order: doacoes → assinaturas → doadores (no FK constraints on email, but logical order)
    const email = user.email ?? ''
    await Promise.all([
      supabase.from('doacoes').delete().eq('doador_email', email),
      supabase.from('assinaturas').delete().eq('doador_email', email),
    ])
    await supabase.from('doadores').delete().eq('id', user.id)

    // 3. Delete the auth record last
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) {
      return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    log.error({ error: err }, 'delete account failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

