import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

let mockDeleteResult: { error: unknown } = { error: null }

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => {
      const chain: Record<string, unknown> = {}
      chain.delete = vi.fn(() => chain)
      chain.eq = vi.fn(() => {
        // Return a thenable that resolves to the result
        // (the last .eq() in the chain is awaited)
        return {
          eq: vi.fn(() => Promise.resolve(mockDeleteResult)),
        }
      })
      return chain
    }),
  })),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

import { GET } from '@/app/api/unsubscribe/route'

function makeRequest(params: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/unsubscribe')
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  return new NextRequest(url.toString())
}

describe('GET /api/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDeleteResult = { error: null }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('returns 400 when token is missing', async () => {
    const res = await GET(makeRequest({ changelog: 'cl-1' }))
    expect(res.status).toBe(400)
    const text = await res.text()
    expect(text).toContain('Invalid Link')
  })

  it('returns 400 when changelog is missing', async () => {
    const res = await GET(makeRequest({ token: 'tok-1' }))
    expect(res.status).toBe(400)
  })

  it('successfully unsubscribes with valid params', async () => {
    mockDeleteResult = { error: null }

    const res = await GET(makeRequest({ token: 'tok-1', changelog: 'cl-1' }))
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('unsubscribed')
  })

  it('returns 500 on database error', async () => {
    mockDeleteResult = { error: { message: 'DB error' } }

    const res = await GET(makeRequest({ token: 'tok-1', changelog: 'cl-1' }))
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).toContain('Something went wrong')
  })
})
