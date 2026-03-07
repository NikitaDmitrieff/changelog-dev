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
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [sort, setSort] = useState<'newest' | 'oldest' | 'most-viewed' | 'least-viewed' | 'title-az' | 'title-za'>('newest')

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

  async function handleTogglePin(entry: Entry) {
    setLoadingId(entry.id)
    const newPinned = !entry.is_pinned

    const res = await fetch(`/api/entries/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: newPinned }),
    })

    if (res.ok) {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id === entry.id) return { ...e, is_pinned: newPinned }
          // If we're pinning this entry, unpin all others
          if (newPinned && e.is_pinned) return { ...e, is_pinned: false }
          return e
        })
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
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(entryId)
        return next
      })
    }

    setLoadingId(null)
  }

  function toggleSelect(entryId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }
      return next
    })
  }

  function toggleSelectAll() {
    const visibleIds = filteredEntries.map((e) => e.id)
    const allSelected = visibleIds.every((id) => selectedIds.has(id))
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        visibleIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        visibleIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  async function handleBulkAction(action: 'publish' | 'unpublish' | 'delete') {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${ids.length} ${ids.length === 1 ? 'entry' : 'entries'}? This cannot be undone.`)) {
        return
      }
    }

    setBulkLoading(true)

    const res = await fetch('/api/entries/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_ids: ids, action }),
    })

    if (res.ok) {
      if (action === 'delete') {
        setEntries((prev) => prev.filter((e) => !selectedIds.has(e.id)))
      } else if (action === 'publish') {
        setEntries((prev) =>
          prev.map((e) =>
            selectedIds.has(e.id)
              ? { ...e, is_published: true, published_at: new Date().toISOString(), scheduled_for: null }
              : e
          )
        )
      } else if (action === 'unpublish') {
        setEntries((prev) =>
          prev.map((e) =>
            selectedIds.has(e.id)
              ? { ...e, is_published: false, published_at: null }
              : e
          )
        )
      }
      setSelectedIds(new Set())
    }

    setBulkLoading(false)
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

  const searchLower = search.toLowerCase().trim()

  const filteredEntries = entries.filter((entry) => {
    if (filter === 'published' && !entry.is_published) return false
    if (filter === 'draft' && entry.is_published) return false

    if (searchLower) {
      const titleMatch = entry.title.toLowerCase().includes(searchLower)
      const versionMatch = entry.version?.toLowerCase().includes(searchLower) ?? false
      const tagMatch = entry.tags?.some((t) => t.toLowerCase().includes(searchLower)) ?? false
      if (!titleMatch && !versionMatch && !tagMatch) return false
    }

    return true
  })

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'most-viewed':
        return b.view_count - a.view_count
      case 'least-viewed':
        return a.view_count - b.view_count
      case 'title-az':
        return a.title.localeCompare(b.title)
      case 'title-za':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const filterButtons: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: entries.length },
    { key: 'published', label: 'Published', count: publishedCount },
    { key: 'draft', label: 'Draft', count: draftCount },
  ]

  const visibleIds = sortedEntries.map((e) => e.id)
  const selectedVisible = visibleIds.filter((id) => selectedIds.has(id))
  const allVisibleSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length
  const someSelected = selectedIds.size > 0

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries by title, version, or tag…"
          aria-label="Search entries"
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2" role="group" aria-label="Filter entries by status">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              aria-pressed={filter === btn.key}
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

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort entries"
            className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/60 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="most-viewed">Most viewed</option>
            <option value="least-viewed">Least viewed</option>
            <option value="title-az">Title A-Z</option>
            <option value="title-za">Title Z-A</option>
          </select>

        {sortedEntries.length > 0 && (
          <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer select-none hover:text-white/60 transition-colors">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer"
            />
            Select all
          </label>
        )}
        </div>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div
          className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3"
          role="toolbar"
          aria-label="Bulk actions"
        >
          <span className="text-sm text-indigo-300 font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction('publish')}
              disabled={bulkLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              disabled={bulkLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors disabled:opacity-50"
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={bulkLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              disabled={bulkLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {sortedEntries.length === 0 && (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <p className="text-white/40 text-sm">
            {search ? `No entries matching "${search}"` : 'No entries match the current filter'}
          </p>
        </div>
      )}

      {sortedEntries.map((entry) => (
        <div
          key={entry.id}
          className={`bg-white/5 border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors ${
            selectedIds.has(entry.id)
              ? 'border-indigo-500/40 bg-indigo-500/5'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <input
              type="checkbox"
              checked={selectedIds.has(entry.id)}
              onChange={() => toggleSelect(entry.id)}
              aria-label={`Select ${entry.title}`}
              className="mt-1 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                {entry.is_pinned && (
                  <span className="text-amber-400 text-xs" title="Pinned">
                    <svg className="w-3.5 h-3.5 inline" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                    </svg>
                  </span>
                )}
                <span className="font-medium truncate">{entry.title}</span>
                {entry.version && (
                  <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full shrink-0">
                    {entry.version}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
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
                    <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {entry.view_count}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleTogglePin(entry)}
              disabled={loadingId === entry.id}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                entry.is_pinned
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                  : 'bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/50'
              }`}
              title={entry.is_pinned ? 'Unpin entry' : 'Pin to top'}
            >
              {entry.is_pinned ? 'Unpin' : 'Pin'}
            </button>
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
