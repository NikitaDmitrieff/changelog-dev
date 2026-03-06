import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Changelog } from '@/lib/supabase/types'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isPro = !!(user.user_metadata?.is_pro)
  const params = await searchParams
  const justUpgraded = params.upgraded === '1'

  const { data: changelogsData } = await supabase
    .from('changelogs')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const changelogs = (changelogsData ?? []) as unknown as Changelog[]

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

  const atFreeLimit = !isPro && changelogs.length >= 1
  const isNewUser = changelogs.length === 0

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            changelog.dev
          </Link>
          <div className="flex items-center gap-4">
            {isPro && (
              <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                Pro
              </span>
            )}
            <form action="/auth/signout" method="post">
              <button className="text-sm text-zinc-500 hover:text-white transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {justUpgraded && (
          <div className="mb-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-5 py-4 text-sm text-indigo-300">
            Welcome to Pro! You now have unlimited changelogs and subscribers.
          </div>
        )}

        {!isPro && process.env.STRIPE_SECRET_KEY && (
          <div className="mb-6 glass-card rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Free plan — 1 changelog, 100 subscribers</div>
              <div className="text-xs text-zinc-500 mt-0.5">Upgrade to Pro for unlimited everything</div>
            </div>
            <UpgradeButton />
          </div>
        )}

        {isNewUser ? (
          <Onboarding email={user.email ?? ''} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Your Changelogs</h1>
                <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
              </div>
              {atFreeLimit ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-600">Free plan: 1 changelog max</span>
                  <UpgradeButton small />
                </div>
              ) : (
                <Link
                  href="/dashboard/new"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
                >
                  New changelog
                </Link>
              )}
            </div>

            <div className="space-y-3">
              {changelogs.map((changelog) => (
                <Link
                  key={changelog.id}
                  href={`/dashboard/${changelog.id}`}
                  className="block glass-card hover:border-white/[0.12] rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold group-hover:text-indigo-300 transition-colors">
                        {changelog.name}
                      </div>
                      <div className="text-sm text-zinc-500 mt-0.5">
                        changelog.dev/{changelog.slug}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-zinc-500">
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
          </>
        )}
      </div>
    </div>
  )
}

function Onboarding({ email }: { email: string }) {
  const steps = [
    {
      num: "1",
      title: "Create your changelog",
      desc: "Give it a name and a URL slug. Your page will be live at changelog.dev/your-slug.",
      action: { href: "/dashboard/new", label: "Create changelog" },
      done: false,
    },
    {
      num: "2",
      title: "Connect GitHub & generate entries",
      desc: "Paste your repo URL. AI will draft changelog entries from your commits.",
      done: false,
    },
    {
      num: "3",
      title: "Share your changelog page",
      desc: "Your changelog is public. Share the link with your users, add it to your footer, embed it anywhere.",
      done: false,
    },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Welcome to changelog.dev</h1>
        <p className="text-zinc-500 text-sm mt-1">{email} · Free plan</p>
      </div>

      <div className="mb-8 glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-white">Get started in 3 steps</div>
            <div className="text-xs text-zinc-500">Takes about 5 minutes</div>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-5">
              <div className="shrink-0 w-8 h-8 rounded-full border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm font-semibold mt-0.5">
                {step.num}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{step.title}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{step.desc}</div>
                {step.action && (
                  <Link
                    href={step.action.href}
                    className="inline-block mt-3 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {step.action.label}
                  </Link>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute ml-4 mt-9 w-px h-6 bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 flex items-center gap-4">
        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">See a live example</div>
          <div className="text-xs text-zinc-500 mt-0.5">Checkout the changelog.dev demo page to see what yours will look like</div>
        </div>
        <Link
          href="/changelog-dev"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
        >
          View demo →
        </Link>
      </div>
    </div>
  )
}

function UpgradeButton({ small }: { small?: boolean }) {
  return (
    <form action="/api/stripe/checkout" method="POST">
      <button
        type="submit"
        className={
          small
            ? 'bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors'
            : 'bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors'
        }
      >
        Upgrade to Pro — $29/mo
      </button>
    </form>
  )
}
