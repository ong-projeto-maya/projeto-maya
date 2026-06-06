import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { activateSubscription } from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('subscription/resume')

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

    const { data: sub } = await supabase
      .from('assinaturas')
      .select('id, pagbank_subscription_id')
      .eq('doador_id', user.id)
      .eq('status', 'paused')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.id) {
      return NextResponse.json({ error: 'Nenhuma assinatura pausada encontrada' }, { status: 404 })
    }

    // Call PagBank API if we have a real subscription ID
    if (sub.pagbank_subscription_id) {
      try {
        await activateSubscription(sub.pagbank_subscription_id)
      } catch (err) {
        log.error({ err, subscriptionId: sub.pagbank_subscription_id }, 'PagBank activate failed')
        return NextResponse.json({ error: 'Erro ao reativar assinatura no PagBank' }, { status: 502 })
      }
    }

    await supabase
      .from('assinaturas')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    log.info({ subscriptionId: sub.id }, 'subscription resumed')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    log.error({ error }, 'resume subscription failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
