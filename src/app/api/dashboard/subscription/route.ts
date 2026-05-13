import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserFromCookie } from '@/lib/api-gateway';
import type { DBUserSubscription, DBSubscriptionPlan } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const subscriptions = db.prepare(
      `SELECT us.*, sp.name as plan_name, sp.display_name as plan_display_name, sp.tier as plan_tier, sp.monthly_credits as plan_monthly_credits,
              sp.overage_rate_multiplier as plan_overage_rate_multiplier, sp.support_level as plan_support_level,
              sp.monthly_price as plan_monthly_price, sp.yearly_price as plan_yearly_price, sp.currency as plan_currency
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = ?
       ORDER BY us.created_at DESC`
    ).all(auth.user.id) as (DBUserSubscription & { plan_name: string; plan_display_name: string; plan_tier: number; plan_monthly_credits: number; plan_overage_rate_multiplier: number; plan_support_level: string; plan_monthly_price: number; plan_yearly_price: number; plan_currency: string })[];

    // Sync credits_total with current plan credits for active subscriptions
    for (const sub of subscriptions) {
      if (sub.status === 'active' && sub.credits_total !== sub.plan_monthly_credits) {
        const diff = sub.plan_monthly_credits - sub.credits_total;
        db.prepare('UPDATE user_subscriptions SET credits_total = ?, credits_remaining = MAX(0, credits_remaining + ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(sub.plan_monthly_credits, diff, sub.id);
        sub.credits_total = sub.plan_monthly_credits;
        sub.credits_remaining = Math.max(0, sub.credits_remaining + diff);
      }
    }

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { subscription_id, action } = body;

    if (!subscription_id || !action) {
      return NextResponse.json({ error: 'subscription_id and action are required' }, { status: 400 });
    }

    const sub = db.prepare(
      "SELECT * FROM user_subscriptions WHERE id = ? AND user_id = ? AND status = 'active'"
    ).get(subscription_id, auth.user.id) as DBUserSubscription | undefined;

    if (!sub) {
      return NextResponse.json({ error: 'Active subscription not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      db.prepare(
        "UPDATE user_subscriptions SET status = 'cancelled', auto_renew = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(subscription_id);

      return NextResponse.json({ success: true, message: 'Subscription cancelled. It will remain active until the end of the current billing period.' });
    }

    if (action === 'toggle_auto_renew') {
      const newAutoRenew = sub.auto_renew ? 0 : 1;
      db.prepare(
        'UPDATE user_subscriptions SET auto_renew = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(newAutoRenew, subscription_id);

      return NextResponse.json({ success: true, auto_renew: newAutoRenew === 1 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}
