import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { generateApiKey, hashApiKey } from '@/lib/api-key'

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

/** GET /api/api-keys?changelog_id=<id> — List active API keys for a changelog */
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const changelogId = request.nextUrl.searchParams.get('changelog_id')
    if (!changelogId) return NextResponse.json({ error: 'changelog_id required' }, { status: 400 })

    // Verify ownership
    const { data: changelog } = await supabase
      .from('changelogs')
      .select('id')
      .eq('id', changelogId)
      .eq('owner_id', user.id)
      .single()

    if (!changelog) return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })

    const { data: keys } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, last_used_at, created_at')
      .eq('changelog_id', changelogId)
      .is('revoked_at', null)
      .order('created_at', { ascending: false })

    return NextResponse.json(keys ?? [])
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/** POST /api/api-keys — Generate a new API key */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { changelog_id, name } = body

    if (!changelog_id) return NextResponse.json({ error: 'changelog_id required' }, { status: 400 })

    // Verify ownership
    const { data: changelog } = await supabase
      .from('changelogs')
      .select('id')
      .eq('id', changelog_id)
      .eq('owner_id', user.id)
      .single()

    if (!changelog) return NextResponse.json({ error: 'Changelog not found' }, { status: 404 })

    // Limit to 5 active keys per changelog
    const { count } = await supabase
      .from('api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('changelog_id', changelog_id)
      .is('revoked_at', null)

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: 'Maximum 5 API keys per changelog' }, { status: 400 })
    }

    const rawKey = generateApiKey()
    const keyHash = await hashApiKey(rawKey)
    const keyPrefix = rawKey.slice(0, 12) + '...'

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        changelog_id,
        owner_id: user.id,
        name: (name || 'Default').slice(0, 50),
        key_hash: keyHash,
        key_prefix: keyPrefix,
      })
      .select('id, name, key_prefix, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Return the raw key ONCE — it will never be shown again
    return NextResponse.json({ ...data, key: rawKey })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/** DELETE /api/api-keys — Revoke an API key */
export async function DELETE(request: NextRequest) {
  try {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', id)
      .eq('owner_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
