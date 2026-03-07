'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/markdown-editor'
import type { Entry } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ id: string; entryId: string }>
}

export default function EditEntryPage({ params }: Props) {
  const { id, entryId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [version, setVersion] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [scheduledFor, setScheduledFor] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEntry() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Verify changelog ownership
      const { data: changelog } = await supabase
        .from('changelogs')
        .select('id')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

      if (!changelog) {
        router.push('/dashboard')
        return
      }

      const { data: entryData } = await supabase
        .from('entries')
        .select('*')
        .eq('id', entryId)
        .eq('changelog_id', id)
        .single()

      if (!entryData) {
        router.push(`/dashboard/${id}`)
        return
      }

      const entry = entryData as unknown as Entry
      setTitle(entry.title)
      setContent(entry.content)
      setVersion(entry.version ?? '')
      setTags(entry.tags?.join(', ') ?? '')
      setIsPublished(entry.is_published)
      if (entry.scheduled_for) {
        setScheduledFor(new Date(entry.scheduled_for).toISOString().slice(0, 16))
      }
      setFetching(false)
    }

    loadEntry()
  }, [id, entryId, router, supabase])

  async function handleSave() {
    setLoading(true)
    setError('')

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        version: version.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to save')
      setLoading(false)
      return
    }

    router.push(`/dashboard/${id}`)
  }

  async function handleTogglePublish() {
    setLoading(true)
    setError('')

    const newState = !isPublished

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_published: newState,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to update')
      setLoading(false)
      return
    }

    setIsPublished(newState)
    setScheduledFor('')
    setLoading(false)
  }

  async function handleSchedule() {
    if (!scheduledFor) {
      setError('Please select a date and time')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduled_for: new Date(scheduledFor).toISOString(),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to schedule')
      setLoading(false)
      return
    }

    router.push(`/dashboard/${id}`)
  }

  async function handleCancelSchedule() {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduled_for: null }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to cancel schedule')
      setLoading(false)
      return
    }

    setScheduledFor('')
    setLoading(false)
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return
    }

    setDeleting(true)
    setError('')

    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to delete')
      setDeleting(false)
      return
    }

    router.push(`/dashboard/${id}`)
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <Link href={`/dashboard/${id}`} className="text-white/40 hover:text-white transition-colors text-sm">
            Changelog
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">Edit entry</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Edit entry</h1>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isPublished
                  ? 'bg-green-500/10 text-green-400'
                  : scheduledFor
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {isPublished ? 'Published' : scheduledFor ? 'Scheduled' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's new?"
              required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
          </div>

          <MarkdownEditor value={content} onChange={setContent} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.2.0"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="feature, bugfix, ui"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
              />
            </div>
          </div>

          {!isPublished && (
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Schedule for later</label>
              {scheduledFor ? (
                <div className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm [color-scheme:dark]"
                  />
                  <button
                    onClick={handleCancelSchedule}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 text-sm font-medium whitespace-nowrap"
                  >
                    Cancel schedule
                  </button>
                </div>
              ) : (
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm [color-scheme:dark]"
                />
              )}
              {scheduledFor && (
                <p className="text-xs text-white/40 mt-1">
                  Will auto-publish on {new Date(scheduledFor).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleTogglePublish}
              disabled={loading || deleting}
              className={`flex-1 font-medium py-3 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                isPublished
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                  : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
              }`}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
            {!isPublished && scheduledFor && (
              <button
                onClick={handleSchedule}
                disabled={loading || deleting}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Scheduling...' : 'Update schedule'}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading || deleting || !title.trim() || !content.trim()}
              className="flex-1 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-medium py-3 rounded-full transition-colors text-sm"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>

          <div className="border-t border-white/[0.06] pt-6">
            <button
              onClick={handleDelete}
              disabled={deleting || loading}
              className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete this entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
