import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SubscribeForm from './subscribe-form'
import EntryList from './entry-list'
import ViewTracker from './view-tracker'
import type { Changelog, Entry, Subscriber } from '@/lib/supabase/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('changelogs').select('name, description').eq('slug', slug).single()
  if (!data) return {}
  const title = `${data.name} — Changelog`
  const description = data.description ?? `What's new in ${data.name}`
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      types: {
        'application/rss+xml': `/${slug}/rss.xml`,
      },
    },
  }
}

export default async function PublicChangelogPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: changelogData } = await supabase
    .from('changelogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!changelogData) notFound()

  const changelog = changelogData as Changelog

  const { data: entriesData } = await supabase
    .from('entries')
    .select('*')
    .eq('changelog_id', changelog.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const entries = (entriesData ?? []) as Entry[]

  const { data: subscribersData } = await supabase
    .from('subscribers')
    .select('id')
    .eq('changelog_id', changelog.id)
    .eq('confirmed', true)

  const subscribers = (subscribersData ?? []) as Pick<Subscriber, 'id'>[]

  const subscriberCount = subscribers.length
  const accentColor = changelog.accent_color || '#6366f1'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {changelog.logo_url && (
              <img
                src={changelog.logo_url}
                alt={`${changelog.name} logo`}
                className="w-8 h-8 rounded-lg object-cover"
              />
            )}
            <h1 className="text-2xl font-bold">{changelog.name}</h1>
          </div>
          {changelog.description && (
            <p className="text-white/50 text-sm mt-1">{changelog.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {subscriberCount > 0 && (
              <p className="text-white/30 text-xs">
                {subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''}
              </p>
            )}
            <a
              href={`/${slug}/rss.xml`}
              className="text-white/30 hover:text-orange-400 transition-colors flex items-center gap-1 text-xs"
              title="RSS Feed"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {entries.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No entries published yet.
          </div>
        ) : (
          <>
            <ViewTracker entryIds={entries.map((e) => e.id)} />
            <EntryList entries={entries} accentColor={accentColor} />
          </>
        )}

        {/* Subscribe form */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <SubscribeForm changelogId={changelog.id} accentColor={accentColor} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-white/20 hover:text-white/40 text-xs transition-colors"
          >
            Powered by changelog.dev
          </a>
        </div>
      </main>
    </div>
  )
}
