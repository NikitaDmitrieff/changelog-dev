import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

interface SendNotificationParams {
  changelogName: string
  changelogSlug: string
  entryTitle: string
  entryContent: string
  subscribers: Array<{ id: string; email: string }>
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

function buildEmailHtml({
  changelogName,
  changelogSlug,
  entryTitle,
  entryContent,
  subscriberId,
  changelogId,
}: {
  changelogName: string
  changelogSlug: string
  entryTitle: string
  entryContent: string
  subscriberId: string
  changelogId: string
}): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.changelogdev.com'
  const changelogUrl = `${siteUrl}/${changelogSlug}`
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriberId}&changelog=${changelogId}`
  const summary = truncate(entryContent.replace(/[#*`_~\[\]]/g, ''), 200)

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <h2 style="margin: 0 0 4px 0; font-size: 20px;">${entryTitle}</h2>
  <p style="margin: 0 0 20px 0; font-size: 13px; color: #666;">New update from ${changelogName}</p>
  <p style="font-size: 15px; line-height: 1.6; color: #333;">${summary}</p>
  <p style="margin: 24px 0;">
    <a href="${changelogUrl}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">Read full update</a>
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
  <p style="font-size: 12px; color: #999; margin: 0;">
    You received this because you subscribed to ${changelogName} updates.
    <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
  </p>
</body>
</html>`
}

interface SendConfirmationParams {
  email: string
  changelogName: string
  confirmationToken: string
}

function buildConfirmationHtml({
  changelogName,
  confirmUrl,
}: {
  changelogName: string
  confirmUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <h2 style="margin: 0 0 4px 0; font-size: 20px;">Confirm your subscription</h2>
  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333;">
    You requested to subscribe to <strong>${changelogName}</strong> updates. Click the button below to confirm your subscription.
  </p>
  <p style="margin: 24px 0;">
    <a href="${confirmUrl}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">Confirm subscription</a>
  </p>
  <p style="font-size: 13px; color: #999; margin-top: 32px;">
    If you didn't request this, you can safely ignore this email.
  </p>
</body>
</html>`
}

export async function sendConfirmationEmail(
  params: SendConfirmationParams
): Promise<void> {
  if (!resend) {
    console.warn(
      '[email] RESEND_API_KEY not configured -- skipping confirmation email'
    )
    return
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.changelogdev.com'
  const confirmUrl = `${siteUrl}/api/confirm?token=${params.confirmationToken}`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: `Confirm your subscription to ${params.changelogName}`,
    html: buildConfirmationHtml({
      changelogName: params.changelogName,
      confirmUrl,
    }),
  })

  if (error) {
    console.error('[email] Confirmation email failed:', error)
  }
}

export async function sendEntryNotifications(
  params: SendNotificationParams & { changelogId: string }
): Promise<{ sent: number; failed: number }> {
  if (!resend) {
    console.warn(
      '[email] RESEND_API_KEY not configured -- skipping email notifications'
    )
    return { sent: 0, failed: 0 }
  }

  const { subscribers, changelogName, changelogSlug, entryTitle, entryContent, changelogId } =
    params

  if (subscribers.length === 0) {
    return { sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0

  // Send emails in batches of 10 to stay well within rate limits
  const batchSize = 10
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize)

    const results = await Promise.allSettled(
      batch.map((sub) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: sub.email,
          subject: `[${changelogName}] New update: ${entryTitle}`,
          html: buildEmailHtml({
            changelogName,
            changelogSlug,
            entryTitle,
            entryContent,
            subscriberId: sub.id,
            changelogId,
          }),
        })
      )
    )

    for (const result of results) {
      if (result.status === 'fulfilled' && !result.value.error) {
        sent++
      } else {
        failed++
        if (result.status === 'rejected') {
          console.error('[email] Send failed:', result.reason)
        } else if (result.value.error) {
          console.error('[email] Send error:', result.value.error)
        }
      }
    }
  }

  console.log(
    `[email] Notification results: ${sent} sent, ${failed} failed out of ${subscribers.length}`
  )

  return { sent, failed }
}
