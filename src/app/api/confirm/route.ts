import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return new Response(
      htmlPage('Invalid Link', 'The confirmation link is invalid or expired.'),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Find subscriber by confirmation token
    const { data: subscriber, error: findError } = await supabase
      .from('subscribers')
      .select('id, confirmed')
      .eq('confirmation_token', token)
      .single()

    if (findError || !subscriber) {
      return new Response(
        htmlPage('Invalid Link', 'The confirmation link is invalid or has already been used.'),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    if (subscriber.confirmed) {
      return new Response(
        htmlPage('Already Confirmed', 'Your subscription is already confirmed. You\'re all set!'),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Confirm the subscription and clear the token
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ confirmed: true, confirmation_token: null })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('[confirm] Error:', updateError)
      return new Response(
        htmlPage('Something went wrong', 'We could not confirm your subscription. Please try again later.'),
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }

    return new Response(
      htmlPage('Subscription Confirmed!', 'You\'re now subscribed and will receive email notifications when new updates are published.'),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    console.error('[confirm] Error:', err)
    return new Response(
      htmlPage('Something went wrong', 'Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function htmlPage(title: string, message: string): string {
  const t = escapeHtml(title)
  const m = escapeHtml(message)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0a0a0a; color: #fff;">
  <div style="text-align: center; max-width: 400px; padding: 20px;">
    <h1 style="font-size: 24px; margin-bottom: 8px;">${t}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.5;">${m}</p>
  </div>
</body>
</html>`
}
