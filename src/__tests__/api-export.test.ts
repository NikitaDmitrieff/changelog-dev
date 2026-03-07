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

import { GET } from '@/app/api/changelogs/[id]/export/route'

const mockParams = Promise.resolve({ id: 'cl-1' })

describe('GET /api/changelogs/[id]/export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('returns 401 for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/export')
    const res = await GET(req, { params: mockParams })
    expect(res.status).toBe(401)
  })

  it('returns 404 when changelog not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    }))

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/export')
    const res = await GET(req, { params: mockParams })
    expect(res.status).toBe(404)
  })

  it('returns markdown file with correct headers', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { name: 'My Product', slug: 'my-product' },
                  error: null,
                }),
              }),
            }),
          }),
        }
      }
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    title: 'v1.0 Release',
                    content: 'Initial release with core features.',
                    version: 'v1.0.0',
                    tags: ['feature', 'launch'],
                    is_published: true,
                    published_at: '2026-03-01T00:00:00.000Z',
                    created_at: '2026-03-01T00:00:00.000Z',
                  },
                  {
                    title: 'Draft entry',
                    content: 'Work in progress.',
                    version: null,
                    tags: null,
                    is_published: false,
                    published_at: null,
                    created_at: '2026-03-05T00:00:00.000Z',
                  },
                ],
                error: null,
              }),
            }),
          }),
        }
      }
      return {}
    })

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/export')
    const res = await GET(req, { params: mockParams })

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8')
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="my-product-changelog.md"')

    const body = await res.text()
    expect(body).toContain('# My Product')
    expect(body).toContain('## v1.0 Release (v1.0.0)')
    expect(body).toContain('Tags: feature, launch')
    expect(body).toContain('Initial release with core features.')
    expect(body).toContain('## Draft entry [DRAFT]')
    expect(body).toContain('Work in progress.')
  })

  it('returns JSON when format=json is specified', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { name: 'My Product', slug: 'my-product' },
                  error: null,
                }),
              }),
            }),
          }),
        }
      }
      if (table === 'entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    title: 'v1.0 Release',
                    content: 'Initial release.',
                    version: 'v1.0.0',
                    tags: ['feature'],
                    is_published: true,
                    published_at: '2026-03-01T00:00:00.000Z',
                    created_at: '2026-03-01T00:00:00.000Z',
                  },
                ],
                error: null,
              }),
            }),
          }),
        }
      }
      return {}
    })

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/export?format=json')
    const res = await GET(req, { params: mockParams })

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json; charset=utf-8')
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="my-product-changelog.json"')

    const body = await res.json()
    expect(body.name).toBe('My Product')
    expect(body.slug).toBe('my-product')
    expect(body.exported_at).toBeDefined()
    expect(body.entries).toHaveLength(1)
    expect(body.entries[0].title).toBe('v1.0 Release')
    expect(body.entries[0].version).toBe('v1.0.0')
    expect(body.entries[0].tags).toEqual(['feature'])
  })
})
