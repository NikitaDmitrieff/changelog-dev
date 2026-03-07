import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: changelog } = await supabase
      .from('changelogs')
      .select('name, slug')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (!changelog) {
      return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })
    }

    const { data: entries } = await supabase
      .from('entries')
      .select('title, content, version, tags, is_published, published_at, created_at')
      .eq('changelog_id', id)
      .order('published_at', { ascending: false, nullsFirst: false })

    const lines: string[] = [
      `# ${changelog.name}`,
      '',
    ]

    for (const entry of entries ?? []) {
      const date = entry.published_at || entry.created_at
      const dateStr = new Date(date).toISOString().split('T')[0]
      const status = entry.is_published ? '' : ' [DRAFT]'
      const version = entry.version ? ` (${entry.version})` : ''

      lines.push(`## ${entry.title}${version}${status}`)
      lines.push(`*${dateStr}*`)
      if (entry.tags && entry.tags.length > 0) {
        lines.push(`Tags: ${entry.tags.join(', ')}`)
      }
      lines.push('')
      lines.push(entry.content)
      lines.push('')
      lines.push('---')
      lines.push('')
    }

    const markdown = lines.join('\n')
    const filename = `${changelog.slug}-changelog.md`

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
