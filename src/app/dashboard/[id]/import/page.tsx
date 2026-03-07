'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default function ImportPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ imported: number; message: string } | null>(null)

  async function handleImport() {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const format = file.name.endsWith('.json') ? 'json' : 'markdown'
      const res = await fetch(`/api/changelogs/${id}/import?format=${format}`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    }
    setLoading(false)
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
          <span className="text-sm">Import</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Import entries</h1>
        <p className="text-white/50 text-sm mb-8">
          Upload a Markdown or JSON file to import entries into this changelog.
        </p>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="import-file"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl hover:border-white/30 transition-colors cursor-pointer bg-white/[0.02]"
            >
              {file ? (
                <div className="text-center">
                  <div className="text-sm font-medium text-white">{file.name}</div>
                  <div className="text-xs text-white/40 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-white/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <div className="text-sm text-white/40">Drop a file or click to browse</div>
                  <div className="text-xs text-white/20 mt-1">.md or .json</div>
                </div>
              )}
              <input
                id="import-file"
                type="file"
                accept=".md,.json,.txt"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null)
                  setResult(null)
                  setError('')
                }}
              />
            </label>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-sm text-white/50 space-y-2">
            <div className="font-medium text-white/70">Supported formats</div>
            <div><strong className="text-white/60">Markdown:</strong> Follows the export format -- H2 headings as entry titles, optional (version) and [DRAFT] markers.</div>
            <div><strong className="text-white/60">JSON:</strong> Object with an <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">entries</code> array, or a plain array. Each entry needs <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">title</code> and <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">content</code>.</div>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          {result && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 text-sm text-green-300">
              {result.message}
              <div className="mt-2">
                <Link href={`/dashboard/${id}`} className="text-green-400 hover:text-green-300 underline">
                  View changelog
                </Link>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/dashboard/${id}`}
              className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Cancel
            </Link>
            <button
              onClick={handleImport}
              disabled={loading || !file}
              className="flex-1 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-medium py-3 rounded-full transition-colors text-sm"
            >
              {loading ? 'Importing...' : 'Import entries'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
