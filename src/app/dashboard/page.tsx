import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Changelog } from '@/lib/supabase/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: changelogsData } = await supabase
    .from('changelogs')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const changelogs = (changelogsData ?? []) as unknown as Changelog[]

  // Get entry counts per changelog
  const changelogIds = changelogs.map((c) => c.id)
  const { data: entriesData } = changelogIds.length
    ? await supabase
        .from('entries')
        .select('changelog_id')
        .in('changelog_id', changelogIds)
    : { data: [] }

  const { data: subscribersData } = changelogIds.length
    ? await supabase
        .from('subscribers')
        .select('changelog_id')
        .in('changelog_id', changelogIds)
    : { data: [] }

  const entries = (entriesData ?? []) as { changelog_id: string }[]
  const subscribers = (subscribersData ?? []) as { changelog_id: string }[]

  const entryCounts: Record<string, number> = {}
  const subscriberCounts: Record<string, number> = {}

  entries.forEach((e) => {
    entryCounts[e.changelog_id] = (entryCounts[e.changelog_id] ?? 0) + 1
  })
  subscribers.forEach((s) => {
    subscriberCounts[s.changelog_id] = (subscriberCounts[s.changelog_id] ?? 0) + 1
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            changelog.dev
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-white/40 hover:text-white transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Changelogs</h1>
            <p className="text-white/40 text-sm mt-1">{user.email}</p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            New changelog
          </Link>
        </div>

        {changelogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 mb-4">No changelogs yet</p>
            <Link
              href="/dashboard/new"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Create your first changelog
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {changelogs.map((changelog) => (
              <Link
                key={changelog.id}
                href={`/dashboard/${changelog.id}`}
                className="block bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-5 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold group-hover:text-indigo-300 transition-colors">
                      {changelog.name}
                    </div>
                    <div className="text-sm text-white/40 mt-0.5">
                      changelog.dev/{changelog.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/40">
                    <span>{entryCounts[changelog.id] ?? 0} entries</span>
                    <span>{subscriberCounts[changelog.id] ?? 0} subscribers</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
