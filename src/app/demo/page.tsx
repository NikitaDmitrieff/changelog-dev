'use client'

import { useState } from 'react'
import Link from 'next/link'

const CHANGELOGS = [
  { id: 'cl1', name: 'Acme Dashboard', slug: 'acme', repo: 'acme-corp/dashboard', synced: '2 hours ago', status: 'synced', entries: 14, subscribers: 243 },
  { id: 'cl2', name: 'Acme API', slug: 'acme-api', repo: 'acme-corp/api', synced: '5 hours ago', status: 'synced', entries: 9, subscribers: 87 },
  { id: 'cl3', name: 'Mobile App', slug: 'acme-mobile', repo: 'acme-corp/mobile', synced: '1 day ago', status: 'draft', entries: 3, subscribers: 31 },
]

const ENTRIES = [
  {
    id: 'e1',
    version: 'v2.4.0',
    title: 'Dashboard redesign + 3x performance boost',
    date: 'Mar 5, 2026',
    tags: ['Performance', 'UI'],
    tagColors: ['emerald', 'blue'],
    status: 'published',
    content: 'The dashboard now loads significantly faster thanks to query optimization. We redesigned the navigation with a cleaner layout and added keyboard shortcuts for power users.',
  },
  {
    id: 'e2',
    version: 'v2.3.2',
    title: 'Bug fixes + dark mode improvements',
    date: 'Feb 18, 2026',
    tags: ['Fix'],
    tagColors: ['orange'],
    status: 'published',
    content: 'Fixed an issue with dark mode on Safari. Improved contrast on several UI elements. Fixed a crash when uploading files larger than 10MB.',
  },
  {
    id: 'e3',
    version: 'v2.3.0',
    title: 'Team workspaces — invite your whole team',
    date: 'Feb 3, 2026',
    tags: ['Feature'],
    tagColors: ['indigo'],
    status: 'published',
    content: 'You can now invite teammates to collaborate on your changelogs. Set roles: Owner, Editor, or Viewer. Team members get notified on new entries.',
  },
  {
    id: 'e4',
    version: 'v2.2.1',
    title: 'Stripe billing + subscriber growth metrics',
    date: 'Jan 22, 2026',
    tags: ['Feature', 'Analytics'],
    tagColors: ['indigo', 'purple'],
    status: 'draft',
    content: 'Stripe integration is live. Track subscriber growth over time with the new analytics panel. Export subscriber list as CSV.',
  },
]

const TAG_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const ANALYTICS_WEEKS = ['Jan W3', 'Jan W4', 'Feb W1', 'Feb W2', 'Feb W3', 'Feb W4', 'Mar W1']
const PAGEVIEW_DATA = [34, 58, 45, 92, 78, 143, 189]
const SUBSCRIBER_DATA = [12, 15, 19, 28, 34, 51, 71]

function MiniBar({ value, max, color = 'bg-indigo-500' }: { value: number; max: number; color?: string }) {
  return (
    <div className="flex-1 flex flex-col justify-end h-16">
      <div
        className={`w-full rounded-sm ${color} opacity-70 transition-all`}
        style={{ height: `${Math.round((value / max) * 100)}%` }}
      />
    </div>
  )
}

