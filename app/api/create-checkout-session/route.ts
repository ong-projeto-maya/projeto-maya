import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('create-checkout-session')

const VALID_DONATION_TYPES = ['single', 'monthly'] as const
type DonationType = typeof VALID_DONATION_TYPES[number]

const MAX_AMOUNT = 50000 // R$ 50,000 — hard upper bound
const MIN_AMOUNT = 5

export async function POST(request: Request) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      log.error('NEXT_PUBLIC_SITE_URL is not configured')
      return NextResponse.json({ error: 'Configuração inválida do servidor' }, { status: 500 })
    }

    const body = await request.json()
    const { amount, donationType, campaignId, campaignName } = body

    // Validate amount
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
      return NextResponse.json(
        { error: `Valor mínimo de R$ ${MIN_AMOUNT},00` },
        { status: 400 }
      )
    }
    if (amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Valor máximo de R$ ${MAX_AMOUNT.toLocaleString('pt-BR')},00` },
        { status: 400 }
      )
    }

    // Validate donationType
    if (!VALID_DONATION_TYPES.includes(donationType as DonationType)) {
      return NextResponse.json(
        { error: 'Tipo de doação inválido' },
        { status: 400 }
      )
    }

    // Sanitize campaignName to prevent metadata injection
    const safeCampaignName = typeof campaignName === 'string'
      ? campaignName.slice(0, 200).replace(/[\x00-\x1F]/g, '')
      : undefined
    const safeCampaignId = typeof campaignId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(campaignId)
      ? campaignId
      : undefined

    let productName = donationType === 'monthly' ? 'Doação Mensal - Projeto Maya' : 'Doação - Projeto Maya'
    let productDescription = 'Sua contribuição ajuda animais resgatados a encontrarem um lar'

    if (safeCampaignId && safeCampaignName) {
      productName = `${donationType === 'monthly' ? 'Doação Mensal' : 'Doação'} - ${safeCampaignName}`
      productDescription = `Sua contribuição para a campanha: ${safeCampaignName}`
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: Math.round(amount * 100),
            ...(donationType === 'monthly' && {
              recurring: { interval: 'month' },
            }),
          },
          quantity: 1,
        },
      ],
      mode: donationType === 'monthly' ? 'subscription' : 'payment',
      success_url: `${siteUrl}/doacoes/sucesso?session_id={CHECKOUT_SESSION_ID}${safeCampaignId ? `&campaign=${safeCampaignId}` : ''}`,
      cancel_url: safeCampaignId
        ? `${siteUrl}/campanhas/${safeCampaignId}`
        : `${siteUrl}/doacoes`,
      metadata: {
        donationType,
        amount: amount.toString(),
        ...(safeCampaignId && { campaignId: safeCampaignId }),
        ...(safeCampaignName && { campaignName: safeCampaignName }),
      },
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error: unknown) {
    log.error({ error }, 'error creating checkout session')
    return NextResponse.json(
      { error: 'Erro ao processar doação. Tente novamente.' },
      { status: 500 }
    )
  }
}

