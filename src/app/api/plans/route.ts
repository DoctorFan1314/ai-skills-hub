import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { DBSubscriptionPlan, DBPlanModel } from '@/lib/db';

export async function GET() {
  try {
    const plans = db.prepare(
      'SELECT id, name, display_name, tagline, tier, monthly_price, yearly_price, currency, monthly_credits, first_purchase_discount, overage_rate_multiplier, max_concurrency, route_priority, off_peak_discount, support_level, popular FROM subscription_plans WHERE enabled = 1 ORDER BY tier ASC'
    ).all() as Omit<DBSubscriptionPlan, 'enabled' | 'created_at' | 'updated_at'>[];

    const planModels = db.prepare(
      'SELECT plan_id, model_name FROM plan_models WHERE enabled = 1'
    ).all() as Pick<DBPlanModel, 'plan_id' | 'model_name'>[];

    const modelsMap = new Map<number, string[]>();
    for (const pm of planModels) {
      if (!modelsMap.has(pm.plan_id)) modelsMap.set(pm.plan_id, []);
      modelsMap.get(pm.plan_id)!.push(pm.model_name);
    }

    const result = plans.map((plan) => ({
      ...plan,
      models: modelsMap.get(plan.id) || [],
    }));

    return NextResponse.json({ plans: result });
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