type Tab = 'changelog' | 'repos' | 'analytics' | 'settings'

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('changelog')
  const [selectedChangelog, setSelectedChangelog] = useState(CHANGELOGS[0])
  const [accentColor, setAccentColor] = useState('indigo')
  const [headerFont, setHeaderFont] = useState('Inter')
  const [showSubscribeWidget, setShowSubscribeWidget] = useState(true)

  const maxViews = Math.max(...PAGEVIEW_DATA)
  const maxSubs = Math.max(...SUBSCRIBER_DATA)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top nav */}
      <header className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-white tracking-tight">changelog.dev</Link>
          <span className="text-white/10">|</span>
          <span className="text-xs text-zinc-500 font-medium">Demo Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600 bg-zinc-900 border border-white/[0.06] px-3 py-1.5 rounded-lg font-mono">demo@acme.com</span>
          <Link
            href="/login"
            className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            Start free →
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-56 border-r border-white/[0.06] flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/[0.06]">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold mb-3">Changelogs</p>
            <div className="space-y-0.5">
              {CHANGELOGS.map((cl) => (
                <button
                  key={cl.id}
                  onClick={() => setSelectedChangelog(cl)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedChangelog.id === cl.id
                      ? 'bg-white/[0.06] text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cl.status === 'synced' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  <span className="truncate">{cl.name}</span>
                </button>
              ))}
            </div>
          </div>

          <nav className="p-4 flex-1">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold mb-3">Views</p>
            <div className="space-y-0.5">
              {([
                { id: 'changelog', label: 'Changelog', icon: '≡' },
                { id: 'repos', label: 'Repositories', icon: '⑂' },
                { id: 'analytics', label: 'Analytics', icon: '↗' },
                { id: 'settings', label: 'Settings', icon: '⚙' },
              ] as { id: Tab; label: string; icon: string }[]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-base leading-none opacity-60">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-white/[0.06]">
            <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-xs text-indigo-300">
              <div className="font-semibold mb-1">Free plan</div>
              <div className="text-indigo-400/60">1 of 1 changelog used</div>
              <Link href="/login" className="mt-2 block text-indigo-400 hover:text-indigo-300 font-medium">
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'changelog' && (
            <div className="max-w-3xl mx-auto px-8 py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-xl font-semibold text-white">{selectedChangelog.name}</h1>
                  <p className="text-sm text-zinc-600 mt-0.5">changelog.dev/{selectedChangelog.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/${selectedChangelog.slug}`}
                    target="_blank"
                    className="text-xs text-zinc-500 hover:text-white border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View public page ↗
                  </a>
                  <button className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                    + New entry
                  </button>
                </div>
              </div>

              {/* Entries */}
              <div className="space-y-3">
                {ENTRIES.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs bg-white/[0.05] text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded font-mono">
                            {entry.version}
                          </span>
                          <span className="text-xs text-zinc-600">{entry.date}</span>
                          {entry.status === 'draft' && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-white mb-1.5">{entry.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{entry.content}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {entry.tags.map((tag, i) => (
                            <span
                              key={tag}
                              className={`text-xs border px-2 py-0.5 rounded ${TAG_COLORS[entry.tagColors[i]]}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-700 shrink-0 pt-0.5">Edit →</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'repos' && (
            <div className="max-w-3xl mx-auto px-8 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-xl font-semibold text-white">Connected repositories</h1>
                  <p className="text-sm text-zinc-600 mt-0.5">GitHub repos synced to your changelogs</p>
                </div>
                <button className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                  + Connect repo
                </button>
              </div>

              <div className="space-y-3">
                {CHANGELOGS.map((cl) => (
                  <div key={cl.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 text-sm">
                          ⑂
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{cl.repo}</div>
                          <div className="text-xs text-zinc-600 mt-0.5">For: {cl.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-xs font-medium ${cl.status === 'synced' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {cl.status === 'synced' ? '✓ Synced' : '○ Pending'}
                          </div>
                          <div className="text-xs text-zinc-600 mt-0.5">{cl.synced}</div>
                        </div>
                        <button className="text-xs text-zinc-500 hover:text-white border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 rounded-lg transition-colors">
                          Sync now
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.04] grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-zinc-600 mb-0.5">Commits fetched</div>
                        <div className="text-sm font-medium text-white">47</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600 mb-0.5">Entries generated</div>
                        <div className="text-sm font-medium text-white">{cl.entries}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600 mb-0.5">Last release</div>
                        <div className="text-sm font-medium text-white">{cl.synced}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-white/[0.08] p-8 text-center">
                <div className="text-2xl mb-2">⑂</div>
                <div className="text-sm text-zinc-500">Connect another GitHub repository</div>
                <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  + Add repository
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-3xl mx-auto px-8 py-8">
              <div className="mb-8">
                <h1 className="text-xl font-semibold text-white">Analytics</h1>
                <p className="text-sm text-zinc-600 mt-0.5">Last 7 weeks · {selectedChangelog.name}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total page views', value: '639', delta: '+32%', color: 'text-emerald-400' },
                  { label: 'Subscribers', value: String(selectedChangelog.subscribers), delta: '+18%', color: 'text-emerald-400' },
                  { label: 'Avg. open rate', value: '34%', delta: '+5%', color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-xs text-zinc-600 mb-2">{stat.label}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className={`text-xs mt-1 ${stat.color}`}>{stat.delta} this month</div>
                  </div>
                ))}
              </div>

              {/* Page views chart */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-white">Page views</div>
                  <div className="text-xs text-zinc-600">Weekly</div>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {PAGEVIEW_DATA.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <MiniBar value={v} max={maxViews} color="bg-indigo-500" />
                      <span className="text-[10px] text-zinc-700">{ANALYTICS_WEEKS[i].split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribers chart */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-white">Subscriber growth</div>
                  <div className="text-xs text-zinc-600">Cumulative</div>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {SUBSCRIBER_DATA.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <MiniBar value={v} max={maxSubs} color="bg-emerald-500" />
                      <span className="text-[10px] text-zinc-700">{ANALYTICS_WEEKS[i].split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto px-8 py-8">
              <div className="mb-8">
                <h1 className="text-xl font-semibold text-white">Appearance</h1>
                <p className="text-sm text-zinc-600 mt-0.5">Customize how your public changelog looks</p>
              </div>

              <div className="space-y-6">
                {/* Accent color */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="text-sm font-medium text-white mb-4">Accent color</h3>
                  <div className="flex gap-3">
                    {[
                      { name: 'indigo', class: 'bg-indigo-500' },
                      { name: 'emerald', class: 'bg-emerald-500' },
                      { name: 'violet', class: 'bg-violet-500' },
                      { name: 'rose', class: 'bg-rose-500' },
                      { name: 'amber', class: 'bg-amber-500' },
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setAccentColor(c.name)}
                        className={`w-8 h-8 rounded-full ${c.class} transition-all ${
                          accentColor === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Font */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="text-sm font-medium text-white mb-4">Header font</h3>
                  <div className="flex gap-2 flex-wrap">
                    {['Inter', 'Geist', 'Cal Sans', 'Playfair Display'].map((font) => (
                      <button
                        key={font}
                        onClick={() => setHeaderFont(font)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                          headerFont === font
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                            : 'border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20 bg-white/[0.02]'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subscribe widget */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">Subscribe widget</h3>
                      <p className="text-xs text-zinc-600 mt-0.5">Show email subscribe form on your public page</p>
                    </div>
                    <button
                      onClick={() => setShowSubscribeWidget(!showSubscribeWidget)}
                      className={`w-11 h-6 rounded-full relative transition-colors ${showSubscribeWidget ? 'bg-indigo-500' : 'bg-white/10'}`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${showSubscribeWidget ? 'left-6' : 'left-1'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="text-sm font-medium text-white mb-4">Preview</h3>
                  <div className="rounded-lg border border-white/[0.06] bg-[#080808] p-5">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.04]">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                        style={{ backgroundColor: accentColor === 'indigo' ? '#6366f1' : accentColor === 'emerald' ? '#10b981' : accentColor === 'violet' ? '#8b5cf6' : accentColor === 'rose' ? '#f43f5e' : '#f59e0b' }}
                      >
                        A
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white" style={{ fontFamily: headerFont === 'Inter' ? 'Inter' : undefined }}>
                          {selectedChangelog.name}
                        </div>
                        <div className="text-xs text-zinc-600">changelog.dev/{selectedChangelog.slug}</div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400 font-medium mb-1">v2.4.0 · Mar 5, 2026</div>
                    <div className="text-sm font-semibold text-white mb-1.5">Dashboard redesign + 3x performance boost</div>
                    <div className="text-xs text-zinc-500 leading-relaxed">
                      The dashboard now loads significantly faster thanks to query optimization...
                    </div>
                    {showSubscribeWidget && (
                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-xs text-zinc-600">
                          Enter your email
                        </div>
                        <button
                          className="text-xs text-white font-medium px-3 py-1.5 rounded"
                          style={{ backgroundColor: accentColor === 'indigo' ? '#6366f1' : accentColor === 'emerald' ? '#10b981' : accentColor === 'violet' ? '#8b5cf6' : accentColor === 'rose' ? '#f43f5e' : '#f59e0b' }}
                        >
                          Subscribe
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 rounded-lg transition-colors text-sm">
                  Save changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
