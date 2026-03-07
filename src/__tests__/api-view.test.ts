import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}))

import { POST } from '@/app/api/entries/[entryId]/view/route'

describe('POST /api/entries/[entryId]/view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('increments view count via RPC', async () => {
    mockRpc.mockResolvedValue({ error: null })

    const req = new NextRequest('http://localhost/api/entries/abc123/view', { method: 'POST' })
    const res = await POST(req, { params: Promise.resolve({ entryId: 'abc123' }) })

    expect(res.status).toBe(200)
    expect(mockRpc).toHaveBeenCalledWith('increment_view_count', { entry_id: 'abc123' })
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('returns 500 on RPC error', async () => {
    mockRpc.mockResolvedValue({ error: { message: 'RPC failed' } })

    const req = new NextRequest('http://localhost/api/entries/abc123/view', { method: 'POST' })
    const res = await POST(req, { params: Promise.resolve({ entryId: 'abc123' }) })

    expect(res.status).toBe(500)
  })

  it('returns 400 for empty entry ID', async () => {
    const req = new NextRequest('http://localhost/api/entries//view', { method: 'POST' })
    const res = await POST(req, { params: Promise.resolve({ entryId: '' }) })

    expect(res.status).toBe(400)
  })
})
