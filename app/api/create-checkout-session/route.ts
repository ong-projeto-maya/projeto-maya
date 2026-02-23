import { NextResponse } from 'next/server'

// Note: Install Stripe server-side SDK: npm install stripe
// Uncomment the following lines after installing Stripe
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const { amount, donationType } = await request.json()

    // Validate amount
    if (!amount || amount < 5) {
      return NextResponse.json(
        { error: 'Valor mínimo de R$ 5,00' },
        { status: 400 }
      )
    }

    // IMPORTANT: Uncomment this section after setting up Stripe keys
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: donationType === 'monthly' ? 'Doação Mensal - Projeto Maya' : 'Doação - Projeto Maya',
              description: 'Sua contribuição ajuda animais resgatados a encontrarem um lar',
              images: ['https://your-logo-url.com/logo.png'],
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
            ...(donationType === 'monthly' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: donationType === 'monthly' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/doacoes/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/doacoes`,
      metadata: {
        donationType,
        amount: amount.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id })
    */

    // TEMPORARY: For demo purposes, return a mock response
    // Remove this after setting up Stripe
    return NextResponse.json({
      error: 'Configuração do Stripe pendente. Por favor, configure suas chaves de API no arquivo .env.local'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar doação' },
      { status: 500 }
    )
  }
}
