import { createClient } from '@/lib/supabase/server'
import type { Changelog, Entry } from '@/lib/supabase/types'

const SITE_URL = 'https://www.changelogdev.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getAnchor(entry: Entry): string {
  return entry.version
    ? `v${entry.version.replace(/\./g, '-')}`
    : entry.id.slice(0, 8)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: changelogData } = await supabase
    .from('changelogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!changelogData) {
    return new Response('Not Found', { status: 404 })
  }

  const changelog = changelogData as Changelog

  const { data: entriesData } = await supabase
    .from('entries')
    .select('*')
    .eq('changelog_id', changelog.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const entries = (entriesData ?? []) as Entry[]

  const channelLink = `${SITE_URL}/${slug}`
  const lastBuildDate = entries.length > 0
    ? new Date(entries[0].published_at || entries[0].created_at).toUTCString()
    : new Date().toUTCString()

  const items = entries.map((entry) => {
    const anchor = getAnchor(entry)
    const link = `${channelLink}#${anchor}`
    const pubDate = new Date(entry.published_at || entry.created_at).toUTCString()
    const categories = (entry.tags ?? [])
      .map((tag) => `        <category>${escapeXml(tag)}</category>`)
      .join('\n')

    return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <description>${escapeXml(entry.content)}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(changelog.name)}</title>
    <description>${escapeXml(changelog.description ?? `What's new in ${changelog.name}`)}</description>
    <link>${channelLink}</link>
    <atom:link href="${channelLink}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <language>en</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
