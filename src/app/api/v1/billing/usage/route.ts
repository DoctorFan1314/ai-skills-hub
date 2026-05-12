import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateApiKey, validateUserFromCookie } from '@/lib/api-gateway';
import type { DBUsageLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Support both API key auth and cookie auth (for dashboard)
    const authHeader = request.headers.get('authorization');
    let userId: number;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const auth = validateApiKey(authHeader);
      if (!auth.valid || !auth.user) {
        return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
      }
      userId = auth.user.id;
    } else {
      const auth = validateUserFromCookie(request.headers.get('cookie'));
      if (!auth.valid || !auth.user) {
        return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
      }
      userId = auth.user.id;
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const logs = db.prepare(
      'SELECT id, model, tokens_in, tokens_out, tokens_in_cache, tokens_cache_creation, cost, latency_ms, success, cached, created_at FROM usage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(userId, limit, offset) as DBUsageLog[];

    const total = db.prepare('SELECT COUNT(*) as count FROM usage_logs WHERE user_id = ?').get(userId) as { count: number };

    return NextResponse.json({
      object: 'list',
      data: logs,
      total: total.count,
      has_more: offset + limit < total.count,
    });
  } catch (error) {
    console.error('Usage logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
