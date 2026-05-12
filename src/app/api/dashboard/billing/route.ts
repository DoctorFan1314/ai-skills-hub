import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import type { DBBillingRecord } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const records = db.prepare(
      'SELECT id, amount, type, description, balance_after, created_at FROM billing_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(auth.user.id) as DBBillingRecord[];

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Billing records error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
