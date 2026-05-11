import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import type { DBModelRate, DBChannel } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const source = request.nextUrl.searchParams.get('source');

    if (source === 'channels') {
      // Return models aggregated from enabled channels, joined with pricing
      const channels = db.prepare(
        'SELECT id, name, type, models, enabled FROM channels WHERE enabled = 1'
      ).all() as Pick<DBChannel, 'id' | 'name' | 'type' | 'models' | 'enabled'>[];

      const modelMap = new Map<string, {
        model_name: string;
        provider: string;
        channel_name: string;
        channel_id: number;
        enabled: number;
        input_rate: number;
        output_rate: number;
        cache_rate: number;
        rate_id: number | null;
        display_name: string | null;
      }>();

      for (const ch of channels) {
        const models: string[] = JSON.parse(ch.models || '[]');
        for (const modelName of models) {
          if (modelName === '*') continue;
          if (!modelMap.has(modelName)) {
            // Check if there's pricing info
            const rate = db.prepare(
              'SELECT id, display_name, input_rate, output_rate, cache_rate, enabled FROM model_rates WHERE model_name = ?'
            ).get(modelName) as Pick<DBModelRate, 'id' | 'display_name' | 'input_rate' | 'output_rate' | 'cache_rate' | 'enabled'> | undefined;

            modelMap.set(modelName, {
              model_name: modelName,
              provider: ch.type,
              channel_name: ch.name,
              channel_id: ch.id,
              enabled: rate ? rate.enabled : 1,
              input_rate: rate?.input_rate ?? 0,
              output_rate: rate?.output_rate ?? 0,
              cache_rate: rate?.cache_rate ?? 0,
              rate_id: rate?.id ?? null,
              display_name: rate?.display_name ?? null,
            });
          }
        }
      }

      const models = [...modelMap.values()].sort((a, b) => a.provider.localeCompare(b.provider) || a.model_name.localeCompare(b.model_name));
      return NextResponse.json({ models });
    }

    // Default: return from model_rates table
    const query = auth.user.role === 'admin'
      ? 'SELECT * FROM model_rates ORDER BY provider, model_name'
      : 'SELECT * FROM model_rates WHERE enabled = 1 ORDER BY provider, model_name';

    const models = db.prepare(query).all() as DBModelRate[];
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Model rates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();

    // Support updating by model_name (from marketplace page) or by id
    if (body.model_name && !body.id) {
      const existing = db.prepare('SELECT id FROM model_rates WHERE model_name = ?').get(body.model_name) as { id: number } | undefined;
      if (existing) {
        body.id = existing.id;
      } else {
        // Create new rate entry
        const result = db.prepare(
          'INSERT INTO model_rates (model_name, display_name, provider, input_rate, output_rate, cache_rate) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(body.model_name, body.display_name || body.model_name, body.provider || 'unknown', body.input_rate || 0, body.output_rate || 0, body.cache_rate || 0);
        body.id = result.lastInsertRowid;
      }
    }

    const { id, display_name, input_rate, output_rate, cache_rate, enabled } = body;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const updates: string[] = [];
    const values: unknown[] = [];
    if (display_name !== undefined) { updates.push('display_name = ?'); values.push(display_name); }
    if (input_rate !== undefined) { updates.push('input_rate = ?'); values.push(input_rate); }
    if (output_rate !== undefined) { updates.push('output_rate = ?'); values.push(output_rate); }
    if (cache_rate !== undefined) { updates.push('cache_rate = ?'); values.push(cache_rate); }
    if (enabled !== undefined) { updates.push('enabled = ?'); values.push(enabled ? 1 : 0); }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE model_rates SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const model = db.prepare('SELECT * FROM model_rates WHERE id = ?').get(id);
    return NextResponse.json({ model });
  } catch (error) {
    console.error('Model rate update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { model_name, display_name, provider, input_rate, output_rate, cache_rate } = await request.json();
    if (!model_name) return NextResponse.json({ error: 'model_name is required' }, { status: 400 });

    const existing = db.prepare('SELECT id FROM model_rates WHERE model_name = ?').get(model_name);
    if (existing) {
      return NextResponse.json({ error: 'Model already exists' }, { status: 409 });
    }

    const result = db.prepare(
      'INSERT INTO model_rates (model_name, display_name, provider, input_rate, output_rate, cache_rate) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(model_name, display_name || model_name, provider || 'unknown', input_rate || 0, output_rate || 0, cache_rate || 0);

    const model = db.prepare('SELECT * FROM model_rates WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ model });
  } catch (error) {
    console.error('Model rate create error:', error);
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
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    db.prepare('DELETE FROM model_rates WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Model rate delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
