import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('donors/ensure-profile')

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

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('doadores')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ created: false })
    }

    // Create minimal profile using service role (bypasses RLS)
    const nome =
      (user.user_metadata?.nome as string | undefined) ||
      (user.email?.split('@')[0] ?? 'Doador')

    const { error: insertError } = await supabase
      .from('doadores')
      .insert({ id: user.id, email: user.email ?? '', nome })

    if (insertError) {
      log.error({ err: insertError, userId: user.id }, 'failed to create donor profile')
      return NextResponse.json({ error: 'Erro ao criar perfil' }, { status: 500 })
    }

    log.info({ userId: user.id }, 'donor profile created')
    return NextResponse.json({ created: true })
  } catch (error: unknown) {
    log.error({ error }, 'ensure-profile failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
