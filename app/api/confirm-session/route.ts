import { NextResponse } from 'next/server'
import { getDonationByReference } from '@/lib/donationStorage'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('confirm-session')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')

  if (!ref) {
    return NextResponse.json({ error: 'ref é obrigatório' }, { status: 400 })
  }

  try {
    // Query our own database (populated by create-checkout-session and updated by webhook)
    const donation = await getDonationByReference(ref)

    if (!donation) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      id: ref,
      status: donation.status,
      amount: donation.amount,
      currency: 'BRL',
      customerEmail: donation.email !== 'anonymous@projetomaya.org' ? donation.email : null,
      donationType: donation.type,
      campaignId: donation.campaignId ?? null,
      campaignName: donation.campaignName ?? null,
      subscriptionId: donation.subscriptionId ?? null,
      nextBillingDate: donation.nextBillingDate ?? null,
    })
  } catch (error) {
    log.error({ error }, 'confirm-session failed')
    return NextResponse.json({ error: 'Erro ao recuperar pedido' }, { status: 500 })
  }
}
