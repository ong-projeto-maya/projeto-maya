import { NextResponse } from 'next/server'
import { findOrderByReference, mapChargeStatus } from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('confirm-session')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')

  if (!ref) {
    return NextResponse.json({ error: 'ref é obrigatório' }, { status: 400 })
  }

  try {
    const order = await findOrderByReference(ref)

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const firstCharge = order.charges?.[0]
    const chargeStatus = firstCharge ? mapChargeStatus(firstCharge) : 'pending'
    const metadata = order.metadata ?? {}

    return NextResponse.json({
      id: ref,
      status: chargeStatus,
      amount: firstCharge ? firstCharge.amount.value / 100 : 0,
      currency: 'BRL',
      customerEmail: order.customer?.email ?? null,
      donationType: (metadata.donationType as 'single' | 'monthly') ?? 'single',
      campaignId: metadata.campaignId ?? null,
      campaignName: metadata.campaignName ?? null,
      subscriptionId: null,
      nextBillingDate: null,
    })
  } catch (error) {
    log.error({ error }, 'confirm-session failed')
    return NextResponse.json({ error: 'Erro ao recuperar pedido' }, { status: 500 })
  }
}
