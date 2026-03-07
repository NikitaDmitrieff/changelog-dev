'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { Changelog } from '@/lib/supabase/types'

function normalizeRepo(repo: string): string {
  return repo
    .replace(/^https?:\/\/(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .trim()
    .split('/').filter(Boolean).slice(0, 2).join('/')
}

function isValidRepoFormat(repo: string): boolean {
  const parts = repo.split('/')
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
}

export default function ChangelogSettingsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [githubRepo, setGithubRepo] = useState('')
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const presetColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Orange', value: '#f97316' },
  ]

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('changelogs')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

      if (!data) { router.push('/dashboard'); return }

      const changelog = data as unknown as Changelog
      setName(changelog.name)
      setDescription(changelog.description ?? '')
      setGithubRepo(changelog.github_repo ?? '')
      setAccentColor(changelog.accent_color ?? '#6366f1')
      setLogoUrl(changelog.logo_url ?? '')
      setLoading(false)
    }
    load()
  }, [id, router, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const repoTrimmed = githubRepo.trim()
    if (repoTrimmed) {
      const normalized = normalizeRepo(repoTrimmed)
      if (!isValidRepoFormat(normalized)) {
        setError('Invalid GitHub repository format. Use "owner/repo" (e.g. "vercel/next.js").')
        setSaving(false)
        return
      }
      try {
        const res = await fetch(`https://api.github.com/repos/${normalized}`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
        if (res.status === 404) {
          setError(`Repository "${normalized}" not found. Check the name or ensure it's public.`)
          setSaving(false)
          return
        }
        if (!res.ok) {
          setError(`Could not verify repository "${normalized}". Try again later.`)
          setSaving(false)
          return
        }
      } catch {
        setError('Could not reach GitHub to verify the repository. Check your connection.')
        setSaving(false)
        return
      }
    }

    const { error: updateError } = await supabase
      .from('changelogs')
      .update({
        name: name.trim(),
        description: description.trim() || null,
        github_repo: repoTrimmed ? normalizeRepo(repoTrimmed) : null,
        accent_color: accentColor || null,
        logo_url: logoUrl.trim() || null,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess('Settings saved.')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    )
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
            {name}
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">Settings</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Changelog Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this changelog for?"
              rows={3}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">GitHub repository</label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="owner/repo"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <p className="text-white/30 text-xs mt-1.5">
              Optional. Used to generate changelog entries from commits.
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Accent color</label>
            <div className="flex items-center gap-2 mb-2">
              {presetColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setAccentColor(c.value)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c.value,
                    borderColor: accentColor === c.value ? 'white' : 'transparent',
                    transform: accentColor === c.value ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={c.name}
                />
              ))}
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/20"
                title="Custom color"
              />
            </div>
            <p className="text-white/30 text-xs">
              Used for buttons, links, and highlights on your public page.
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            {logoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="text-white/30 text-xs">Preview</span>
              </div>
            )}
            <p className="text-white/30 text-xs mt-1.5">
              Optional. Displayed next to your changelog name.
            </p>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
          >
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
