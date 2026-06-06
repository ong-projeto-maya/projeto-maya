import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { updateSubscriptionAmount } from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('subscription/change-amount')

const MIN_AMOUNT = 5
const MAX_AMOUNT = 50000

export async function POST(request: Request) {
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

    const body = await request.json()
    const amount = Number(body.amount)

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Valor deve ser entre R$ ${MIN_AMOUNT} e R$ ${MAX_AMOUNT}` },
        { status: 400 }
      )
    }

    const { data: sub } = await supabase
      .from('assinaturas')
      .select('id, pagbank_subscription_id')
      .eq('doador_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 })
    }

    // Call PagBank API if we have a real subscription ID
    if (sub.pagbank_subscription_id) {
      try {
        await updateSubscriptionAmount(sub.pagbank_subscription_id, Math.round(amount * 100))
      } catch (err) {
        log.error({ err, subscriptionId: sub.pagbank_subscription_id }, 'PagBank update amount failed')
        return NextResponse.json({ error: 'Erro ao alterar valor no PagBank' }, { status: 502 })
      }
    }

    await supabase
      .from('assinaturas')
      .update({ valor: amount, updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    log.info({ subscriptionId: sub.id, amount }, 'subscription amount updated')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    log.error({ error }, 'change subscription amount failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
