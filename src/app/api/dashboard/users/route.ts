import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import { addBalance, deductBalance } from '@/lib/billing-engine';
import { generateSalt, hashPassword } from '@/lib/auth';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (search) {
      where += ' AND (email LIKE ? OR username LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role && (role === 'admin' || role === 'user')) {
      where += ' AND role = ?';
      params.push(role);
    }

    const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as { count: number }).count;
    const users = db.prepare(
      `SELECT id, email, username, balance, role, enabled, avatar, created_at, updated_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).all(...params, limit, offset) as Omit<DBUser, 'password_hash' | 'salt' | 'bio' | 'preferences'>[];

    return NextResponse.json({ users, total, page, limit, has_more: offset + users.length < total });
  } catch (error) {
    console.error('Users list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, role, enabled, addBalance: addAmt, deductBalance: deductAmt, resetPassword } = body;

    if (!id) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 });
    }

    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as DBUser | undefined;
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from disabling/demoting themselves
    if (id === auth.user.id) {
      if (enabled === 0) {
        return NextResponse.json({ error: 'Cannot disable yourself' }, { status: 400 });
      }
      if (role === 'user') {
        return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
      }
    }

    // Update role
    if (role && (role === 'admin' || role === 'user')) {
      db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, id);
    }

    // Update enabled
    if (enabled !== undefined) {
      db.prepare('UPDATE users SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(enabled ? 1 : 0, id);
    }

    // Add balance
    if (addAmt && addAmt > 0) {
      const result = addBalance(id, addAmt, 'gift', `Admin credited by ${auth.user.email}`);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }

    // Deduct balance
    if (deductAmt && deductAmt > 0) {
      const result = deductBalance(id, deductAmt, `Admin deducted by ${auth.user.email}`);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }

    // Reset password
    let newPassword: string | undefined;
    if (resetPassword === true) {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      const bytes = new Uint8Array(12);
      crypto.getRandomValues(bytes);
      newPassword = Array.from(bytes, b => chars[b % chars.length]).join('');
      const salt = generateSalt();
      const passwordHash = hashPassword(newPassword, salt);
      db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, salt, id);
    }

    const updated = db.prepare('SELECT id, email, username, balance, role, enabled, avatar, created_at, updated_at FROM users WHERE id = ?').get(id);
    return NextResponse.json({ user: updated, newPassword });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 });
    }

    if (id === auth.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const target = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // CASCADE handles api_keys, usage_logs, billing_records
    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
