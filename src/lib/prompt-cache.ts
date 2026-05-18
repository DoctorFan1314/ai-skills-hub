import { createHash } from 'crypto';

// In-memory prompt cache for providers that don't report cache stats (VLLM, etc.)
// Key: `userId:model:hash`, Value: `{ tokensIn, timestamp }`
const promptCache = new Map<string, { tokensIn: number; timestamp: number }>();
const PROMPT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getPromptCacheKey(userId: number, model: string, messages: unknown): string {
  const hash = createHash('md5').update(JSON.stringify(messages)).digest('hex');
  return `${userId}:${model}:${hash}`;
}

export function checkPromptCache(userId: number, model: string, messages: unknown, tokensIn: number): { cacheHit: number; cacheCreate: number } {
  const key = getPromptCacheKey(userId, model, messages);
  const now = Date.now();
  // Clean expired entries (every 100 checks)
  if (Math.random() < 0.01) {
    for (const [k, v] of promptCache) {
      if (now - v.timestamp > PROMPT_CACHE_TTL) promptCache.delete(k);
    }
  }
  const cached = promptCache.get(key);
  if (cached && now - cached.timestamp < PROMPT_CACHE_TTL) {
    // Cache hit: treat as cache read (report as cache hit tokens)
    return { cacheHit: tokensIn, cacheCreate: 0 };
  }
  // Cache miss: store for next time, report as cache creation
  promptCache.set(key, { tokensIn, timestamp: now });
  return { cacheHit: 0, cacheCreate: tokensIn };
}
