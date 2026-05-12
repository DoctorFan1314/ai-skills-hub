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

  // Initialize schema
  const schema = readFileSync(join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf-8');
  _db.exec(schema);

  // Migrations for existing databases (ALTER TABLE fails silently if column exists)
  const migrations = [
    'ALTER TABLE usage_logs ADD COLUMN tokens_in_cache INTEGER DEFAULT 0',
    'ALTER TABLE usage_logs ADD COLUMN tokens_cache_creation INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN enabled INTEGER DEFAULT 1',
    'ALTER TABLE model_rates ADD COLUMN cache_creation_rate REAL DEFAULT 0',
  ];
  for (const sql of migrations) {
    try { _db.exec(sql); } catch { /* column already exists */ }
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
  enabled: number;
  max_uses: number;
  current_uses: number;
  created_by: number;
  created_at: string;
  expires_at: string | null;
}
