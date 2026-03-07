import { NextResponse, type NextRequest } from 'next/server'
import { validateApiKey, createAdminClient } from '@/lib/api-key'
import { rateLimit } from '@/lib/rate-limit'
import type { Database } from '@/lib/supabase/types'

type EntryInsert = Database['public']['Tables']['entries']['Insert']

/** GET /api/v1/entries — List changelog entries via API key */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rl = rateLimit(ip, 'v1-entries-get', { maxRequests: 60, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const auth = await validateApiKey(request.headers.get('authorization'))
    if (!auth) {
      return NextResponse.json(
        { error: 'Invalid or missing API key. Use Authorization: Bearer cldev_...' },
        { status: 401 }
      )
    }

    const admin = createAdminClient()
    const { searchParams } = new URL(request.url)

    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)
    const status = searchParams.get('status') // 'published' | 'draft' | null (all)

    let query = admin
      .from('entries')
      .select('*', { count: 'exact' })
      .eq('changelog_id', auth.changelog_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status === 'published') {
      query = query.eq('is_published', true)
    } else if (status === 'draft') {
      query = query.eq('is_published', false)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ entries: data, total: count, limit, offset })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/** POST /api/v1/entries — Create a changelog entry via API key */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP: 60 requests per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rl = rateLimit(ip, 'v1-entries', { maxRequests: 60, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    // Validate API key
    const auth = await validateApiKey(request.headers.get('authorization'))
    if (!auth) {
      return NextResponse.json(
        { error: 'Invalid or missing API key. Use Authorization: Bearer cldev_...' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    // Validate optional fields
    if (body.version !== undefined && typeof body.version !== 'string') {
      return NextResponse.json({ error: 'version must be a string' }, { status: 400 })
    }
    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags) || body.tags.some((t: unknown) => typeof t !== 'string')) {
        return NextResponse.json({ error: 'tags must be an array of strings' }, { status: 400 })
      }
    }
    if (body.is_published !== undefined && typeof body.is_published !== 'boolean') {
      return NextResponse.json({ error: 'is_published must be a boolean' }, { status: 400 })
    }

    const admin = createAdminClient()

    const isPublished = body.is_published ?? false

    const entry: EntryInsert = {
      changelog_id: auth.changelog_id,
      title: body.title.trim().slice(0, 200),
      content: body.content.trim(),
      version: body.version?.trim() || null,
      tags: body.tags ?? null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    }

    const { data, error } = await admin
      .from('entries')
      .insert(entry)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
