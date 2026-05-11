import db from './db';
import type { DBChannel } from './db';

const FAIL_THRESHOLD = 3;
const RECOVERY_TIME_MS = 5 * 60 * 1000; // 5 minutes

export interface ChannelSelection {
  channel: DBChannel;
  model: string; // actual model name after mapping
}

export function selectChannel(requestedModel: string): ChannelSelection | null {
  // Get all enabled channels
  const channels = db.prepare(
    'SELECT * FROM channels WHERE enabled = 1 ORDER BY priority DESC'
  ).all() as DBChannel[];

  if (channels.length === 0) return null;

  // Filter channels that support the requested model
  const eligible = channels.filter(ch => {
    const models: string[] = JSON.parse(ch.models || '[]');
    if (models.length === 0) return true; // empty = supports all
    return models.includes(requestedModel) || models.includes('*');
  });

  if (eligible.length === 0) return null;

  // Filter out channels that have failed too many times (unless recovery time passed)
  const now = Date.now();
  const available = eligible.filter(ch => {
    if (ch.fail_count < FAIL_THRESHOLD) return true;
    if (ch.last_fail_at && now - new Date(ch.last_fail_at).getTime() > RECOVERY_TIME_MS) {
      // Reset fail count for recovery
      db.prepare('UPDATE channels SET fail_count = 0 WHERE id = ?').run(ch.id);
      return true;
    }
    return false;
  });

  if (available.length === 0) return null;

  // Weighted random selection
  const totalWeight = available.reduce((sum, ch) => sum + ch.weight, 0);
  let random = Math.random() * totalWeight;
  for (const ch of available) {
    random -= ch.weight;
    if (random <= 0) {
      // Apply model mapping
      const mapping: Record<string, string> = JSON.parse(ch.model_mapping || '{}');
      const actualModel = mapping[requestedModel] || requestedModel;
      return { channel: ch, model: actualModel };
    }
  }

  // Fallback to first available
  const ch = available[0];
  const mapping: Record<string, string> = JSON.parse(ch.model_mapping || '{}');
  return { channel: ch, model: mapping[requestedModel] || requestedModel };
}

export function reportChannelFailure(channelId: number, errorMessage: string) {
  db.prepare(
    'UPDATE channels SET fail_count = fail_count + 1, last_fail_at = CURRENT_TIMESTAMP, status = CASE WHEN fail_count + 1 >= ? THEN ? ELSE status END WHERE id = ?'
  ).run(FAIL_THRESHOLD, 'offline', channelId);
}

export function reportChannelSuccess(channelId: number) {
  db.prepare(
    'UPDATE channels SET fail_count = 0, status = ? WHERE id = ?'
  ).run('online', channelId);
}

export function getChannels(): DBChannel[] {
  return db.prepare('SELECT * FROM channels ORDER BY priority DESC, created_at DESC').all() as DBChannel[];
}

export function getAvailableModels(): string[] {
  const rates = db.prepare('SELECT model_name, display_name, provider FROM model_rates WHERE enabled = 1').all() as { model_name: string; display_name: string; provider: string }[];
  return rates.map(r => r.model_name);
}
