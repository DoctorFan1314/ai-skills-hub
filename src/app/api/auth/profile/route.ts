import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.username !== undefined) { updates.push('username = ?'); values.push(data.username); }
    if (data.avatar !== undefined) { updates.push('avatar = ?'); values.push(data.avatar); }
    if (data.bio !== undefined) { updates.push('bio = ?'); values.push(data.bio); }
    if (data.preferences !== undefined) { updates.push('preferences = ?'); values.push(JSON.stringify(data.preferences)); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(auth.user.id);
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(auth.user.id) as DBUser;
    const { password_hash, salt, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
