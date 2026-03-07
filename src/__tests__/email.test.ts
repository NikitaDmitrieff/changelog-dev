import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSend = vi.fn()

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend }
  },
}))

vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('email module', () => {
  beforeEach(() => {
    vi.resetModules()
    mockSend.mockReset()
    process.env.RESEND_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://test.changelogdev.com'
  })

  describe('sendConfirmationEmail', () => {
    it('sends confirmation email with correct parameters', async () => {
      mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })

      const { sendConfirmationEmail } = await import('@/lib/email')
      const result = await sendConfirmationEmail({
        email: 'user@example.com',
        changelogName: 'My App',
        confirmationToken: 'abc-123',
      })

      expect(result).toBe(true)
      expect(mockSend).toHaveBeenCalledOnce()
      const call = mockSend.mock.calls[0][0]
      expect(call.to).toBe('user@example.com')
      expect(call.subject).toContain('My App')
      expect(call.html).toContain('abc-123')
      expect(call.html).toContain('Confirm your subscription')
    })

    it('returns false when resend returns error', async () => {
      mockSend.mockResolvedValue({ data: null, error: { message: 'Bad request' } })

      const { sendConfirmationEmail } = await import('@/lib/email')
      const result = await sendConfirmationEmail({
        email: 'user@example.com',
        changelogName: 'My App',
        confirmationToken: 'abc-123',
      })

      expect(result).toBe(false)
    })

    it('returns false when RESEND_API_KEY not set', async () => {
      delete process.env.RESEND_API_KEY

      const { sendConfirmationEmail } = await import('@/lib/email')
      const result = await sendConfirmationEmail({
        email: 'user@example.com',
        changelogName: 'My App',
        confirmationToken: 'abc-123',
      })

      expect(result).toBe(false)
      expect(mockSend).not.toHaveBeenCalled()
    })
  })

  describe('sendEntryNotifications', () => {
    it('sends batch notifications to subscribers', async () => {
      mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })

      const { sendEntryNotifications } = await import('@/lib/email')
      const result = await sendEntryNotifications({
        changelogId: 'cl-1',
        changelogName: 'My App',
        changelogSlug: 'my-app',
        entryTitle: 'v1.0 Release',
        entryContent: 'We shipped new features!',
        subscribers: [
          { id: 's1', email: 'a@test.com', unsubscribe_token: 'tok-a' },
          { id: 's2', email: 'b@test.com', unsubscribe_token: 'tok-b' },
        ],
      })

      expect(result.sent).toBe(2)
      expect(result.failed).toBe(0)
      expect(mockSend).toHaveBeenCalledTimes(2)

      const html1 = mockSend.mock.calls[0][0].html
      const html2 = mockSend.mock.calls[1][0].html
      expect(html1).toContain('tok-a')
      expect(html2).toContain('tok-b')
    })

    it('handles mixed success/failure in batch', async () => {
      mockSend
        .mockResolvedValueOnce({ data: { id: 'email-1' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'fail' } })

      const { sendEntryNotifications } = await import('@/lib/email')
      const result = await sendEntryNotifications({
        changelogId: 'cl-1',
        changelogName: 'My App',
        changelogSlug: 'my-app',
        entryTitle: 'v1.0',
        entryContent: 'content',
        subscribers: [
          { id: 's1', email: 'a@test.com', unsubscribe_token: 'tok-a' },
          { id: 's2', email: 'b@test.com', unsubscribe_token: 'tok-b' },
        ],
      })

      expect(result.sent).toBe(1)
      expect(result.failed).toBe(1)
    })

    it('returns zeros for empty subscriber list', async () => {
      const { sendEntryNotifications } = await import('@/lib/email')
      const result = await sendEntryNotifications({
        changelogId: 'cl-1',
        changelogName: 'My App',
        changelogSlug: 'my-app',
        entryTitle: 'v1.0',
        entryContent: 'content',
        subscribers: [],
      })

      expect(result.sent).toBe(0)
      expect(result.failed).toBe(0)
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('falls back to subscriber id when unsubscribe_token is null', async () => {
      mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })

      const { sendEntryNotifications } = await import('@/lib/email')
      await sendEntryNotifications({
        changelogId: 'cl-1',
        changelogName: 'My App',
        changelogSlug: 'my-app',
        entryTitle: 'v1.0',
        entryContent: 'content',
        subscribers: [
          { id: 'sub-id-fallback', email: 'a@test.com', unsubscribe_token: null },
        ],
      })

      const html = mockSend.mock.calls[0][0].html
      expect(html).toContain('sub-id-fallback')
    })

    it('escapes HTML in entry title and content', async () => {
      mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })

      const { sendEntryNotifications } = await import('@/lib/email')
      await sendEntryNotifications({
        changelogId: 'cl-1',
        changelogName: 'My App',
        changelogSlug: 'my-app',
        entryTitle: '<script>alert("xss")</script>',
        entryContent: '"><img src=x onerror=alert(1)>',
        subscribers: [
          { id: 's1', email: 'a@test.com', unsubscribe_token: 'tok-a' },
        ],
      })

      const html = mockSend.mock.calls[0][0].html
      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script&gt;')
    })
  })
})
