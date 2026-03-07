import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockFrom = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    from: mockFrom,
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

import { POST } from '@/app/api/cron/publish-scheduled/route'

function makeRequest(headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost:3000/api/cron/publish-scheduled', {
    method: 'POST',
    headers,
  })
}

describe('POST /api/cron/publish-scheduled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    delete process.env.CRON_SECRET
    mockSendEntryNotifications.mockResolvedValue({ sent: 0, failed: 0, failures: [] })
  })

  it('returns 401 when CRON_SECRET is set and auth header is wrong', async () => {
    process.env.CRON_SECRET = 'my-secret'
    const res = await POST(makeRequest({ authorization: 'Bearer wrong' }))
    expect(res.status).toBe(401)
  })

  it('returns published: 0 when no entries are scheduled', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            }),
          }),
        }
      }
      return {}
    })

    const res = await POST(makeRequest())
    const data = await res.json()
    expect(data.published).toBe(0)
  })

  it('publishes a scheduled entry and sends notifications', async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })

    const mockUpsert = vi.fn().mockResolvedValue({ error: null })

    mockSendEntryNotifications.mockResolvedValue({ sent: 2, failed: 0, failures: [] })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [{
                      id: 'e1',
                      changelog_id: 'cl-1',
                      title: 'Scheduled Post',
                      content: 'Hello world',
                      scheduled_for: '2026-03-07T00:00:00Z',
                    }],
                    error: null,
                  }),
                }),
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
              single: vi.fn().mockResolvedValue({
                data: { id: 'cl-1', name: 'My Changelog', slug: 'my-changelog' },
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
              eq: vi.fn().mockResolvedValue({
                data: [
                  { id: 's1', email: 'a@test.com', unsubscribe_token: 'tok-a' },
                  { id: 's2', email: 'b@test.com', unsubscribe_token: 'tok-b' },
                ],
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'notification_failures') {
        return { upsert: mockUpsert }
      }
      return {}
    })

    const res = await POST(makeRequest())
    const data = await res.json()
    expect(data.published).toBe(1)
    expect(mockUpdate).toHaveBeenCalled()
    expect(mockSendEntryNotifications).toHaveBeenCalledOnce()
  })

  it('authenticates with valid CRON_SECRET', async () => {
    process.env.CRON_SECRET = 'my-secret'

    mockFrom.mockImplementation((table: string) => {
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            }),
          }),
        }
      }
      return {}
    })

    const res = await POST(makeRequest({ authorization: 'Bearer my-secret' }))
    expect(res.status).toBe(200)
  })
})
