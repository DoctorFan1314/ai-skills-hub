import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import { randomBytes } from 'crypto';
import type { DBRedeemCode } from '@/lib/db';

export const dynamic = 'force-dynamic';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let code = 'RC-';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;

    const total = (db.prepare('SELECT COUNT(*) as count FROM redeem_codes').get() as { count: number }).count;
    const codes = db.prepare(
      'SELECT * FROM redeem_codes ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset) as DBRedeemCode[];

    return NextResponse.json({ codes, total, page, limit, has_more: offset + codes.length < total });
  } catch (error) {
    console.error('Redeem codes list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { count, amount, maxUses, expiresAt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    const codeCount = Math.min(100, Math.max(1, count || 1));
    const uses = Math.max(1, maxUses || 1);
    const generated: string[] = [];

    const insert = db.prepare(
      'INSERT INTO redeem_codes (code, amount, max_uses, created_by, expires_at) VALUES (?, ?, ?, ?, ?)'
    );

    const txn = db.transaction(() => {
      for (let i = 0; i < codeCount; i++) {
        let code = generateCode();
        // Ensure uniqueness
        let attempts = 0;
        while (db.prepare('SELECT id FROM redeem_codes WHERE code = ?').get(code) && attempts < 10) {
          code = generateCode();
          attempts++;
        }
        insert.run(code, amount, uses, auth.user!.id, expiresAt || null);
        generated.push(code);
      }
    });
    txn();

    return NextResponse.json({ codes: generated, count: generated.length, amount, maxUses: uses });
  } catch (error) {
    console.error('Redeem code create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, enabled } = await request.json();
    if (!id) return NextResponse.json({ error: 'Code id is required' }, { status: 400 });

    db.prepare('UPDATE redeem_codes SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redeem code update error:', error);
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
    if (!id) return NextResponse.json({ error: 'Code id is required' }, { status: 400 });

    db.prepare('DELETE FROM redeem_codes WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redeem code delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
