import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import SubscribeForm from './subscribe-form'
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
  }
}

function getTagColor(tag: string): string {
  const t = tag.toLowerCase()
  if (t === 'feature' || t === 'new') return 'bg-green-500/15 text-green-400'
  if (t === 'fix' || t === 'bugfix' || t === 'bug') return 'bg-red-500/15 text-red-400'
  if (t === 'improvement' || t === 'enhancement') return 'bg-blue-500/15 text-blue-400'
  if (t === 'breaking' || t === 'deprecated') return 'bg-orange-500/15 text-orange-400'
  if (t === 'security') return 'bg-yellow-500/15 text-yellow-400'
  if (t === 'performance') return 'bg-purple-500/15 text-purple-400'
  return 'bg-white/10 text-white/50'
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">{changelog.name}</h1>
          {changelog.description && (
            <p className="text-white/50 text-sm mt-1">{changelog.description}</p>
          )}
          {subscriberCount > 0 && (
            <p className="text-white/30 text-xs mt-2">
              {subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {entries.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No entries published yet.
          </div>
        ) : (
          <div className="space-y-16">
            {entries.map((entry) => {
              const anchor = entry.version
                ? `v${entry.version.replace(/\./g, '-')}`
                : entry.id.slice(0, 8)
              return (
              <article key={entry.id} id={anchor} className="group scroll-mt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <a href={`#${anchor}`} className="flex items-center gap-2 group/link">
                        <h2 className="text-lg font-bold">{entry.title}</h2>
                        <span className="text-white/0 group-hover/link:text-white/30 transition-colors text-sm">#</span>
                      </a>
                      {entry.version && (
                        <span className="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {entry.version}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <time className="text-white/40 text-sm">
                        {new Date(entry.published_at || entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`${getTagColor(tag)} text-xs px-2 py-0.5 rounded-full`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-white/70 prose-headings:text-white prose-strong:text-white prose-a:text-indigo-400 prose-code:text-indigo-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
                  <ReactMarkdown>{entry.content}</ReactMarkdown>
                </div>
              </article>
              )
            })}
          </div>
        )}

        {/* Subscribe form */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <SubscribeForm changelogId={changelog.id} />
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
