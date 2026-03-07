import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { createLogger } from '@/lib/logger'
import { Resend } from 'resend'

const log = createLogger('notification-retry')

const MAX_ATTEMPTS = 3
const RETRY_INTERVALS = [5, 30, 120] // minutes

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ message: 'RESEND_API_KEY not configured' }, { status: 200 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

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

    // Fetch failures ready for retry
    const { data: failures } = await supabase
      .from('notification_failures')
      .select('*, entries!inner(title, content), subscribers!inner(email, unsubscribe_token), changelogs!inner(name, slug)')
      .eq('resolved', false)
      .lte('next_retry_at', new Date().toISOString())
      .lt('attempt_count', MAX_ATTEMPTS)
      .limit(50)

    if (!failures || failures.length === 0) {
      return NextResponse.json({ message: 'No failures to retry', retried: 0 })
    }

    let retried = 0
    let resolved = 0

    for (const failure of failures) {
      const entry = failure.entries as unknown as { title: string; content: string }
      const subscriber = failure.subscribers as unknown as { email: string; unsubscribe_token: string | null }
      const changelog = failure.changelogs as unknown as { name: string; slug: string }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.changelogdev.com'
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token || failure.subscriber_id}&changelog=${failure.changelog_id}`

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: subscriber.email,
        subject: `[${changelog.name}] New update: ${entry.title}`,
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <h2 style="margin: 0 0 4px 0; font-size: 20px;">${entry.title}</h2>
  <p style="margin: 0 0 20px 0; font-size: 13px; color: #666;">New update from ${changelog.name}</p>
  <p style="margin: 24px 0;"><a href="${siteUrl}/${changelog.slug}" style="display: inline-block; background: #ffffff; color: #000000; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-size: 14px; font-weight: 500;">Read full update</a></p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
  <p style="font-size: 12px; color: #999; margin: 0;">You received this because you subscribed to ${changelog.name} updates. <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a></p>
</body></html>`,
      })

      retried++

      if (!error) {
        // Success — mark resolved
        resolved++
        await supabase
          .from('notification_failures')
          .update({ resolved: true, last_attempted_at: new Date().toISOString() })
          .eq('id', failure.id)
      } else {
        // Still failing — bump attempt count and schedule next retry
        const nextAttempt = failure.attempt_count + 1
        const delayMinutes = RETRY_INTERVALS[Math.min(nextAttempt - 1, RETRY_INTERVALS.length - 1)]
        const nextRetry = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString()

        await supabase
          .from('notification_failures')
          .update({
            attempt_count: nextAttempt,
            last_attempted_at: new Date().toISOString(),
            next_retry_at: nextRetry,
            error_message: String(error).slice(0, 500),
            resolved: nextAttempt >= MAX_ATTEMPTS,
          })
          .eq('id', failure.id)

        log.error('Retry failed', { failureId: failure.id, attempt: nextAttempt, error: String(error) })
      }
    }

    log.info('Retry cycle complete', { retried, resolved })
    return NextResponse.json({ message: 'Retry complete', retried, resolved })
  } catch (err) {
    log.error('Retry route error', { error: String(err) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
