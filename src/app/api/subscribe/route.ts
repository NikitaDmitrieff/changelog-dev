import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { sendConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { changelog_id, email } = await request.json()

    if (!changelog_id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Validate changelog_id is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(changelog_id)) {
      return NextResponse.json({ error: 'Invalid changelog' }, { status: 400 })
    }

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

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, confirmed')
      .eq('changelog_id', changelog_id)
      .eq('email', email)
      .single()

    if (existing?.confirmed) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    // Get changelog name for the confirmation email
    const { data: changelog } = await supabase
      .from('changelogs')
      .select('name, slug')
      .eq('id', changelog_id)
      .single()

    if (!changelog) {
      return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })
    }

    const changelogName = changelog.name

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID()

    if (existing && !existing.confirmed) {
      // Re-send confirmation for unconfirmed subscriber
      const { error } = await supabase
        .from('subscribers')
        .update({ confirmation_token: confirmationToken })
        .eq('id', existing.id)

      if (error) {
        console.error('[subscribe] Update error:', error)
        return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 })
      }
    } else {
      // Insert new subscriber as unconfirmed
      const { error } = await supabase.from('subscribers').insert({
        changelog_id,
        email,
        confirmed: false,
        confirmation_token: confirmationToken,
      })

      if (error) {
        console.error('[subscribe] Insert error:', error)
        return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 })
      }
    }

    // Send confirmation email
    await sendConfirmationEmail({
      email,
      changelogName,
      confirmationToken,
    })

    return NextResponse.json({
      message: 'Check your email to confirm your subscription',
      needsConfirmation: true,
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
