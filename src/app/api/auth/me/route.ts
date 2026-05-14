import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken, getTokenFromCookie, clearTokenCookie, deleteSession } from '@/lib/auth';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ? AND enabled = 1').get(payload.userId) as DBUser | undefined;
    if (!user) {
      return NextResponse.json({ error: 'User not found or account disabled' }, { status: 404 });
    }

    const { password_hash, salt, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Delete session from DB
  const token = getTokenFromCookie(request.headers.get('cookie'));
  if (token) {
    try { deleteSession(token); } catch { /* ignore */ }
  }

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearTokenCookie());
  return response;
}
