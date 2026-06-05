import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('subscription/pause')

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'NÃ£o autorizado' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user?.email) {
      return NextResponse.json({ error: 'NÃ£o autorizado' }, { status: 401 })
    }

    const { data: sub } = await supabase
      .from('assinaturas')
      .select('id')
      .eq('doador_email', user.email)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 })
    }

    await supabase
      .from('assinaturas')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    log.error({ error }, 'pause subscription failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}