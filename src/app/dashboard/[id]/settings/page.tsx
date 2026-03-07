'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { Changelog } from '@/lib/supabase/types'

interface ApiKeyDisplay {
  id: string
  name: string
  key_prefix: string
  last_used_at: string | null
  created_at: string
}

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
  const [slug, setSlug] = useState('')
  const [snippetCopied, setSnippetCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyDisplay[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [creatingKey, setCreatingKey] = useState(false)
  const [newKeySecret, setNewKeySecret] = useState('')
  const [keyCopied, setKeyCopied] = useState(false)

  const presetColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Orange', value: '#f97316' },
  ]

  const loadApiKeys = useCallback(async () => {
    const res = await fetch(`/api/api-keys?changelog_id=${id}`)
    if (res.ok) setApiKeys(await res.json())
  }, [id])

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
      setSlug(changelog.slug ?? '')
      setLoading(false)
      loadApiKeys()
    }
    load()
  }, [id, router, supabase, loadApiKeys])

  async function handleCreateKey() {
    setCreatingKey(true)
    setNewKeySecret('')
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changelog_id: id, name: newKeyName || 'Default' }),
    })
    if (res.ok) {
      const data = await res.json()
      setNewKeySecret(data.key)
      setNewKeyName('')
      loadApiKeys()
    }
    setCreatingKey(false)
  }

  async function handleRevokeKey(keyId: string) {
    await fetch('/api/api-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: keyId }),
    })
    loadApiKeys()
    if (newKeySecret) setNewKeySecret('')
  }

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

        {slug && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-2">Embed Widget</h2>
            <p className="text-white/40 text-sm mb-4">
              Add this snippet to your website to show a changelog widget to your users.
            </p>
            <div className="relative">
              <pre className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
{`<script src="https://unpkg.com/changelogdev-widget@0.3.0/dist/index.iife.js"></script>
<changelog-widget project-id="${slug}"${accentColor !== '#6366f1' ? ` accent-color="${accentColor}"` : ''}></changelog-widget>`}
              </pre>
              <button
                type="button"
                onClick={() => {
                  const snippet = `<script src="https://unpkg.com/changelogdev-widget@0.3.0/dist/index.iife.js"></script>\n<changelog-widget project-id="${slug}"${accentColor !== '#6366f1' ? ` accent-color="${accentColor}"` : ''}></changelog-widget>`
                  navigator.clipboard.writeText(snippet)
                  setSnippetCopied(true)
                  setTimeout(() => setSnippetCopied(false), 2000)
                }}
                className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs text-white/60 hover:text-white transition-colors"
              >
                {snippetCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-white/30 text-xs mt-2">
              The widget auto-applies your accent color. Place it before {'</body>'} in your HTML.
            </p>
          </div>
        )}

        {/* API Keys */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-lg font-semibold mb-2">API Keys</h2>
          <p className="text-white/40 text-sm mb-4">
            Use API keys to create changelog entries programmatically from CI/CD pipelines or scripts.
          </p>

          {/* New key revealed */}
          {newKeySecret && (
            <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm font-medium mb-2">
                Copy your API key now — it won&apos;t be shown again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/30 px-3 py-2 rounded text-sm text-green-300 font-mono break-all">
                  {newKeySecret}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(newKeySecret)
                    setKeyCopied(true)
                    setTimeout(() => setKeyCopied(false), 2000)
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs text-white/60 hover:text-white transition-colors shrink-0"
                >
                  {keyCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Create key */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. CI/CD)"
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <button
              type="button"
              onClick={handleCreateKey}
              disabled={creatingKey}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0"
            >
              {creatingKey ? 'Creating...' : 'Generate key'}
            </button>
          </div>

          {/* Key list */}
          {apiKeys.length > 0 ? (
            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <div>
                    <span className="text-sm text-white">{k.name}</span>
                    <span className="text-white/30 text-xs ml-3 font-mono">{k.key_prefix}</span>
                    {k.last_used_at && (
                      <span className="text-white/20 text-xs ml-3">
                        Last used {new Date(k.last_used_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevokeKey(k.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-sm">No API keys yet.</p>
          )}

          {/* Usage example */}
          <div className="mt-6">
            <p className="text-white/40 text-xs mb-2">Example usage:</p>
            <pre className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs text-white/50 overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X POST https://www.changelogdev.com/api/v1/entries \\
  -H "Authorization: Bearer cldev_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "v1.2.0", "content": "Bug fixes and improvements", "version": "1.2.0", "tags": ["improvement"], "is_published": true}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
