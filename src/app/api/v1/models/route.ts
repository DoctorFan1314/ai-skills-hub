import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import type { DBModelRate } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const models = db.prepare(
      'SELECT model_name, display_name, provider, input_rate, output_rate, cache_rate FROM model_rates WHERE enabled = 1'
    ).all() as DBModelRate[];

    const data = models.map(m => ({
      id: m.model_name,
      object: 'model',
      created: Math.floor(new Date(m.created_at).getTime() / 1000),
      owned_by: m.provider,
      display_name: m.display_name,
      pricing: {
        input: m.input_rate,
        output: m.output_rate,
        cache: m.cache_rate,
      },
    }));

    return NextResponse.json({
      object: 'list',
      data,
    });
  } catch (error) {
    console.error('Models list error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', type: 'server_error' } },
      { status: 500 }
    );
  }
}
