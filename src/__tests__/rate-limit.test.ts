import { describe, it, expect, beforeEach } from 'vitest'

// We need to re-import fresh each time to reset the in-memory store
let rateLimit: typeof import('@/lib/rate-limit').rateLimit

beforeEach(async () => {
  // Dynamic import to get fresh module state
  const mod = await import('@/lib/rate-limit')
  rateLimit = mod.rateLimit
})

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const result = rateLimit('1.2.3.4', 'test', { maxRequests: 3, windowSeconds: 60 })
    expect(result.allowed).toBe(true)
  })

  it('allows up to maxRequests', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('1.2.3.5', 'test', { maxRequests: 5, windowSeconds: 60 })
    }
    const result = rateLimit('1.2.3.5', 'test', { maxRequests: 5, windowSeconds: 60 })
    expect(result.allowed).toBe(false)
    if (!result.allowed) {
      expect(result.retryAfter).toBeGreaterThan(0)
      expect(result.retryAfter).toBeLessThanOrEqual(60)
    }
  })

  it('tracks different IPs independently', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('10.0.0.1', 'test', { maxRequests: 5, windowSeconds: 60 })
    }
    // IP 10.0.0.1 is exhausted
    expect(rateLimit('10.0.0.1', 'test', { maxRequests: 5, windowSeconds: 60 }).allowed).toBe(false)
    // IP 10.0.0.2 should still work
    expect(rateLimit('10.0.0.2', 'test', { maxRequests: 5, windowSeconds: 60 }).allowed).toBe(true)
  })

  it('tracks different routes independently', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('10.0.0.3', 'route-a', { maxRequests: 5, windowSeconds: 60 })
    }
    expect(rateLimit('10.0.0.3', 'route-a', { maxRequests: 5, windowSeconds: 60 }).allowed).toBe(false)
    expect(rateLimit('10.0.0.3', 'route-b', { maxRequests: 5, windowSeconds: 60 }).allowed).toBe(true)
  })

  it('uses default values when no options provided', () => {
    const result = rateLimit('10.0.0.4', 'test')
    expect(result.allowed).toBe(true)
  })
})
