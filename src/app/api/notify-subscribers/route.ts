import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { sendEntryNotifications } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { changelog_id, entry_title, entry_content } = await request.json()

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

    // Fetch confirmed subscribers
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('id, email')
      .eq('changelog_id', changelog_id)
      .eq('confirmed', true)

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'No subscribers to notify',
        sent: 0,
        failed: 0,
      })
    }

    // Send emails (fire and forget style -- we return quickly but log results)
    const result = await sendEntryNotifications({
      changelogId: changelog.id,
      changelogName: changelog.name,
      changelogSlug: changelog.slug,
      entryTitle: entry_title,
      entryContent: entry_content || '',
      subscribers,
    })

    return NextResponse.json({
      message: `Notified ${result.sent} subscriber(s)`,
      ...result,
    })
  } catch (err) {
    console.error('[notify-subscribers] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
