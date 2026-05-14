import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, signToken, setTokenCookie, TOKEN_NAME } from '@/lib/auth';
import { checkIpRateLimit } from '@/lib/rate-limiter';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per IP per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = checkIpRateLimit(`login:${ip}`, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as DBUser | undefined;
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.enabled) {
      return NextResponse.json({ error: 'Account is disabled. Please contact an administrator.' }, { status: 403 });
    }

    if (!verifyPassword(password, user.password_hash, user.salt)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const cookie = setTokenCookie(token);

    const { password_hash, salt, ...safeUser } = user;
    const response = NextResponse.json({ user: safeUser });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
