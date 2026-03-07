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

vi.mock('@/lib/api-key', () => ({
  generateApiKey: vi.fn(() => 'cldev_abc123def456'),
  hashApiKey: vi.fn(async () => 'hashed_key_value'),
}))

import { GET, POST, DELETE } from '@/app/api/api-keys/route'

describe('API Keys endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  describe('GET /api/api-keys', () => {
    it('returns 401 for unauthenticated user', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })
      const req = new NextRequest('http://localhost:3000/api/api-keys?changelog_id=cl-1')
      const res = await GET(req)
      expect(res.status).toBe(401)
    })

    it('returns 400 without changelog_id', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      const req = new NextRequest('http://localhost:3000/api/api-keys')
      const res = await GET(req)
      expect(res.status).toBe(400)
    })

    it('returns 404 when changelog not owned', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockFrom.mockImplementation((table: string) => {
        if (table === 'changelogs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }
        }
        return {}
      })
      const req = new NextRequest('http://localhost:3000/api/api-keys?changelog_id=cl-1')
      const res = await GET(req)
      expect(res.status).toBe(404)
    })

    it('returns keys for valid changelog', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      const mockKeys = [{ id: 'k-1', name: 'CI', key_prefix: 'cldev_abc1...', created_at: '2026-01-01' }]
      mockFrom.mockImplementation((table: string) => {
        if (table === 'changelogs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'cl-1' }, error: null }),
                }),
              }),
            }),
          }
        }
        if (table === 'api_keys') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({ data: mockKeys, error: null }),
                }),
              }),
            }),
          }
        }
        return {}
      })
      const req = new NextRequest('http://localhost:3000/api/api-keys?changelog_id=cl-1')
      const res = await GET(req)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual(mockKeys)
    })
  })

  describe('POST /api/api-keys', () => {
    it('returns 401 for unauthenticated user', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })
      const req = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({ changelog_id: 'cl-1' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('creates key and returns raw key once', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockFrom.mockImplementation((table: string) => {
        if (table === 'changelogs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'cl-1' }, error: null }),
                }),
              }),
            }),
          }
        }
        if (table === 'api_keys') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  // count query
                  ...{ count: 0, data: null, error: null },
                }),
              }),
              // for count query (head: true)
              count: 0,
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'k-1', name: 'CI', key_prefix: 'cldev_abc123...', created_at: '2026-01-01' },
                  error: null,
                }),
              }),
            }),
          }
        }
        return {}
      })
      const req = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({ changelog_id: 'cl-1', name: 'CI' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const res = await POST(req)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.key).toBe('cldev_abc123def456')
      expect(body.name).toBe('CI')
    })
  })

  describe('DELETE /api/api-keys', () => {
    it('revokes a key', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockFrom.mockImplementation(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }))
      const req = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'k-1' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const res = await DELETE(req)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
    })
  })
})
