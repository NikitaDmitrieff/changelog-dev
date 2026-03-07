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

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
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
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {entry.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="text-xs text-white/30">
              {new Date(entry.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
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
