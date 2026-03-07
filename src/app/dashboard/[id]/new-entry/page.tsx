'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/markdown-editor'
import { entryTemplates, type EntryTemplate } from '@/lib/templates'

interface Props {
  params: Promise<{ id: string }>
}

export default function NewEntryPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [version, setVersion] = useState('')
  const [tags, setTags] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [hasGithub, setHasGithub] = useState<boolean | null>(null)
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  const isFormEmpty = !title.trim() && !content.trim() && !version.trim() && !tags.trim()

  function applyTemplate(template: EntryTemplate) {
    setTitle(template.title)
    setContent(template.content)
    setTags(template.tags)
    setVersion(template.version)
    setActiveTemplate(template.id)
  }

  function clearTemplate() {
    setTitle('')
    setContent('')
    setTags('')
    setVersion('')
    setActiveTemplate(null)
  }

  useEffect(() => {
    supabase
      .from('changelogs')
      .select('github_repo')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setHasGithub(!!data?.github_repo)
      })
  }, [id])

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/github/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changelog_id: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setTitle(data.title)
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate')
    }
    setGenerating(false)
  }

  async function handleSave(mode: 'draft' | 'publish' | 'schedule') {
    setLoading(true)
    setError('')

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const isPublish = mode === 'publish'
    const isSchedule = mode === 'schedule'

    if (isSchedule && !scheduledFor) {
      setError('Please select a date and time to schedule')
      setLoading(false)
      return
    }

    const { data: newEntry, error } = await supabase.from('entries').insert({
      changelog_id: id,
      title: trimmedTitle,
      content: trimmedContent,
      version: version.trim() || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      is_published: isPublish,
      published_at: isPublish ? new Date().toISOString() : null,
      scheduled_for: isSchedule ? new Date(scheduledFor).toISOString() : null,
    }).select('id').single()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Fire-and-forget: notify subscribers when publishing
    if (isPublish) {
      fetch('/api/notify-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changelog_id: id,
          entry_id: newEntry?.id,
          entry_title: trimmedTitle,
          entry_content: trimmedContent,
        }),
      }).catch((err) => console.error('Failed to notify subscribers:', err))
    }

    router.push(`/dashboard/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <Link href={`/dashboard/${id}`} className="text-white/40 hover:text-white transition-colors text-sm">
            Changelog
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">New entry</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">New entry</h1>
          {hasGithub && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate from GitHub
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {isFormEmpty && (
            <div>
              <label className="block text-sm text-white/60 mb-2">Start from a template</label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={clearTemplate}
                  className={`text-left rounded-lg border px-3 py-3 transition-colors ${
                    activeTemplate === null
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="block text-sm font-medium text-white">Blank</span>
                  <span className="block text-xs text-white/40 mt-0.5">Start from scratch</span>
                </button>
                {entryTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`text-left rounded-lg border px-3 py-3 transition-colors ${
                      activeTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="block text-sm font-medium text-white">{template.name}</span>
                    <span className="block text-xs text-white/40 mt-0.5">{template.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
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
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="feature, bugfix, ui"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Schedule for later</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm [color-scheme:dark]"
            />
            {scheduledFor && (
              <p className="text-xs text-white/40 mt-1">
                Will auto-publish on {new Date(scheduledFor).toLocaleString()}
              </p>
            )}
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSave('draft')}
              disabled={loading || !title.trim() || !content.trim()}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Save draft
            </button>
            {scheduledFor ? (
              <button
                onClick={() => handleSave('schedule')}
                disabled={loading || !title.trim() || !content.trim()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Scheduling...' : 'Schedule'}
              </button>
            ) : (
              <button
                onClick={() => handleSave('publish')}
                disabled={loading || !title.trim() || !content.trim()}
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
