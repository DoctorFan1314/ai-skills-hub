import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { mkdirSync } from 'fs';
import { join } from 'path';

// Lazy singleton — only created at runtime, not during build
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'oortapi.db');
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });

  _db = new Database(DB_PATH, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined });

  // Enable WAL mode for better concurrent read performance
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  // Run migrations FIRST so existing databases have new columns before schema INSERTs
  const migrations = [
    'ALTER TABLE usage_logs ADD COLUMN tokens_in_cache INTEGER DEFAULT 0',
    'ALTER TABLE usage_logs ADD COLUMN tokens_cache_creation INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN enabled INTEGER DEFAULT 1',
    'ALTER TABLE model_rates ADD COLUMN cache_creation_rate REAL DEFAULT 0',
    'ALTER TABLE usage_logs ADD COLUMN multiplier REAL DEFAULT 1.0',
    'ALTER TABLE model_rates ADD COLUMN credit_rate REAL NOT NULL DEFAULT 1.0',
    'ALTER TABLE usage_logs ADD COLUMN credits_used INTEGER DEFAULT 0',
    'ALTER TABLE usage_logs ADD COLUMN deduction_source TEXT DEFAULT \'balance\'',
    'ALTER TABLE redeem_codes ADD COLUMN code_type TEXT NOT NULL DEFAULT \'balance\'',
    'ALTER TABLE redeem_codes ADD COLUMN plan_id INTEGER',
    'ALTER TABLE redeem_codes ADD COLUMN billing_cycle TEXT DEFAULT \'monthly\'',
    'ALTER TABLE redeem_codes ADD COLUMN duration_months INTEGER DEFAULT 1',
    'ALTER TABLE subscription_plans ADD COLUMN currency TEXT NOT NULL DEFAULT \'CNY\'',
  ];
  for (const sql of migrations) {
    try {
      _db.exec(sql);
    } catch (e: unknown) {
      // Only ignore "duplicate column" errors; re-throw anything else
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes('duplicate column') && !msg.includes('already exists')) {
        console.error(`Migration failed: ${sql}`, e);
      }
    }
  }

  // Initialize schema (CREATE TABLE IF NOT EXISTS + INSERTs now work with all columns)
  const schema = readFileSync(join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf-8');
  _db.exec(schema);

  // Migration: reset subscription plans to correct defaults (Lite/Standard/Pro/Max)
  try {
    const planCount = _db.prepare('SELECT COUNT(*) as c FROM subscription_plans').get() as { c: number };
    if (planCount.c > 0) {
      // Always reset plans on startup to ensure correct pricing
      _db.exec('DELETE FROM plan_models');
      _db.exec('DELETE FROM subscription_plans');
      _db.exec(`INSERT INTO subscription_plans (name, display_name, tagline, tier, monthly_price, yearly_price, monthly_credits, first_purchase_discount, overage_rate_multiplier, max_concurrency, route_priority, off_peak_discount, support_level, popular) VALUES
        ('spark', 'Lite', '尝鲜入门', 1, 9, 92, 9000000, 0.23, 1.0, 10, 'standard', 0.8, 'community', 0),
        ('flare', 'Standard', '适合进阶用户', 2, 29, 296, 30000000, 0.23, 0.95, 30, 'priority', 0.8, 'email', 0),
        ('pulse', 'Pro', '适合专业开发者', 3, 79, 806, 85000000, 0.23, 0.85, 100, 'ultra', 0.8, 'priority', 1),
        ('nova', 'Max', '适合编程开发发烧友', 4, 199, 2030, 220000000, 0.23, 0.75, 500, 'exclusive', 0.8, 'dedicated', 0)`);
      _db.exec(`INSERT INTO plan_models (plan_id, model_name, enabled) VALUES
        (1, 'gpt-4o-mini', 1), (1, 'deepseek-chat', 1), (1, 'gemini-2.0-flash', 1), (1, 'gpt-3.5-turbo', 1),
        (2, 'gpt-4o', 1), (2, 'claude-3-5-sonnet-20241022', 1), (2, 'claude-3-5-haiku-20241022', 1), (2, 'deepseek-reasoner', 1), (2, 'gemini-1.5-pro', 1), (2, 'qwen-max', 1),
        (3, 'gpt-4-turbo', 1), (3, 'claude-3-opus-20240229', 1)`);
    }
  } catch (e) {
    console.error('Plan migration error:', e);
  }

  return _db;
}

// Proxy that lazily initializes the database on first property access
const db = new Proxy({} as Database.Database, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(realDb);
    }
    return value;
  },
});

export default db;

// Helper types for database rows
export interface DBUser {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  salt: string;
  balance: number;
  role: 'user' | 'admin';
  avatar: string | null;
  bio: string | null;
  preferences: string;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export interface DBApiKey {
  id: number;
  user_id: number;
  key_value: string;
  name: string;
  permissions: string;
  rate_limit: number;
  enabled: number;
  created_at: string;
  last_used_at: string | null;
  total_calls: number;
}

export interface DBChannel {
  id: number;
  name: string;
  type: string;
  api_key_encrypted: string;
  base_url: string | null;
  weight: number;
  enabled: number;
  models: string;
  model_mapping: string;
  status: string;
  priority: number;
  fail_count: number;
  last_fail_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBModelRate {
  id: number;
  model_name: string;
  display_name: string;
  provider: string;
  input_rate: number;
  output_rate: number;
  cache_rate: number;
  cache_creation_rate: number;
  credit_rate: number;
  enabled: number;
  created_at: string;
}

export interface DBUsageLog {
  id: number;
  user_id: number;
  api_key_id: number | null;
  channel_id: number | null;
  model: string;
  tokens_in: number;
  tokens_out: number;
  tokens_in_cache: number;
  tokens_cache_creation: number;
  cost: number;
  credits_used: number;
  deduction_source: string;
  latency_ms: number | null;
  success: number;
  error_message: string | null;
  cached: number;
  created_at: string;
}

export interface DBBillingRecord {
  id: number;
  user_id: number;
  amount: number;
  type: 'recharge' | 'deduct' | 'refund' | 'gift';
  description: string | null;
  balance_after: number | null;
  created_at: string;
}

export interface DBRedeemCode {
  id: number;
  code: string;
  amount: number;
  code_type: 'balance' | 'subscription';
  plan_id: number | null;
  billing_cycle: string;
  duration_months: number;
  enabled: number;
  max_uses: number;
  current_uses: number;
  created_by: number;
  created_at: string;
  expires_at: string | null;
}

export interface DBSubscriptionPlan {
  id: number;
  name: string;
  display_name: string;
  tagline: string | null;
  tier: number;
  monthly_price: number;
  yearly_price: number;
  currency: string;
  monthly_credits: number;
  first_purchase_discount: number;
  overage_rate_multiplier: number;
  max_concurrency: number;
  route_priority: string;
  off_peak_discount: number;
  support_level: string;
  enabled: number;
  popular: number;
  created_at: string;
  updated_at: string;
}

export interface DBPlanModel {
  id: number;
  plan_id: number;
  model_name: string;
  enabled: number;
}

export interface DBUserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled' | 'paused';
  credits_remaining: number;
  credits_total: number;
  current_period_start: string;
  current_period_end: string;
  is_first_purchase: number;
  auto_renew: number;
  created_at: string;
  updated_at: string;
}

export interface DBSubscriptionUsageLog {
  id: number;
  subscription_id: number;
  user_id: number;
  model: string;
  tokens_in: number;
  tokens_out: number;
  credits_used: number;
  source: 'credits' | 'balance';
  created_at: string;
}
