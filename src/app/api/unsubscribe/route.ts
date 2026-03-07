import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const changelogId = request.nextUrl.searchParams.get('changelog')

  if (!token || !changelogId) {
    return new NextResponse(
      htmlPage('Invalid Link', 'The unsubscribe link is invalid or expired.'),
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

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', token)
      .eq('changelog_id', changelogId)

    if (error) {
      console.error('[unsubscribe] Error:', error)
      return new NextResponse(
        htmlPage(
          'Something went wrong',
          'We could not process your unsubscribe request. Please try again later.'
        ),
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }

    return new NextResponse(
      htmlPage(
        "You've been unsubscribed",
        'You will no longer receive email notifications for this changelog.'
      ),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    console.error('[unsubscribe] Error:', err)
    return new NextResponse(
      htmlPage('Something went wrong', 'Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0a0a0a; color: #fff;">
  <div style="text-align: center; max-width: 400px; padding: 20px;">
    <h1 style="font-size: 24px; margin-bottom: 8px;">${title}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.5;">${message}</p>
  </div>
</body>
</html>`
}
