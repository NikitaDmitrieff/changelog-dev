import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const session_id = request.nextUrl.searchParams.get('session_id')

  if (!session_id || !process.env.STRIPE_SECRET_KEY) {
    redirect('/dashboard')
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await stripe.checkout.sessions.retrieve(session_id)

  if (session.status !== 'complete') {
    redirect('/dashboard')
  }

  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.updateUser({
    data: {
      is_pro: true,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
    },
  })

  redirect('/dashboard?upgraded=1')
}
