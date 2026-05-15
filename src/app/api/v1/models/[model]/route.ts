import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import type { DBModelRate } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const decodedModel = decodeURIComponent(model);

    const rate = db.prepare(
      'SELECT * FROM model_rates WHERE model_name = ? AND enabled = 1'
    ).get(decodedModel) as DBModelRate | undefined;

    if (!rate) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    // Get which channels serve this model
    const channels = db.prepare(
      `SELECT c.id, c.name, c.type, c.status, c.enabled, c.priority
       FROM channels c WHERE c.enabled = 1 AND (c.models LIKE ? OR c.models LIKE '%"*"%')`
    ).all(`%"${decodedModel}"%`) as { id: number; name: string; type: string; status: string; enabled: number; priority: number }[];

    // Get usage stats for this model (last 7 days)
    const usageStats = db.prepare(
      `SELECT COUNT(*) as total_calls, AVG(latency_ms) as avg_latency, SUM(tokens_in + tokens_out) as total_tokens
       FROM usage_logs WHERE model = ? AND created_at >= datetime('now', '-7 days')`
    ).get(decodedModel) as { total_calls: number; avg_latency: number | null; total_tokens: number };

    return NextResponse.json({
      model: {
        name: rate.model_name,
        display_name: rate.display_name || rate.model_name,
        provider: rate.provider,
        input_rate: rate.input_rate,
        output_rate: rate.output_rate,
        cache_rate: rate.cache_rate,
        cache_creation_rate: rate.cache_creation_rate,
        credit_rate: rate.credit_rate,
        tags: rate.tags ? JSON.parse(rate.tags) : [],
      },
      channels,
      stats: {
        calls_7d: usageStats.total_calls,
        avg_latency: usageStats.avg_latency ? Math.round(usageStats.avg_latency) : null,
        tokens_7d: usageStats.total_tokens,
      },
    });
  } catch (error) {
    console.error('Model detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
