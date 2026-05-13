import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateApiKey, validateUserFromCookie } from '@/lib/api-gateway';

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
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50')), 100);
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));

    const logs = db.prepare(
      `SELECT u.id, u.model, u.tokens_in, u.tokens_out, u.tokens_in_cache, u.tokens_cache_creation,
              u.cost, u.credits_used, u.deduction_source, u.latency_ms, u.success, u.cached, u.created_at, u.channel_id, u.multiplier,
              c.name as channel_name,
              m.input_rate, m.output_rate, m.cache_rate, m.cache_creation_rate, m.credit_rate
       FROM usage_logs u
       LEFT JOIN channels c ON u.channel_id = c.id
       LEFT JOIN model_rates m ON u.model = m.model_name
       WHERE u.user_id = ? ORDER BY u.created_at DESC LIMIT ? OFFSET ?`
    ).all(userId, limit, offset);

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
