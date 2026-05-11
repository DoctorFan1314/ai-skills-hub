import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateApiKey } from '@/lib/api-gateway';
import type { DBUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const auth = validateApiKey(authHeader);

    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const user = auth.user as DBUser;

    return NextResponse.json({
      balance: user.balance,
      currency: 'USD',
    });
  } catch (error) {
    console.error('Balance check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
