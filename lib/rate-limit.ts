const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // max 5 requests per minute

export function rateLimit(ip: string): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = ip
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS }
  }

  if (existing.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return { success: true, remaining: MAX_REQUESTS - existing.count, resetAt: existing.resetAt }
}

// Simple cleanup every 10 minutes to prevent memory leak
if (typeof globalThis !== "undefined" && !(globalThis as Record<string, unknown>).__rateLimitCleanup) {
  ;(globalThis as Record<string, unknown>).__rateLimitCleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}
