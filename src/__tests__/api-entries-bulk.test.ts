import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockFrom = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
  })),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

import { POST } from '@/app/api/entries/bulk/route'

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/entries/bulk', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/entries/bulk', () => {
  let mockUpdate: ReturnType<typeof vi.fn>
  let mockDelete: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockUpdate = vi.fn().mockReturnValue({
      in: vi.fn().mockResolvedValue({ error: null }),
    })
    mockDelete = vi.fn().mockReturnValue({
      in: vi.fn().mockResolvedValue({ error: null }),
    })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [
                { id: 'e1', changelog_id: 'cl-1' },
                { id: 'e2', changelog_id: 'cl-1' },
              ],
            }),
          }),
          update: mockUpdate,
          delete: mockDelete,
        }
      }
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ id: 'cl-1' }],
              }),
            }),
          }),
        }
      }
      return {}
    })
  })

  it('returns 401 for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeRequest({ entry_ids: ['e1'], action: 'publish' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for empty entry_ids', async () => {
    const res = await POST(makeRequest({ entry_ids: [], action: 'publish' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('non-empty array')
  })

  it('returns 400 for missing entry_ids', async () => {
    const res = await POST(makeRequest({ action: 'publish' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid action', async () => {
    const res = await POST(makeRequest({ entry_ids: ['e1'], action: 'nuke' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('action must be')
  })

  it('returns 400 for too many entry_ids', async () => {
    const ids = Array.from({ length: 101 }, (_, i) => `e${i}`)
    const res = await POST(makeRequest({ entry_ids: ids, action: 'publish' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Maximum 100')
  })

  it('returns 403 when entries belong to another user', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [{ id: 'e1', changelog_id: 'cl-1' }],
            }),
          }),
        }
      }
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [], // No owned changelogs
              }),
            }),
          }),
        }
      }
      return {}
    })

    const res = await POST(makeRequest({ entry_ids: ['e1'], action: 'publish' }))
    expect(res.status).toBe(403)
  })

  it('publishes entries in bulk', async () => {
    const res = await POST(makeRequest({ entry_ids: ['e1', 'e2'], action: 'publish' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.updated).toBe(2)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        is_published: true,
        scheduled_for: null,
      })
    )
  })

  it('unpublishes entries in bulk', async () => {
    const res = await POST(makeRequest({ entry_ids: ['e1', 'e2'], action: 'unpublish' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.updated).toBe(2)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        is_published: false,
        published_at: null,
      })
    )
  })

  it('deletes entries in bulk', async () => {
    const res = await POST(makeRequest({ entry_ids: ['e1', 'e2'], action: 'delete' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.deleted).toBe(2)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('returns 404 when no entries found', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: [] }),
          }),
        }
      }
      return {}
    })

    const res = await POST(makeRequest({ entry_ids: ['nonexistent'], action: 'publish' }))
    expect(res.status).toBe(404)
  })
})
