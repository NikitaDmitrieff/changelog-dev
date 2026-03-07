import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

let mockSingleResult: { data: unknown; error: unknown } = { data: null, error: null }
let mockUpdateResult: { error: unknown } = { error: null }

function createChain() {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.update = vi.fn(() => {
    // update chain ends with .eq(), not .single()
    const updateChain: Record<string, unknown> = {}
    updateChain.eq = vi.fn(() => Promise.resolve(mockUpdateResult))
    return updateChain
  })
  chain.eq = vi.fn(() => chain)
  chain.single = vi.fn(() => Promise.resolve(mockSingleResult))
  return chain
}

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => createChain()),
  })),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

import { GET } from '@/app/api/confirm/route'

function makeRequest(token?: string) {
  const url = token
    ? `http://localhost:3000/api/confirm?token=${token}`
    : 'http://localhost:3000/api/confirm'
  return new NextRequest(url)
}

describe('GET /api/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingleResult = { data: null, error: null }
    mockUpdateResult = { error: null }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('returns 400 for missing token', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(400)
    const text = await res.text()
    expect(text).toContain('Invalid Link')
  })

  it('returns 400 for invalid/unknown token', async () => {
    mockSingleResult = { data: null, error: { message: 'not found' } }

    const res = await GET(makeRequest('bad-token'))
    expect(res.status).toBe(400)
    const text = await res.text()
    expect(text).toContain('invalid')
  })

  it('returns already confirmed for confirmed subscriber', async () => {
    mockSingleResult = { data: { id: 's1', confirmed: true }, error: null }

    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('Already Confirmed')
  })

  it('confirms unconfirmed subscriber', async () => {
    mockSingleResult = { data: { id: 's1', confirmed: false }, error: null }
    mockUpdateResult = { error: null }

    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('Subscription Confirmed')
  })

  it('returns 500 on update error', async () => {
    mockSingleResult = { data: { id: 's1', confirmed: false }, error: null }
    mockUpdateResult = { error: { message: 'DB error' } }

    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).toContain('Something went wrong')
  })

  it('returns valid HTML with correct content type', async () => {
    const res = await GET(makeRequest())
    const text = await res.text()
    expect(text).toContain('<!DOCTYPE html>')
    expect(res.headers.get('Content-Type')).toBe('text/html')
  })
})
