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

async function verifyEntryOwnership(
  supabase: Awaited<ReturnType<typeof getSupabaseAndUser>>['supabase'],
  entryId: string,
  userId: string
) {
  const { data: entry } = await supabase
    .from('entries')
    .select('id, changelog_id')
    .eq('id', entryId)
    .single()

  if (!entry) return null

  const { data: changelog } = await supabase
    .from('changelogs')
    .select('id')
    .eq('id', entry.changelog_id)
    .eq('owner_id', userId)
    .single()

  if (!changelog) return null

  return entry
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params
    const { supabase, user } = await getSupabaseAndUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entry = await verifyEntryOwnership(supabase, entryId, user.id)
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if (body.title !== undefined) updates.title = body.title
    if (body.content !== undefined) updates.content = body.content
    if (body.version !== undefined) updates.version = body.version || null
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.is_pinned !== undefined) {
      updates.is_pinned = body.is_pinned
      // If pinning this entry, unpin all other entries in the same changelog
      if (body.is_pinned) {
        await supabase
          .from('entries')
          .update({ is_pinned: false })
          .eq('changelog_id', entry.changelog_id)
          .neq('id', entryId)
      }
    }
    if (body.scheduled_for !== undefined) {
      if (body.scheduled_for) {
        updates.scheduled_for = body.scheduled_for
        updates.is_published = false
        updates.published_at = null
      } else {
        updates.scheduled_for = null
      }
    }
    if (body.is_published !== undefined) {
      updates.is_published = body.is_published
      if (body.is_published) {
        updates.published_at = body.published_at || new Date().toISOString()
        updates.scheduled_for = null
      } else {
        updates.published_at = null
      }
    }

    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params
    const { supabase, user } = await getSupabaseAndUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entry = await verifyEntryOwnership(supabase, entryId, user.id)
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', entryId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
