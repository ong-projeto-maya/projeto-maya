import { NextResponse } from 'next/server'
import {
  createCheckout,
  generateReferenceId,
  getCheckoutUrl,
} from '@/lib/pagbank'
import { createRouteLogger } from '@/lib/logger'

const log = createRouteLogger('create-checkout-session')

const VALID_DONATION_TYPES = ['single', 'monthly'] as const
type DonationType = (typeof VALID_DONATION_TYPES)[number]

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
      return NextResponse.json({ error: 'Tipo de doação inválido' }, { status: 400 })
    }

    // Sanitize inputs to prevent metadata injection
    const safeCampaignName =
      typeof campaignName === 'string'
        ? campaignName.slice(0, 200).replace(/[\x00-\x1F]/g, '')
        : undefined
    const safeCampaignId =
      typeof campaignId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(campaignId)
        ? campaignId
        : undefined

    const label = donationType === 'monthly' ? 'Doação Mensal' : 'Doação'
    const productName =
      safeCampaignId && safeCampaignName
        ? `${label} - ${safeCampaignName}`
        : `${label} - Projeto Maya`

    const referenceId = generateReferenceId()

    // Checkout expires in 24 hours
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const cancelPath = safeCampaignId ? `/campanhas/${safeCampaignId}` : '/doacoes'

    const checkout = await createCheckout({
      reference_id: referenceId,
      expiration_date: expirationDate,
      items: [
        {
          reference_id: 'item-1',
          name: productName,
          quantity: 1,
          unit_amount: Math.round(amount * 100), // centavos
        },
      ],
      // Accept all available payment methods (PIX, credit card, boleto, debit)
      payment_methods: [
        { type: 'CREDIT_CARD' },
        { type: 'DEBIT_CARD' },
        { type: 'PIX' },
        { type: 'BOLETO' },
      ],
      // Embed the referenceId in the return URL so the success page can confirm
      redirect_url: `${siteUrl}/doacoes/sucesso?ref=${encodeURIComponent(referenceId)}${safeCampaignId ? `&campaign=${safeCampaignId}` : ''}`,
      notification_urls: [`${siteUrl}/api/webhook`],
      metadata: {
        donationType,
        amount: amount.toString(),
        ...(safeCampaignId && { campaignId: safeCampaignId }),
        ...(safeCampaignName && { campaignName: safeCampaignName }),
        cancelUrl: `${siteUrl}${cancelPath}`,
      },
    })

    const checkoutUrl = getCheckoutUrl(checkout)

    log.info({ referenceId, donationType, amount }, 'PagBank checkout created')
    return NextResponse.json({ checkoutUrl })
  } catch (error: unknown) {
    log.error({ error }, 'error creating PagBank checkout')
    return NextResponse.json(
      { error: 'Erro ao processar doação. Tente novamente.' },
      { status: 500 }
    )
  }
}

