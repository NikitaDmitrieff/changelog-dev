import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Build a chainable mock that tracks calls
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

const mockSendEntryNotifications = vi.fn()
vi.mock('@/lib/email', () => ({
  sendEntryNotifications: (...args: unknown[]) => mockSendEntryNotifications(...args),
}))

import { POST } from '@/app/api/notify-subscribers/route'

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/notify-subscribers', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/notify-subscribers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    mockSendEntryNotifications.mockResolvedValue({ sent: 0, failed: 0, failures: [] })
  })

  it('returns 400 for missing required fields', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 401 for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await POST(makeRequest({
      changelog_id: 'cl-1',
      entry_title: 'Test',
    }))
    expect(res.status).toBe(401)
  })

  it('returns 403 when user does not own changelog', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    // changelogs query returns a different owner
    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'cl-1', name: 'Test', slug: 'test', owner_id: 'other-user' },
                error: null,
              }),
            }),
          }),
        }
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const res = await POST(makeRequest({
      changelog_id: 'cl-1',
      entry_title: 'Test',
    }))
    expect(res.status).toBe(403)
  })

  it('returns already_notified when entry was already notified', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let callCount = 0
    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'cl-1', name: 'Test', slug: 'test', owner_id: 'user-1' },
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'e1', notified_at: '2026-01-01T00:00:00Z' },
                  error: null,
                }),
              }),
            }),
          }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() }
    })

    const res = await POST(makeRequest({
      changelog_id: 'cl-1',
      entry_id: 'e1',
      entry_title: 'Test',
    }))
    const data = await res.json()
    expect(data.already_notified).toBe(true)
    expect(data.sent).toBe(0)
  })

  it('sends notifications to confirmed subscribers', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSendEntryNotifications.mockResolvedValue({ sent: 3, failed: 0, failures: [] })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'cl-1', name: 'Test', slug: 'test', owner_id: 'user-1' },
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'e1', notified_at: null },
                  error: null,
                }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }
      }
      if (table === 'subscribers') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  { id: 's1', email: 'a@test.com', unsubscribe_token: 'tok-a' },
                  { id: 's2', email: 'b@test.com', unsubscribe_token: 'tok-b' },
                  { id: 's3', email: 'c@test.com', unsubscribe_token: 'tok-c' },
                ],
                error: null,
              }),
            }),
          }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() }
    })

    const res = await POST(makeRequest({
      changelog_id: 'cl-1',
      entry_id: 'e1',
      entry_title: 'v2.0 Release',
      entry_content: 'Big update!',
    }))
    const data = await res.json()
    expect(data.sent).toBe(3)
    expect(data.failed).toBe(0)
    expect(mockSendEntryNotifications).toHaveBeenCalledOnce()
  })

  it('returns zero counts when no subscribers', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'cl-1', name: 'Test', slug: 'test', owner_id: 'user-1' },
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'subscribers') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() }
    })

    const res = await POST(makeRequest({
      changelog_id: 'cl-1',
      entry_title: 'Test',
    }))
    const data = await res.json()
    expect(data.sent).toBe(0)
    expect(data.message).toContain('No subscribers')
  })
})
