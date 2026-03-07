import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { sendEntryNotifications } from '@/lib/email'
import { createLogger } from '@/lib/logger'

const log = createLogger('publish-scheduled')

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    // Find entries scheduled for now or earlier that aren't published yet
    const now = new Date().toISOString()
    const { data: entries, error: fetchError } = await supabase
      .from('entries')
      .select('id, changelog_id, title, content, scheduled_for')
      .eq('is_published', false)
      .not('scheduled_for', 'is', null)
      .lte('scheduled_for', now)
      .limit(20)

    if (fetchError) {
      log.error('Failed to fetch scheduled entries', { error: fetchError.message })
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({ message: 'No entries to publish', published: 0 })
    }

    let published = 0

    for (const entry of entries) {
      // Publish the entry
      const { error: updateError } = await supabase
        .from('entries')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          scheduled_for: null,
        })
        .eq('id', entry.id)

      if (updateError) {
        log.error('Failed to publish entry', { entryId: entry.id, error: updateError.message })
        continue
      }

      published++
      log.info('Published scheduled entry', { entryId: entry.id, title: entry.title })

      // Fetch changelog info and subscribers for notification
      const { data: changelog } = await supabase
        .from('changelogs')
        .select('id, name, slug')
        .eq('id', entry.changelog_id)
        .single()

      if (!changelog) continue

      const { data: subscribers } = await supabase
        .from('subscribers')
        .select('id, email, unsubscribe_token')
        .eq('changelog_id', entry.changelog_id)
        .eq('confirmed', true)

      if (!subscribers || subscribers.length === 0) continue

      // Send notifications (fire-and-forget style within the loop)
      const result = await sendEntryNotifications({
        changelogId: changelog.id,
        changelogName: changelog.name,
        changelogSlug: changelog.slug,
        entryTitle: entry.title,
        entryContent: entry.content,
        subscribers,
      })

      // Mark as notified
      if (result.sent > 0) {
        await supabase
          .from('entries')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', entry.id)
      }

      // Record failures for retry
      if (result.failures.length > 0) {
        const failureRows = result.failures.map((f) => ({
          entry_id: entry.id,
          subscriber_id: f.subscriberId,
          changelog_id: entry.changelog_id,
          error_message: f.error.slice(0, 500),
        }))
        await supabase.from('notification_failures').upsert(failureRows, {
          onConflict: 'entry_id,subscriber_id',
        })
      }

      log.info('Notified subscribers for scheduled entry', {
        entryId: entry.id,
        sent: result.sent,
        failed: result.failed,
      })
    }

    log.info('Publish-scheduled cycle complete', { published, total: entries.length })
    return NextResponse.json({ message: `Published ${published} entry(ies)`, published })
  } catch (err) {
    log.error('Publish-scheduled error', { error: String(err) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
