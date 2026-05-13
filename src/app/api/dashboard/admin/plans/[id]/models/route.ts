import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import type { DBPlanModel } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const models = db.prepare(
      'SELECT * FROM plan_models WHERE plan_id = ? ORDER BY model_name ASC'
    ).all(id) as DBPlanModel[];

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Failed to fetch plan models:', error);
    return NextResponse.json({ error: 'Failed to fetch plan models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { model_name, enabled = 1 } = body;

    if (!model_name) {
      return NextResponse.json({ error: 'model_name is required' }, { status: 400 });
    }

    // Check plan exists
    const plan = db.prepare('SELECT id FROM subscription_plans WHERE id = ?').get(id);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    try {
      db.prepare(
        'INSERT INTO plan_models (plan_id, model_name, enabled) VALUES (?, ?, ?)'
      ).run(id, model_name, enabled ? 1 : 0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('UNIQUE')) {
        // Update existing
        db.prepare(
          'UPDATE plan_models SET enabled = ? WHERE plan_id = ? AND model_name = ?'
        ).run(enabled ? 1 : 0, id, model_name);
      } else {
        throw e;
      }
    }

    const model = db.prepare(
      'SELECT * FROM plan_models WHERE plan_id = ? AND model_name = ?'
    ).get(id, model_name) as DBPlanModel;

    return NextResponse.json({ model }, { status: 201 });
  } catch (error) {
    console.error('Failed to add plan model:', error);
    return NextResponse.json({ error: 'Failed to add plan model' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');

    if (!model) {
      return NextResponse.json({ error: 'model query param is required' }, { status: 400 });
    }

    const result = db.prepare(
      'DELETE FROM plan_models WHERE plan_id = ? AND model_name = ?'
    ).run(id, model);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Model binding not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete plan model:', error);
    return NextResponse.json({ error: 'Failed to delete plan model' }, { status: 500 });
  }
}
