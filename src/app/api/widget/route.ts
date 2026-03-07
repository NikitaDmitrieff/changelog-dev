import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = rateLimit(ip, 'widget', { maxRequests: 30, windowSeconds: 60 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter), 'Access-Control-Allow-Origin': '*' } }
    )
  }

  const slug = request.nextUrl.searchParams.get('project')
  if (!slug) {
    return NextResponse.json(
      { error: 'Missing ?project= parameter' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: changelog } = await supabase
    .from('changelogs')
    .select('id, name, slug, accent_color')
    .eq('slug', slug)
    .single()

  if (!changelog) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, content, version, tags, published_at, view_count')
    .eq('changelog_id', changelog.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  return NextResponse.json(
    {
      project: { name: changelog.name, slug: changelog.slug, accentColor: changelog.accent_color },
      entries: (entries ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        content: e.content,
        version: e.version,
        type: e.tags?.[0] ?? 'added',
        date: e.published_at,
        viewCount: e.view_count ?? 0,
      })),
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
