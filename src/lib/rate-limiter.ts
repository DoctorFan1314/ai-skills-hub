import db from './db';

// In-memory rate limit store (resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (val.resetAt < now) rateLimitStore.delete(key);
  }
}, 60_000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export function checkRateLimit(keyId: number, limit: number): RateLimitResult {
  const key = `apikey:${keyId}`;
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window

  let entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    limit,
    resetAt: entry.resetAt,
  };
}

// Global rate limit for the entire system
export function checkGlobalRateLimit(): RateLimitResult {
  const setting = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('default_rate_limit') as { value: string } | undefined;
  const limit = setting ? parseInt(setting.value) : 1000;
  return checkRateLimit(0, limit); // key 0 = global
}
