import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

interface ImportEntry {
  title: string
  content: string
  version?: string | null
  tags?: string[] | null
  is_published?: boolean
  published_at?: string | null
  created_at?: string | null
}

function parseMarkdown(text: string): { entries: ImportEntry[] } {
  const lines = text.split('\n')
  const entries: ImportEntry[] = []
  let current: ImportEntry | null = null

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    if (h2Match) {
      if (current) entries.push(current)
      let title = h2Match[1].trim()
      const isDraft = title.includes('[DRAFT]')
      title = title.replace(/\s*\[DRAFT\]\s*/, '').trim()

      let version: string | null = null
      const versionMatch = title.match(/\(([^)]+)\)\s*$/)
      if (versionMatch) {
        version = versionMatch[1]
        title = title.replace(/\s*\([^)]+\)\s*$/, '').trim()
      }

      current = {
        title,
        content: '',
        version,
        is_published: !isDraft,
      }
      continue
    }

    if (!current) continue

    if (line.startsWith('Tags: ')) {
      current.tags = line.replace('Tags: ', '').split(',').map((t) => t.trim()).filter(Boolean)
      continue
    }

    const dateMatch = line.match(/^\*(\d{4}-\d{2}-\d{2})\*$/)
    if (dateMatch) {
      current.published_at = new Date(dateMatch[1]).toISOString()
      continue
    }

    if (line.trim() === '---') continue

    current.content += (current.content ? '\n' : '') + line
  }

  if (current) entries.push(current)

  for (const entry of entries) {
    entry.content = entry.content.trim()
  }

  return { entries }
}

function parseJson(text: string): { entries: ImportEntry[] } {
  const data = JSON.parse(text)
  if (Array.isArray(data)) {
    return { entries: data }
  }
  if (data.entries && Array.isArray(data.entries)) {
    return { entries: data.entries }
  }
  throw new Error('Invalid JSON format: expected { entries: [...] } or an array of entries')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: changelog } = await supabase
      .from('changelogs')
      .select('id')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (!changelog) {
      return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') ?? ''
    let body: string

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      body = await file.text()
    } else {
      body = await request.text()
    }

    if (!body.trim()) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    }

    let parsed: { entries: ImportEntry[] }

    const format = request.nextUrl.searchParams.get('format')
    if (format === 'json' || (!format && body.trim().startsWith('{'))) {
      parsed = parseJson(body)
    } else {
      parsed = parseMarkdown(body)
    }

    if (parsed.entries.length === 0) {
      return NextResponse.json({ error: 'No entries found in file' }, { status: 400 })
    }

    const rows = parsed.entries.map((entry) => ({
      changelog_id: id,
      title: entry.title,
      content: entry.content,
      version: entry.version ?? null,
      tags: entry.tags ?? null,
      is_published: entry.is_published ?? false,
      published_at: entry.is_published ? (entry.published_at ?? new Date().toISOString()) : null,
    }))

    const { data: inserted, error } = await supabase
      .from('entries')
      .insert(rows)
      .select('id')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      imported: inserted?.length ?? 0,
      message: `Successfully imported ${inserted?.length ?? 0} entries`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
