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

export function calculateCost(
  model: string,
  tokensIn: number,
  tokensOut: number,
  cached: boolean = false,
  tokensInCache: number = 0,
  tokensCacheCreation: number = 0,
): number {
  const rate = db.prepare('SELECT input_rate, output_rate, cache_rate FROM model_rates WHERE model_name = ? AND enabled = 1').get(model) as { input_rate: number; output_rate: number; cache_rate: number } | undefined;

  if (!rate) {
    // Default rate if model not found
    return (tokensIn * 0.001 + tokensOut * 0.002) / 1000;
  }

  // Non-cached input tokens: charged at full input_rate
  const nonCachedIn = tokensIn - tokensInCache - tokensCacheCreation;
  const inputCost = Math.max(0, nonCachedIn) * rate.input_rate / 1000;

  // Cache hit tokens: charged at cache_rate (typically 50% off for reads)
  const cacheHitCost = tokensInCache * rate.cache_rate / 1000;

  // Cache creation tokens: charged at 1.25x input_rate (Anthropic charges more for writes)
  const cacheCreationCost = tokensCacheCreation * rate.input_rate * 1.25 / 1000;

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
}) {
  db.prepare(
    'INSERT INTO usage_logs (user_id, api_key_id, channel_id, model, tokens_in, tokens_out, tokens_in_cache, tokens_cache_creation, cost, latency_ms, success, error_message, cached) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    data.userId, data.apiKeyId ?? null, data.channelId ?? null, data.model,
    data.tokensIn, data.tokensOut, data.tokensInCache ?? 0, data.tokensCacheCreation ?? 0,
    data.cost, data.latencyMs ?? null,
    data.success ? 1 : 0, data.errorMessage ?? null, data.cached ? 1 : 0
  );
}
