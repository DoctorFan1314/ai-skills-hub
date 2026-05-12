import db from './db';
import type { DBBillingRecord, DBUsageLog } from './db';

export interface BillingResult {
  success: boolean;
  newBalance?: number;
  error?: string;
}

export function deductBalance(userId: number, amount: number, description: string): BillingResult {
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number } | undefined;
  if (!user) return { success: false, error: 'User not found' };
  if (user.balance < amount) return { success: false, error: 'Insufficient balance', newBalance: user.balance };

  const newBalance = user.balance - amount;
  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, userId);
    db.prepare('INSERT INTO billing_records (user_id, amount, type, description, balance_after) VALUES (?, ?, ?, ?, ?)').run(userId, -amount, 'deduct', description, newBalance);
  });
  txn();

  return { success: true, newBalance };
}

export function addBalance(userId: number, amount: number, type: 'recharge' | 'refund' | 'gift', description: string): BillingResult {
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number } | undefined;
  if (!user) return { success: false, error: 'User not found' };

  const newBalance = user.balance + amount;
  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, userId);
    db.prepare('INSERT INTO billing_records (user_id, amount, type, description, balance_after) VALUES (?, ?, ?, ?, ?)').run(userId, amount, type, description, newBalance);
  });
  txn();

  return { success: true, newBalance };
}

export function getEffectiveMultiplier(model: string): { multiplier: number; type: string; description: string } {
  // 1. Check time-based multiplier
  const timeSettings = db.prepare('SELECT * FROM time_multiplier_settings WHERE id = 1 AND enabled = 1').get() as {
    day_start: string;
    day_end: string;
    day_rate: number;
    night_rate: number;
    timezone: string;
  } | undefined;

  if (timeSettings) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timeSettings.timezone,
    });
    const currentTime = formatter.format(now);
    const isDay = currentTime >= timeSettings.day_start && currentTime <= timeSettings.day_end;

    return {
      multiplier: isDay ? timeSettings.day_rate : timeSettings.night_rate,
      type: 'time',
      description: isDay ? `Day rate (${timeSettings.day_start}-${timeSettings.day_end})` : `Night rate (${timeSettings.day_end}-${timeSettings.day_start})`
    };
  }

  // 2. Check regular multiplier
  const regular = db.prepare('SELECT multiplier, description FROM multiplier_rules WHERE model_name = ? AND enabled = 1').get(model) as {
    multiplier: number;
    description: string | null;
  } | undefined;

  if (regular) {
    return {
      multiplier: regular.multiplier,
      type: 'regular',
      description: regular.description || 'Model specific'
    };
  }

  // 3. Default
  return { multiplier: 1.0, type: 'default', description: 'Standard rate' };
}

export function calculateCost(
  model: string,
  tokensIn: number,
  tokensOut: number,
  cached: boolean = false,
  tokensInCache: number = 0,
  tokensCacheCreation: number = 0,
): number {
  const rate = db.prepare('SELECT input_rate, output_rate, cache_rate, cache_creation_rate FROM model_rates WHERE model_name = ? AND enabled = 1').get(model) as { input_rate: number; output_rate: number; cache_rate: number; cache_creation_rate: number } | undefined;

  if (!rate) {
    // Default rate if model not found
    return (tokensIn * 0.001 + tokensOut * 0.002) / 1000;
  }

  // Non-cached input tokens: charged at full input_rate
  const nonCachedIn = tokensIn - tokensInCache - tokensCacheCreation;
  const inputCost = Math.max(0, nonCachedIn) * rate.input_rate / 1000;

  // Cache hit tokens: charged at cache_rate
  const cacheHitCost = tokensInCache * rate.cache_rate / 1000;

  // Cache creation tokens: use cache_creation_rate if set, else fallback to 1.25x input_rate
  const cacheCreateRate = rate.cache_creation_rate > 0 ? rate.cache_creation_rate : rate.input_rate * 1.25;
  const cacheCreationCost = tokensCacheCreation * cacheCreateRate / 1000;

  // Output tokens: always at output_rate
  const outputCost = tokensOut * rate.output_rate / 1000;

  return inputCost + cacheHitCost + cacheCreationCost + outputCost;
}

export function logUsage(data: {
  userId: number;
  apiKeyId?: number;
  channelId?: number;
  model: string;
  tokensIn: number;
  tokensOut: number;
  tokensInCache?: number;
  tokensCacheCreation?: number;
  cost: number;
  latencyMs?: number;
  success: boolean;
  errorMessage?: string;
  cached?: boolean;
  multiplier?: number;
}) {
  db.prepare(
    'INSERT INTO usage_logs (user_id, api_key_id, channel_id, model, tokens_in, tokens_out, tokens_in_cache, tokens_cache_creation, cost, latency_ms, success, error_message, cached, multiplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    data.userId, data.apiKeyId ?? null, data.channelId ?? null, data.model,
    data.tokensIn, data.tokensOut, data.tokensInCache ?? 0, data.tokensCacheCreation ?? 0,
    data.cost, data.latencyMs ?? null,
    data.success ? 1 : 0, data.errorMessage ?? null, data.cached ? 1 : 0, data.multiplier ?? 1.0
  );
}
