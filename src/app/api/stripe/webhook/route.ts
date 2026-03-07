import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createLogger } from '@/lib/logger'

const log = createLogger('stripe-webhook')

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    log.warn('Stripe not configured', {
      has_secret_key: !!stripeSecretKey,
      has_webhook_secret: !!webhookSecret,
    })
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeSecretKey)

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  log.info('Webhook received', { type: event.type, id: event.id })

  let status = 'processed'
  let errorMessage: string | null = null
  const summary: Record<string, unknown> = { event_type: event.type }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.user_id
    const subscriptionId = session.subscription as string | undefined
    summary.user_id = userId ?? null
    summary.subscription_id = subscriptionId ?? null

    if (userId && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          is_pro: true,
          stripe_subscription_id: subscriptionId ?? null,
        },
      })

      if (error) {
        log.error('Failed to upgrade user', { userId, error: error.message })
        status = 'error'
        errorMessage = error.message
      } else {
        log.info('User upgraded to Pro', { userId })
        summary.action = 'upgraded_to_pro'
      }
    } else if (!userId) {
      log.warn('checkout.session.completed missing user_id in metadata')
      status = 'warning'
      errorMessage = 'Missing user_id in metadata'
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const userId = subscription.metadata?.user_id
    summary.user_id = userId ?? null

    if (userId && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          is_pro: false,
          stripe_subscription_id: null,
        },
      })

      if (error) {
        log.error('Failed to downgrade user', { userId, error: error.message })
        status = 'error'
        errorMessage = error.message
      } else {
        log.info('User downgraded from Pro', { userId })
        summary.action = 'downgraded_from_pro'
      }
    } else if (!userId) {
      log.warn('customer.subscription.deleted missing user_id in metadata')
      status = 'warning'
      errorMessage = 'Missing user_id in metadata'
    }
  } else {
    summary.action = 'unhandled_event_type'
  }

  // Log webhook event to database
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    await supabase.from('webhook_events').insert({
      event_id: event.id,
      event_type: event.type,
      status,
      summary,
      error_message: errorMessage,
    })
  }

  return NextResponse.json({ received: true })
}
