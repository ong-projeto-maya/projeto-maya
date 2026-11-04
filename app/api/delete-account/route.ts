import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { cancelPagBankSubscription } from '@/lib/pagbank'
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

    const email = user.email ?? ''

    // 1. Cancel the recurring donations at PagBank FIRST. Marking the row
    //    cancelled in our own database stops nothing: the charge is scheduled
    //    on PagBank's side, so without this the card keeps being billed every
    //    month after the account is gone — and the row that said which
    //    subscription it was has just been deleted.
    //    A PagBank failure must not block the erasure the donor asked for
    //    (LGPD Art. 18, IV), so each one is logged and the deletion goes on.
    //    What is logged is the subscription id, never the donor's data.
    const { data: activeSubs } = await supabase
      .from('assinaturas')
      .select('pagbank_subscription_id')
      .eq('doador_email', email)
      .in('status', ['active', 'paused'])

    for (const sub of activeSubs ?? []) {
      const subscriptionId = sub.pagbank_subscription_id
      if (!subscriptionId) continue
      try {
        await cancelPagBankSubscription(subscriptionId)
        log.info({ subscriptionId }, 'subscription cancelled at PagBank before account deletion')
      } catch (err) {
        log.error(
          { err, subscriptionId },
          'PagBank cancel failed during account deletion — cancel it by hand in the PagBank panel'
        )
      }
    }

    // 2. Mirror the cancellation in our DB.
    await supabase
      .from('assinaturas')
      .update({ status: 'cancelled' })
      .eq('doador_email', email)
      .in('status', ['active', 'paused'])

    // 3. Cascade-delete all personal data (LGPD right to erasure — Art. 18, IV)
    //    Order: doacoes → assinaturas → doadores (no FK constraints on email, but logical order)
    await Promise.all([
      supabase.from('doacoes').delete().eq('doador_email', email),
      supabase.from('assinaturas').delete().eq('doador_email', email),
    ])
    await supabase.from('doadores').delete().eq('id', user.id)

    // 4. Delete the auth record last
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

