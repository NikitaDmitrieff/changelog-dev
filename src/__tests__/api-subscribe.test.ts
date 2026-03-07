import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase SSR
const mockSingle = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSelect = vi.fn()

const mockQuery = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  eq: mockEq,
  single: mockSingle,
}

// Chain returns
mockSelect.mockReturnValue(mockQuery)
mockInsert.mockReturnValue(mockQuery)
mockUpdate.mockReturnValue(mockQuery)
mockEq.mockReturnValue(mockQuery)

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => ({ ...mockQuery })),
  })),
}))

// Mock cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

// Mock email
const mockSendConfirmation = vi.fn()
vi.mock('@/lib/email', () => ({
  sendConfirmationEmail: (...args: unknown[]) => mockSendConfirmation(...args),
}))

// Mock rate limit
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ allowed: true })),
}))

import { POST } from '@/app/api/subscribe/route'

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendConfirmation.mockResolvedValue(true)
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('returns 400 for missing fields', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Missing')
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({
      changelog_id: '12345678-1234-1234-1234-123456789abc',
      email: 'not-an-email',
    }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid email')
  })

  it('returns 400 for invalid UUID', async () => {
    const res = await POST(makeRequest({
      changelog_id: 'not-a-uuid',
      email: 'user@test.com',
    }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid changelog')
  })

  it('validates email format correctly', async () => {
    const invalidEmails = ['@bad', 'no-at', 'spaces in@email.com', '']
    for (const email of invalidEmails) {
      const res = await POST(makeRequest({
        changelog_id: '12345678-1234-1234-1234-123456789abc',
        email,
      }))
      const status = res.status
      expect(status === 400 || status === 400).toBe(true)
    }
  })
})
