import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { cancelPagBankSubscription } from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('delete-account')

type ServiceClient = ReturnType<typeof createServiceClient>

/**
 * Every row that belongs to this donor, in `assinaturas` or `doacoes`.
 *
 * Matching on the e-mail alone is not enough, and that was the bug: somebody
 * who donated before creating an account has the row saved under
 * 'anonymous@projetomaya.org', and somebody who later changed their e-mail in
 * Supabase Auth has it under the old one. Rows missed here were neither
 * cancelled at PagBank nor erased, so the card went on being charged after the
 * account was gone.
 *
 * Two queries instead of one `.or()`: the e-mail would have to be interpolated
 * into a PostgREST filter string, and user input does not belong in a query
 * language, however well-formed it looks.
 */
async function findOwnRowIds(
  supabase: ServiceClient,
  table: 'assinaturas' | 'doacoes',
  userId: string,
  email: string
): Promise<string[]> {
  const [byId, byEmail] = await Promise.all([
    supabase.from(table).select('id').eq('doador_id', userId),
    email ? supabase.from(table).select('id').eq('doador_email', email) : Promise.resolve({ data: [], error: null }),
  ])

  if (byId.error) log.error({ err: byId.error, table }, 'lookup by doador_id failed')
  if (byEmail.error) log.error({ err: byEmail.error, table }, 'lookup by doador_email failed')

  const ids = new Set<string>()
  for (const row of byId.data ?? []) ids.add((row as { id: string }).id)
  for (const row of byEmail.data ?? []) ids.add((row as { id: string }).id)
  return [...ids]
}

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

    const subscriptionRowIds = await findOwnRowIds(supabase, 'assinaturas', user.id, email)
    const donationRowIds = await findOwnRowIds(supabase, 'doacoes', user.id, email)

    // 1. Cancel the recurring donations at PagBank FIRST. Marking the row
    //    cancelled in our own database stops nothing: the charge is scheduled
    //    on PagBank's side, so without this the card keeps being billed every
    //    month after the account is gone — and the row that said which
    //    subscription it was has just been deleted.
    //    A PagBank failure must not block the erasure the donor asked for
    //    (LGPD Art. 18, IV), so each one is logged and the deletion goes on.
    //    What is logged is the subscription id, never the donor's data.
    if (subscriptionRowIds.length > 0) {
      const { data: activeSubs, error: subsError } = await supabase
        .from('assinaturas')
        .select('pagbank_subscription_id')
        .in('id', subscriptionRowIds)
        .in('status', ['active', 'paused'])

      if (subsError) {
        // Do not swallow this: it means we do not know what is still being
        // charged, and the rows that would tell us are about to be deleted.
        log.error({ err: subsError, userId: user.id }, 'could not list subscriptions before deletion')
      }

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
        .in('id', subscriptionRowIds)
        .in('status', ['active', 'paused'])
    }

    // 3. Cascade-delete all personal data (LGPD right to erasure — Art. 18, IV)
    //    Order: doacoes → assinaturas → doadores (no FK constraints on email, but logical order)
    await Promise.all([
      donationRowIds.length > 0
        ? supabase.from('doacoes').delete().in('id', donationRowIds)
        : Promise.resolve(),
      subscriptionRowIds.length > 0
        ? supabase.from('assinaturas').delete().in('id', subscriptionRowIds)
        : Promise.resolve(),
    ])
    await supabase.from('doadores').delete().eq('id', user.id)

    // 4. Delete the auth record last
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) {
      return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 })
    }

    log.info(
      { userId: user.id, donations: donationRowIds.length, subscriptions: subscriptionRowIds.length },
      'account deleted'
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    log.error({ error: err }, 'delete account failed')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
