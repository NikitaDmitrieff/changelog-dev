import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockAdminFrom = vi.fn()
const mockValidateApiKey = vi.fn()

vi.mock('@/lib/api-key', () => ({
  validateApiKey: (...args: unknown[]) => mockValidateApiKey(...args),
  createAdminClient: vi.fn(() => ({
    from: mockAdminFrom,
  })),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ allowed: true })),
}))

import { GET, POST } from '@/app/api/v1/entries/route'

function makePostRequest(body: Record<string, unknown>, authHeader?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers['Authorization'] = authHeader
  return new NextRequest('http://localhost:3000/api/v1/entries', {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  })
}

function makeGetRequest(params?: Record<string, string>, authHeader?: string) {
  const url = new URL('http://localhost:3000/api/v1/entries')
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  }
  const headers: Record<string, string> = {}
  if (authHeader) headers['Authorization'] = authHeader
  return new NextRequest(url, { method: 'GET', headers })
}

// Keep old alias for POST tests
const makeRequest = makePostRequest

describe('POST /api/v1/entries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without API key', async () => {
    mockValidateApiKey.mockResolvedValue(null)
    const req = makeRequest({ title: 'test', content: 'body' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid API key', async () => {
    mockValidateApiKey.mockResolvedValue(null)
    const req = makeRequest({ title: 'test', content: 'body' }, 'Bearer invalid_key')
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 without title', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const req = makeRequest({ content: 'body' }, 'Bearer cldev_valid')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('title is required')
  })

  it('returns 400 without content', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const req = makeRequest({ title: 'test' }, 'Bearer cldev_valid')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('content is required')
  })

  it('returns 400 with invalid tags', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const req = makeRequest({ title: 'test', content: 'body', tags: 'not-array' }, 'Bearer cldev_valid')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('tags must be an array of strings')
  })

  it('creates entry successfully', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const mockEntry = {
      id: 'e-1',
      changelog_id: 'cl-1',
      title: 'v1.0',
      content: 'Release notes',
      version: '1.0.0',
      tags: ['feature'],
      is_published: true,
      published_at: '2026-01-01T00:00:00Z',
    }
    mockAdminFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
        }),
      }),
    })
    const req = makeRequest(
      { title: 'v1.0', content: 'Release notes', version: '1.0.0', tags: ['feature'], is_published: true },
      'Bearer cldev_valid'
    )
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('v1.0')
    expect(body.is_published).toBe(true)
  })

  it('creates draft entry by default', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    mockAdminFrom.mockReturnValue({
      insert: vi.fn().mockImplementation((data: Record<string, unknown>) => {
        expect(data.is_published).toBe(false)
        return {
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'e-2', ...data },
              error: null,
            }),
          }),
        }
      }),
    })
    const req = makeRequest(
      { title: 'Draft entry', content: 'Some content' },
      'Bearer cldev_valid'
    )
    const res = await POST(req)
    expect(res.status).toBe(201)
  })
})

describe('GET /api/v1/entries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without API key', async () => {
    mockValidateApiKey.mockResolvedValue(null)
    const req = makeGetRequest()
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns entries list', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const entries = [
      { id: 'e-1', title: 'First', is_published: true, created_at: '2026-01-01' },
      { id: 'e-2', title: 'Second', is_published: false, created_at: '2026-01-02' },
    ]
    const mockRange = vi.fn().mockResolvedValue({ data: entries, error: null, count: 2 })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockAdminFrom.mockReturnValue({ select: mockSelect })

    const req = makeGetRequest({}, 'Bearer cldev_valid')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.entries).toHaveLength(2)
    expect(body.total).toBe(2)
    expect(body.limit).toBe(50)
    expect(body.offset).toBe(0)
  })

  it('supports status filter', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const mockEqPublished = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 })
    const mockRange = vi.fn().mockReturnValue({ eq: mockEqPublished })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockAdminFrom.mockReturnValue({ select: mockSelect })

    const req = makeGetRequest({ status: 'published' }, 'Bearer cldev_valid')
    const res = await GET(req)
    expect(res.status).toBe(200)
    // Verify is_published filter was called
    expect(mockEqPublished).toHaveBeenCalledWith('is_published', true)
  })

  it('respects limit and offset params', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const mockRange = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockAdminFrom.mockReturnValue({ select: mockSelect })

    const req = makeGetRequest({ limit: '10', offset: '5' }, 'Bearer cldev_valid')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.limit).toBe(10)
    expect(body.offset).toBe(5)
    expect(mockRange).toHaveBeenCalledWith(5, 14)
  })

  it('caps limit at 100', async () => {
    mockValidateApiKey.mockResolvedValue({ changelog_id: 'cl-1', owner_id: 'u-1' })
    const mockRange = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockAdminFrom.mockReturnValue({ select: mockSelect })

    const req = makeGetRequest({ limit: '500' }, 'Bearer cldev_valid')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.limit).toBe(100)
  })
})
