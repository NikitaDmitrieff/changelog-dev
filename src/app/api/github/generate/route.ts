import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database, Changelog } from '@/lib/supabase/types'
import { fetchRecentCommits } from '@/lib/github'
import { generateChangelogEntry } from '@/lib/generate'

export async function POST(request: NextRequest) {
  try {
    const { changelog_id } = await request.json()

    if (!changelog_id) {
      return NextResponse.json({ error: 'Missing changelog_id' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient<Database, 'changelog_dev'>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: { schema: 'changelog_dev' },
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

    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: changelogData } = await supabase
      .from('changelogs')
      .select('github_repo, owner_id')
      .eq('id', changelog_id)
      .eq('owner_id', user.id)
      .single()

    if (!changelogData) {
      return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })
    }

    const changelog = changelogData as Pick<Changelog, 'github_repo' | 'owner_id'>

    if (!changelog.github_repo) {
      return NextResponse.json({ error: 'No GitHub repo configured' }, { status: 400 })
    }

    // Fetch commits
    const commits = await fetchRecentCommits(changelog.github_repo)

    // Generate entry
    const entry = await generateChangelogEntry(commits)

    return NextResponse.json(entry, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
