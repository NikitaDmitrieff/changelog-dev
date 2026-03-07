import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockFrom = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => mockFrom(...args),
    auth: { getUser: () => mockGetUser() },
  }),
}))

import { POST } from '@/app/api/changelogs/[id]/import/route'

const mockParams = Promise.resolve({ id: 'cl-1' })

function mockChangelogFound() {
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

function mockInsertSuccess(count: number) {
  return {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: Array.from({ length: count }, (_, i) => ({ id: `entry-${i}` })),
        error: null,
      }),
    }),
  }
}

describe('POST /api/changelogs/[id]/import', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/import', {
      method: 'POST',
      body: 'test',
    })
    const res = await POST(req, { params: mockParams })
    expect(res.status).toBe(401)
  })

  it('returns 404 for non-existent changelog', async () => {
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

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/import', {
      method: 'POST',
      body: 'test',
    })
    const res = await POST(req, { params: mockParams })
    expect(res.status).toBe(404)
  })

  it('imports entries from markdown', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const callOrder: string[] = []
    mockFrom.mockImplementation((table: string) => {
      callOrder.push(table)
      if (table === 'changelogs') return mockChangelogFound()
      if (table === 'entries') return mockInsertSuccess(2)
      return {}
    })

    const markdown = `# My Product

## v1.0 Release (v1.0.0)
*2026-03-01*
Tags: feature, launch

Initial release.

---

## Draft entry [DRAFT]
*2026-03-05*

Work in progress.

---
`

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/import?format=markdown', {
      method: 'POST',
      body: markdown,
    })
    const res = await POST(req, { params: mockParams })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.imported).toBe(2)
  })

  it('imports entries from JSON', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') return mockChangelogFound()
      if (table === 'entries') return mockInsertSuccess(1)
      return {}
    })

    const json = JSON.stringify({
      entries: [
        { title: 'Test Entry', content: 'Some content', version: '1.0.0', tags: ['feature'], is_published: true },
      ],
    })

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/import?format=json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
    const res = await POST(req, { params: mockParams })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.imported).toBe(1)
  })

  it('returns 400 for empty file', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockImplementation((table: string) => {
      if (table === 'changelogs') return mockChangelogFound()
      return {}
    })

    const req = new NextRequest('http://localhost:3000/api/changelogs/cl-1/import', {
      method: 'POST',
      body: '   ',
    })
    const res = await POST(req, { params: mockParams })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Empty file')
  })
})
