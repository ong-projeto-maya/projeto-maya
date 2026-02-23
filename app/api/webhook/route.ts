import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Note: Install Stripe server-side SDK: npm install stripe
// Uncomment after installing: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // IMPORTANT: Uncomment this section after setting up Stripe
    /*
    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        // Save donation to database
        console.log('Donation completed:', {
          amount: session.amount_total / 100,
          donationType: session.metadata.donationType,
          customerEmail: session.customer_email,
          sessionId: session.id,
        })

        // TODO: Save to your database
        // Example:
        // await saveDonationToDatabase({
        //   amount: session.amount_total / 100,
        //   type: session.metadata.donationType,
        //   email: session.customer_email,
        //   stripeSessionId: session.id,
        //   createdAt: new Date(),
        // })

        // Send thank you email
        // await sendThankYouEmail(session.customer_email)

        break

      case 'customer.subscription.created':
        // Handle new monthly subscription
        const subscription = event.data.object
        console.log('New subscription created:', subscription.id)
        
        // TODO: Save subscription to database
        break

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const cancelledSubscription = event.data.object
        console.log('Subscription cancelled:', cancelledSubscription.id)
        
        // TODO: Update database
        break

      case 'invoice.payment_succeeded':
        // Handle successful monthly payment
        const invoice = event.data.object
        console.log('Invoice paid:', invoice.id)
        
        // TODO: Record payment in database
        break

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object
        console.log('Payment failed:', failedInvoice.id)
        
        // TODO: Send notification email
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
    */

    // TEMPORARY: For demo purposes
    console.log('Webhook received (Stripe not configured yet)')
    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
