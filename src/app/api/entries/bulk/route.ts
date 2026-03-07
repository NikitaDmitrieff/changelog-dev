import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

async function getSupabaseAndUser() {
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
  return { supabase, user }
}

type BulkAction = 'publish' | 'unpublish' | 'delete'

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getSupabaseAndUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { entry_ids, action } = body as { entry_ids: string[]; action: BulkAction }

    if (!Array.isArray(entry_ids) || entry_ids.length === 0) {
      return NextResponse.json({ error: 'entry_ids must be a non-empty array' }, { status: 400 })
    }

    if (!['publish', 'unpublish', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'action must be publish, unpublish, or delete' }, { status: 400 })
    }

    if (entry_ids.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 entries per bulk operation' }, { status: 400 })
    }

    // Verify ownership: get all entries and check they belong to changelogs owned by this user
    const { data: entries } = await supabase
      .from('entries')
      .select('id, changelog_id')
      .in('id', entry_ids)

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'No entries found' }, { status: 404 })
    }

    // Get unique changelog IDs and verify ownership
    const changelogIds = [...new Set(entries.map(e => e.changelog_id))]
    const { data: ownedChangelogs } = await supabase
      .from('changelogs')
      .select('id')
      .in('id', changelogIds)
      .eq('owner_id', user.id)

    if (!ownedChangelogs || ownedChangelogs.length !== changelogIds.length) {
      return NextResponse.json({ error: 'Unauthorized: some entries do not belong to you' }, { status: 403 })
    }

    const ownedEntryIds = entries.map(e => e.id)

    if (action === 'delete') {
      const { error } = await supabase
        .from('entries')
        .delete()
        .in('id', ownedEntryIds)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, deleted: ownedEntryIds.length })
    }

    if (action === 'publish') {
      const { error } = await supabase
        .from('entries')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          scheduled_for: null,
        })
        .in('id', ownedEntryIds)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, updated: ownedEntryIds.length })
    }

    if (action === 'unpublish') {
      const { error } = await supabase
        .from('entries')
        .update({
          is_published: false,
          published_at: null,
        })
        .in('id', ownedEntryIds)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, updated: ownedEntryIds.length })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
