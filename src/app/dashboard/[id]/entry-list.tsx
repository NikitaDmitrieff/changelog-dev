'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Entry } from '@/lib/supabase/types'

interface Props {
  entries: Entry[]
  changelogId: string
}

export function EntryList({ entries: initialEntries, changelogId }: Props) {
  const router = useRouter()
  const [entries, setEntries] = useState(initialEntries)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  async function handleTogglePublish(entry: Entry) {
    setLoadingId(entry.id)
    const newState = !entry.is_published

    const res = await fetch(`/api/entries/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: newState }),
    })

    if (res.ok) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? {
                ...e,
                is_published: newState,
                published_at: newState ? new Date().toISOString() : null,
              }
            : e
        )
      )
    }

    setLoadingId(null)
  }

  async function handleDelete(entryId: string) {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return
    }

    setLoadingId(entryId)

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== entryId))
    }

    setLoadingId(null)
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
        <p className="text-white/40 mb-4">No entries yet</p>
        <Link
          href={`/dashboard/${changelogId}/new-entry`}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          Create your first entry
        </Link>
      </div>
    )
  }

  const publishedCount = entries.filter((e) => e.is_published).length
  const draftCount = entries.filter((e) => !e.is_published).length

  const filteredEntries = entries.filter((entry) => {
    if (filter === 'published') return entry.is_published
    if (filter === 'draft') return !entry.is_published
    return true
  })

  const filterButtons: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: entries.length },
    { key: 'published', label: 'Published', count: publishedCount },
    { key: 'draft', label: 'Draft', count: draftCount },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              filter === btn.key
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>
      {filteredEntries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium">{entry.title}</span>
              {entry.version && (
                <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                  {entry.version}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  entry.is_published
                    ? 'bg-green-500/10 text-green-400'
                    : entry.scheduled_for
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {entry.is_published ? 'Published' : entry.scheduled_for ? 'Scheduled' : 'Draft'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <span>
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {entry.scheduled_for && !entry.is_published && (
                <span className="text-amber-400/60">
                  Publishes {new Date(entry.scheduled_for).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                  })}
                </span>
              )}
              {entry.view_count > 0 && (
                <span className="flex items-center gap-1" title="Views">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {entry.view_count}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTogglePublish(entry)}
              disabled={loadingId === entry.id}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                entry.is_published
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                  : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
              }`}
            >
              {entry.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <Link
              href={`/dashboard/${changelogId}/entries/${entry.id}/edit`}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(entry.id)}
              disabled={loadingId === entry.id}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
