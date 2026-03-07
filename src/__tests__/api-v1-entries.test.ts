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

import { POST } from '@/app/api/v1/entries/route'

function makeRequest(body: Record<string, unknown>, authHeader?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers['Authorization'] = authHeader
  return new NextRequest('http://localhost:3000/api/v1/entries', {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  })
}

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
