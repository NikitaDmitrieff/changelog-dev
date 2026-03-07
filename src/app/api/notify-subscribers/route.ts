import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { sendEntryNotifications } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { changelog_id, entry_id, entry_title, entry_content } = await request.json()

    if (!changelog_id || !entry_title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
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

    // Verify the user is authenticated and owns this changelog
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: changelog } = await supabase
      .from('changelogs')
      .select('id, name, slug, owner_id')
      .eq('id', changelog_id)
      .single()

    if (!changelog || changelog.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // W1: Idempotency -- check if this entry was already notified
    if (entry_id) {
      const { data: entry } = await supabase
        .from('entries')
        .select('id, notified_at')
        .eq('id', entry_id)
        .eq('changelog_id', changelog_id)
        .single()

      if (entry?.notified_at) {
        return NextResponse.json({
          message: 'Subscribers were already notified for this entry',
          sent: 0,
          failed: 0,
          already_notified: true,
        })
      }
    }

    // Fetch confirmed subscribers (include unsubscribe_token for W5)
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('id, email, unsubscribe_token')
      .eq('changelog_id', changelog_id)
      .eq('confirmed', true)

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'No subscribers to notify',
        sent: 0,
        failed: 0,
      })
    }

    // Send emails
    const result = await sendEntryNotifications({
      changelogId: changelog.id,
      changelogName: changelog.name,
      changelogSlug: changelog.slug,
      entryTitle: entry_title,
      entryContent: entry_content || '',
      subscribers,
    })

    // W1: Mark entry as notified
    if (entry_id && result.sent > 0) {
      await supabase
        .from('entries')
        .update({ notified_at: new Date().toISOString() })
        .eq('id', entry_id)
    }

    // Record failures for retry
    if (entry_id && result.failures.length > 0) {
      const failureRows = result.failures.map((f) => ({
        entry_id,
        subscriber_id: f.subscriberId,
        changelog_id,
        error_message: f.error.slice(0, 500),
      }))
      await supabase.from('notification_failures').upsert(failureRows, {
        onConflict: 'entry_id,subscriber_id',
      })
    }

    return NextResponse.json({
      message: `Notified ${result.sent} subscriber(s)`,
      sent: result.sent,
      failed: result.failed,
    })
  } catch (err) {
    console.error('[notify-subscribers] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
