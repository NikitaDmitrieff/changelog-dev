'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
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

export default function NewChangelogPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [githubRepo, setGithubRepo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(value: string) {
    setName(value)
    setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const repoTrimmed = githubRepo.trim()
    if (repoTrimmed) {
      const normalized = normalizeRepo(repoTrimmed)
      if (!isValidRepoFormat(normalized)) {
        setError('Invalid GitHub repository format. Use "owner/repo" (e.g. "vercel/next.js").')
        setLoading(false)
        return
      }
      // Verify repo exists via GitHub API
      try {
        const res = await fetch(`https://api.github.com/repos/${normalized}`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
        if (res.status === 404) {
          setError(`Repository "${normalized}" not found. Check the name or ensure it's public.`)
          setLoading(false)
          return
        }
        if (!res.ok) {
          setError(`Could not verify repository "${normalized}". Try again later.`)
          setLoading(false)
          return
        }
      } catch {
        setError('Could not reach GitHub to verify the repository. Check your connection.')
        setLoading(false)
        return
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Enforce changelog limit for free plan (1 changelog)
    const isPro = !!(user.user_metadata?.is_pro)
    if (!isPro) {
      const { count } = await supabase
        .from('changelogs')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      if ((count ?? 0) >= 1) {
        setError('Free plan allows 1 changelog. Upgrade to Pro for unlimited changelogs.')
        setLoading(false)
        return
      }
    }

    const { data, error } = await supabase
      .from('changelogs')
      .insert({
        owner_id: user.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        github_repo: repoTrimmed ? normalizeRepo(repoTrimmed) : null,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const created = data as unknown as { id: string }
    router.push(`/dashboard/${created.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm">New changelog</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Create a changelog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My Product"
              required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
              <span className="px-4 py-3 text-white/30 text-sm border-r border-white/[0.06] whitespace-nowrap">
                changelog.dev/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="my-product"
                required
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/30 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this changelog for?"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              GitHub repository
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="owner/repo"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
            <p className="text-white/30 text-xs mt-1.5">
              Optional. Used to generate changelog entries from commits.
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-medium py-3 rounded-full transition-colors text-sm"
          >
            {loading ? 'Creating...' : 'Create changelog'}
          </button>
        </form>
      </div>
    </div>
  )
}
