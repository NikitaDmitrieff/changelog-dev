import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { Changelog, Entry } from '@/lib/supabase/types'
import { EntryList } from './entry-list'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChangelogManagePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: changelogData } = await supabase
    .from('changelogs')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!changelogData) notFound()

  const changelog = changelogData as unknown as Changelog

  const { data: entriesData } = await supabase
    .from('entries')
    .select('*')
    .eq('changelog_id', id)
    .order('created_at', { ascending: false })

  const entries = (entriesData ?? []) as unknown as Entry[]

  const { data: subscribersData } = await supabase
    .from('subscribers')
    .select('id')
    .eq('changelog_id', id)
    .eq('confirmed', true)

  const subscriberCount = subscribersData?.length ?? 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">{changelog.name}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">{changelog.name}</h1>
            {changelog.description && (
              <p className="text-white/50 text-sm mt-1">{changelog.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <Link
                href={`/${changelog.slug}`}
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5"
              >
                changelog.dev/{changelog.slug}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <span className="text-white/30 text-sm">{subscriberCount} subscribers</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/${id}/settings`}
              className="text-white/40 hover:text-white transition-colors text-sm border border-white/20 px-4 py-2.5 rounded-lg"
            >
              Settings
            </Link>
            <Link
              href={`/dashboard/${id}/new-entry`}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              New entry
            </Link>
          </div>
        </div>

        {/* Entries */}
        <div>
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
            Entries
          </h2>

          <EntryList entries={entries} changelogId={id} />
        </div>
      </div>
    </div>
  )
}
