/**
 * Rate limiting middleware for tRPC procedures
 * IMPROVEMENT: Adds rate limiting without changing functionality
 */

import { TRPCError } from '@trpc/server';

// In-memory rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  identifier?: string;
}

/**
 * Creates rate limiting middleware
 * IMPROVEMENT: Protects against abuse without breaking functionality
 */
export const rateLimitMiddleware = (options: RateLimitOptions) => {
  const { maxRequests, windowMs, identifier = 'default' } = options;

  return async (opts: { ctx: any; next: () => Promise<any> }) => {
    // Get client identifier (IP address or deviceId)
    const clientId = opts.ctx.req?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     opts.ctx.req?.headers?.get('x-real-ip') ||
                     'unknown';

    const key = `${identifier}:${clientId}`;
    const now = Date.now();
    const stored = rateLimitStore.get(key);

    // Check if window expired
    if (!stored || now > stored.resetAt) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return opts.next();
    }

    // Check if limit exceeded
    if (stored.count >= maxRequests) {
      const retryAfter = Math.ceil((stored.resetAt - now) / 1000);
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        cause: { retryAfter },
      });
    }

    // Increment counter
    stored.count++;
    rateLimitStore.set(key, stored);

    // Cleanup old entries periodically (every 1000 requests)
    if (rateLimitStore.size > 1000) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (now > v.resetAt) {
          rateLimitStore.delete(k);
        }
      }
    }

    return opts.next();
  };
};

/**
 * Pre-configured rate limiters for different use cases
 */
export const rateLimiters = {
  // AI analysis - more restrictive (expensive operations)
  ai: rateLimitMiddleware({
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    identifier: 'ai',
  }),

  // Sync operations - moderate limit
  sync: rateLimitMiddleware({
    maxRequests: 30,
    windowMs: 60000, // 1 minute
    identifier: 'sync',
  }),

  // General API - more permissive
  general: rateLimitMiddleware({
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    identifier: 'general',
  }),
};
