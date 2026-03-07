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

import { PATCH } from '@/app/api/entries/[entryId]/route'

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/entries/e1', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const mockParams = Promise.resolve({ entryId: 'e1' })

describe('PATCH /api/entries/[entryId]', () => {
  let mockUpdate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'e1', title: 'Updated' },
            error: null,
          }),
        }),
      }),
    })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'e1', changelog_id: 'cl-1' },
                error: null,
              }),
            }),
          }),
          update: mockUpdate,
        }
      }
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'cl-1' },
                  error: null,
                }),
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
    const res = await PATCH(makeRequest({ title: 'Test' }), { params: mockParams })
    expect(res.status).toBe(401)
  })

  it('sets scheduled_for and keeps entry unpublished', async () => {
    const scheduleDate = '2026-04-01T10:00:00.000Z'
    const res = await PATCH(makeRequest({ scheduled_for: scheduleDate }), { params: mockParams })

    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        scheduled_for: scheduleDate,
        is_published: false,
        published_at: null,
      })
    )
  })

  it('clears scheduled_for when publishing', async () => {
    const res = await PATCH(makeRequest({ is_published: true }), { params: mockParams })

    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        is_published: true,
        scheduled_for: null,
      })
    )
  })

  it('clears scheduled_for when set to null', async () => {
    const res = await PATCH(makeRequest({ scheduled_for: null }), { params: mockParams })

    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        scheduled_for: null,
      })
    )
  })
})
