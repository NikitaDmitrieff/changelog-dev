import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

/**
 * Create an admin Supabase client that bypasses RLS (uses service role key).
 * Used for API key validation where there's no user session.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Hash an API key using the Web Crypto API (SHA-256).
 */
export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a new API key: cldev_<32 random hex chars>
 */
export function generateApiKey(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `cldev_${hex}`
}

/**
 * Validate an API key from the Authorization header.
 * Returns the changelog_id if valid, null otherwise.
 * Also updates last_used_at.
 */
export async function validateApiKey(
  authHeader: string | null
): Promise<{ changelog_id: string; owner_id: string } | null> {
  if (!authHeader?.startsWith('Bearer ')) return null

  const key = authHeader.slice(7)
  if (!key.startsWith('cldev_')) return null

  const keyHash = await hashApiKey(key)
  const admin = createAdminClient()

  const { data } = await admin
    .from('api_keys')
    .select('id, changelog_id, owner_id')
    .eq('key_hash', keyHash)
    .is('revoked_at', null)
    .single()

  if (!data) return null

  // Update last_used_at (fire and forget)
  admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then(() => {})

  return { changelog_id: data.changelog_id, owner_id: data.owner_id }
}
