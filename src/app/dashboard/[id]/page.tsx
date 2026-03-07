import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Changelog, Entry } from '@/lib/supabase/types'
import { EntryList } from './entry-list'
import { AnalyticsPanel } from './analytics-panel'
import { WebhookEventsPanel } from './webhook-events-panel'
import { OnboardingChecklist } from '@/components/onboarding-checklist'
import type { OnboardingStep } from '@/components/onboarding-checklist'
import { ExportDropdown } from './export-dropdown'

export const metadata: Metadata = {
  title: 'Changelog | changelog.dev',
}

interface Props {
  params: Promise<{ id: string }>
}

function ConfigWarnings() {
  const warnings: { label: string; detail: string }[] = []

  if (!process.env.RESEND_API_KEY) {
    warnings.push({
      label: 'Email notifications disabled',
      detail: 'Set RESEND_API_KEY to enable subscriber emails.',
    })
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    warnings.push({
      label: 'Stripe webhooks inactive',
      detail: 'Set STRIPE_WEBHOOK_SECRET to process subscription events.',
    })
  }

  if (warnings.length === 0) return null

  return (
    <div className="mb-6 space-y-2">
      {warnings.map((w) => (
        <div
          key={w.label}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3 text-sm"
        >
          <span className="text-amber-400 font-medium">{w.label}</span>
          <span className="text-amber-400/70 ml-2">{w.detail}</span>
        </div>
      ))}
    </div>
  )
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

  const [{ data: entriesData }, { data: subscribersData }, { count: apiKeyCount }] = await Promise.all([
    supabase
      .from('entries')
      .select('*')
      .eq('changelog_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('subscribers')
      .select('id, subscribed_at')
      .eq('changelog_id', id)
      .eq('confirmed', true),
    supabase
      .from('api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('changelog_id', id)
      .is('revoked_at', null),
  ])

  const entries = (entriesData ?? []) as unknown as Entry[]

  const subscribers = subscribersData ?? []
  const subscriberCount = subscribers.length

  const hasApiKey = (apiKeyCount ?? 0) > 0
  const hasPublishedEntry = entries.some((e) => e.is_published)

  const onboardingSteps: OnboardingStep[] = [
    {
      key: 'api-key',
      title: 'Generate an API key',
      description: 'Create an API key to push entries via the CLI or REST API.',
      done: hasApiKey,
      href: `/dashboard/${id}/settings`,
      cta: 'Go to settings',
    },
    {
      key: 'cli-push',
      title: 'Push your first entry via CLI or API',
      description: 'Install the CLI with npm install -g changelogdev-cli, then push an entry.',
      done: hasPublishedEntry,
      href: `/${changelog.slug}`,
      cta: 'View changelog',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">{changelog.name}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <ConfigWarnings />

        <OnboardingChecklist steps={onboardingSteps} changelogId={id} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold">{changelog.name}</h1>
            {changelog.description && (
              <p className="text-white/50 text-sm mt-1">{changelog.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <Link
                href={`/${changelog.slug}`}
                target="_blank"
                className="text-zinc-400 hover:text-white text-sm flex items-center gap-1.5"
              >
                changelog.dev/{changelog.slug}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <span className="text-white/30 text-sm">{subscriberCount} subscribers</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <ExportDropdown changelogId={id} />
            <Link
              href={`/dashboard/${id}/import`}
              className="text-white/40 hover:text-white transition-colors text-sm border border-white/[0.12] px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Import
            </Link>
            <Link
              href={`/dashboard/${id}/settings`}
              className="text-white/40 hover:text-white transition-colors text-sm border border-white/[0.12] px-3 sm:px-4 py-2 sm:py-2.5 rounded-full"
            >
              Settings
            </Link>
            <Link
              href={`/dashboard/${id}/new-entry`}
              className="bg-white hover:bg-zinc-200 text-black font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-colors text-sm"
            >
              New entry
            </Link>
          </div>
        </div>

        {/* Quick-start hints */}
        {entries.length === 0 && (
          <div className="mb-8 card rounded-xl p-6">
            <div className="text-sm font-medium text-white mb-3">Quick start</div>
            <div className="space-y-3">
              {!changelog.github_repo && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                  <span className="text-zinc-400">
                    <Link href={`/dashboard/${id}/settings`} className="text-zinc-400 hover:text-white">Connect a GitHub repo</Link>
                    {' '}to generate entries with AI
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                <span className="text-zinc-400">
                  <Link href={`/dashboard/${id}/new-entry`} className="text-zinc-400 hover:text-white">Create your first entry</Link>
                  {changelog.github_repo ? ' — use "Generate from GitHub" for a head start' : ' — write it manually or connect a repo first'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                <span className="text-zinc-400">
                  <Link href={`/dashboard/${id}/settings`} className="text-zinc-400 hover:text-white">Generate an API key</Link>
                  {' '}to push entries programmatically
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                <span className="text-zinc-400">
                  Install the CLI: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs text-zinc-400">npm install -g changelogdev-cli</code>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {entries.length > 0 && (
          <AnalyticsPanel entries={entries} subscribers={subscribers} />
        )}

        {/* Webhook Events */}
        <WebhookEventsPanel />

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
