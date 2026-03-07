'use client'

import { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Entry } from '@/lib/supabase/types'

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

interface EntryListProps {
  entries: Entry[]
  accentColor?: string
}

export default function EntryList({ entries, accentColor = '#6366f1' }: EntryListProps) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const entry of entries) {
      if (entry.tags) {
        for (const tag of entry.tags) {
          tagSet.add(tag)
        }
      }
    }
    return Array.from(tagSet).sort()
  }, [entries])

  const filtered = useMemo(() => {
    let result = entries

    if (activeTag) {
      result = result.filter(
        (e) => e.tags && e.tags.some((t) => t === activeTag)
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q)
      )
    }

    return result
  }, [entries, activeTag, search])

  return (
    <div>
      <style>{`
        .changelog-prose a { color: ${accentColor}; }
        .changelog-prose code:not(pre code) { color: ${accentColor}; }
      `}</style>
      {/* Search + Tag Filters */}
      <div className="mb-12 space-y-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 transition-colors"
            style={{ '--tw-ring-color': accentColor, borderColor: undefined } as React.CSSProperties}
            onFocus={(e) => { e.currentTarget.style.borderColor = accentColor }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTag === null
                  ? 'border-current'
                  : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
              }`}
              style={activeTag === null ? { backgroundColor: `${accentColor}33`, color: accentColor, borderColor: `${accentColor}80` } : undefined}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeTag === tag
                    ? `${getTagColor(tag)} border-current`
                    : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entry List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          No entries match your search.
        </div>
      ) : (
        <div className="space-y-16">
          {filtered.map((entry) => {
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
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                        >
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
                <div
                  className="changelog-prose prose prose-invert prose-sm max-w-none text-white/70 prose-headings:text-white prose-strong:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
                >
                  <ReactMarkdown>{entry.content}</ReactMarkdown>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
