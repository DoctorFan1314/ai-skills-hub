import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateSalt, signToken, setTokenCookie } from '@/lib/auth';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    // Get default balance from settings
    const defaultBalanceSetting = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('default_balance') as { value: string } | undefined;
    const defaultBalance = defaultBalanceSetting ? parseFloat(defaultBalanceSetting.value) : 10.0;

    const result = db.prepare(
      'INSERT INTO users (email, username, password_hash, salt, balance, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(email, username, passwordHash, salt, defaultBalance, 'user');

    const userId = result.lastInsertRowid as number;

    // Create a default API key for new user
    const { generateApiKey } = await import('@/lib/auth');
    const keyValue = generateApiKey();
    db.prepare(
      'INSERT INTO api_keys (user_id, key_value, name) VALUES (?, ?, ?)'
    ).run(userId, keyValue, 'Default');

    // Add welcome gift
    db.prepare(
      'INSERT INTO billing_records (user_id, amount, type, description, balance_after) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, defaultBalance, 'gift', 'Welcome bonus', defaultBalance);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as DBUser;
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const cookie = setTokenCookie(token);

    const { password_hash, salt: s, ...safeUser } = user;
    const response = NextResponse.json({ user: safeUser });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
