const hits = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of hits) {
    if (now > val.resetAt) hits.delete(key)
  }
}, 5 * 60 * 1000).unref?.()

/**
 * Simple in-memory rate limiter keyed by IP + route.
 * Returns { allowed: true } or { allowed: false, retryAfter } in seconds.
 */
export function rateLimit(
  ip: string,
  route: string,
  { maxRequests = 5, windowSeconds = 60 } = {}
): { allowed: true } | { allowed: false; retryAfter: number } {
  const key = `${ip}:${route}`
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true }
  }

  if (entry.count < maxRequests) {
    entry.count++
    return { allowed: true }
  }

  return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
}
