import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockUpdateUserById = vi.fn()
const mockConstructEvent = vi.fn()
const mockInsert = vi.fn().mockResolvedValue({ error: null })

// Mock stripe - route uses dynamic import and `new Stripe()`
vi.mock('stripe', () => ({
  default: class MockStripe {
    webhooks = { constructEvent: mockConstructEvent }
  },
}))

// Mock supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        updateUserById: mockUpdateUserById,
      },
    },
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

import { POST } from '@/app/api/stripe/webhook/route'

function makeRequest(body: string, signature?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (signature) headers['stripe-signature'] = signature

  return new NextRequest('http://localhost:3000/api/stripe/webhook', {
    method: 'POST',
    body,
    headers,
  })
}

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    mockUpdateUserById.mockResolvedValue({ error: null })
  })

  it('returns 500 when Stripe not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY
    delete process.env.STRIPE_WEBHOOK_SECRET

    const res = await POST(makeRequest('{}', 'sig'))
    expect(res.status).toBe(500)
  })

  it('returns 400 when signature is missing', async () => {
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Missing signature')
  })

  it('returns 400 when signature is invalid', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const res = await POST(makeRequest('{}', 'bad-sig'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid signature')
  })

  it('handles checkout.session.completed - upgrades user to Pro', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      id: 'evt_1',
      data: {
        object: {
          metadata: { user_id: 'user-123' },
          subscription: 'sub_abc',
        },
      },
    })

    const res = await POST(makeRequest('{}', 'valid-sig'))
    expect(res.status).toBe(200)

    expect(mockUpdateUserById).toHaveBeenCalledWith('user-123', {
      user_metadata: {
        is_pro: true,
        stripe_subscription_id: 'sub_abc',
      },
    })
  })

  it('handles customer.subscription.deleted - downgrades user', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      id: 'evt_2',
      data: {
        object: {
          metadata: { user_id: 'user-456' },
        },
      },
    })

    const res = await POST(makeRequest('{}', 'valid-sig'))
    expect(res.status).toBe(200)

    expect(mockUpdateUserById).toHaveBeenCalledWith('user-456', {
      user_metadata: {
        is_pro: false,
        stripe_subscription_id: null,
      },
    })
  })

  it('handles missing user_id in metadata gracefully', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      id: 'evt_3',
      data: {
        object: { metadata: {} },
      },
    })

    const res = await POST(makeRequest('{}', 'valid-sig'))
    expect(res.status).toBe(200)
    expect(mockUpdateUserById).not.toHaveBeenCalled()
  })

  it('returns received:true for unknown event types', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'payment_intent.created',
      id: 'evt_4',
      data: { object: {} },
    })

    const res = await POST(makeRequest('{}', 'valid-sig'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.received).toBe(true)
    expect(mockUpdateUserById).not.toHaveBeenCalled()
  })

  it('logs webhook event to database after processing', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      id: 'evt_log_1',
      data: {
        object: {
          metadata: { user_id: 'user-789' },
          subscription: 'sub_xyz',
        },
      },
    })

    await POST(makeRequest('{}', 'valid-sig'))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_id: 'evt_log_1',
        event_type: 'checkout.session.completed',
        status: 'processed',
      })
    )
  })

  it('logs error status when user upgrade fails', async () => {
    mockUpdateUserById.mockResolvedValue({ error: { message: 'User not found' } })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      id: 'evt_err_1',
      data: {
        object: {
          metadata: { user_id: 'user-bad' },
          subscription: 'sub_bad',
        },
      },
    })

    await POST(makeRequest('{}', 'valid-sig'))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_id: 'evt_err_1',
        event_type: 'checkout.session.completed',
        status: 'error',
        error_message: 'User not found',
      })
    )
  })
})
