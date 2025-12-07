/**
 * Rate Limiting - Production Security
 *
 * Prevents abuse by limiting requests per IP/user
 * Uses Upstash Redis for distributed rate limiting
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback for development (no Redis needed)
class InMemoryRateLimiter {
  private store: Map<string, { count: number; reset: number }> = new Map();

  async limit(identifier: string, limit: number, window: number): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const key = identifier;
    const data = this.store.get(key);

    if (!data || data.reset < now) {
      // Reset window
      const reset = now + window;
      this.store.set(key, { count: 1, reset });
      return { success: true, remaining: limit - 1, reset };
    }

    if (data.count >= limit) {
      return { success: false, remaining: 0, reset: data.reset };
    }

    data.count++;
    this.store.set(key, data);
    return { success: true, remaining: limit - data.count, reset: data.reset };
  }
}

// Create rate limiters
const createRateLimiter = (requests: number, window: string) => {
  // Use Upstash in production, in-memory in development
  if (process.env['UPSTASH_REDIS_REST_URL'] && process.env['UPSTASH_REDIS_REST_TOKEN']) {
    const redis = new Redis({
      url: process.env['UPSTASH_REDIS_REST_URL'],
      token: process.env['UPSTASH_REDIS_REST_TOKEN'],
    });

    const windowMs = parseWindow(window);

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, `${windowMs} ms`),
      analytics: true,
      prefix: "tundua:ratelimit",
    });
  }

  // Fallback for development
  const fallback = new InMemoryRateLimiter();
  const windowMs = parseWindow(window);

  return {
    limit: async (identifier: string) => {
      return fallback.limit(identifier, requests, windowMs);
    },
  };
};

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*([smhd])$/);
  if (!match || !match[1] || !match[2]) throw new Error(`Invalid window format: ${window}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const multiplier = multipliers[unit];
  if (multiplier === undefined) {
    throw new Error(`Invalid time unit: ${unit}`);
  }

  return value * multiplier;
}

// Different rate limits for different endpoints
export const rateLimiters = {
  // Strict: Auth endpoints (prevent brute force)
  auth: createRateLimiter(5, "15 m"), // 5 requests per 15 minutes

  // Medium: API endpoints
  api: createRateLimiter(100, "1 m"), // 100 requests per minute

  // Generous: General pages
  page: createRateLimiter(300, "1 m"), // 300 requests per minute

  // Very strict: Payment endpoints
  payment: createRateLimiter(10, "1 h"), // 10 requests per hour

  // File uploads
  upload: createRateLimiter(20, "1 h"), // 20 uploads per hour

  // AI endpoints (cost-sensitive)
  // Free users: 5 requests per hour (allows proper testing + value demonstration)
  // Resets every hour - users can generate ~40 per day if spread out
  // Premium users: Unlimited (bypasses this limit)
  ai: createRateLimiter(5, "1 h"), // 5 AI requests per hour
};

/**
 * Get identifier for rate limiting (IP or user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from various headers (for proxies/CDNs)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";

  return `ip:${ip}`;
}

/**
 * Rate limit a request
 */
export async function checkRateLimit(
  request: Request,
  limiter: ReturnType<typeof createRateLimiter>,
  userId?: string
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const identifier = getRateLimitIdentifier(request, userId);
  return await limiter.limit(identifier);
}
