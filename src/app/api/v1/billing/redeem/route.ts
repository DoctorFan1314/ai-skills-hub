import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateApiKey } from '@/lib/api-gateway';
import { validateUserFromCookie } from '@/lib/api-gateway';
import { addBalance } from '@/lib/billing-engine';
import type { DBRedeemCode } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Accept both cookie auth and API key auth
    let userId: number | null = null;
    const cookieAuth = validateUserFromCookie(request.headers.get('cookie'));
    if (cookieAuth.valid && cookieAuth.user) {
      userId = cookieAuth.user.id;
    } else {
      const apiKeyAuth = validateApiKey(request.headers.get('authorization'));
      if (apiKeyAuth.valid && apiKeyAuth.user) {
        userId = apiKeyAuth.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Redeem code is required' }, { status: 400 });
    }

    const redeemCode = db.prepare(
      'SELECT * FROM redeem_codes WHERE code = ?'
    ).get(code.trim().toUpperCase()) as DBRedeemCode | undefined;

    if (!redeemCode) {
      return NextResponse.json({ error: 'Invalid redeem code' }, { status: 404 });
    }

    if (!redeemCode.enabled) {
      return NextResponse.json({ error: 'This code has been disabled' }, { status: 400 });
    }

    if (redeemCode.expires_at && new Date(redeemCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This code has expired' }, { status: 400 });
    }

    if (redeemCode.current_uses >= redeemCode.max_uses) {
      return NextResponse.json({ error: 'This code has been fully redeemed' }, { status: 400 });
    }

    // Redeem the code — atomic update to prevent race condition on max_uses
    if (redeemCode.code_type === 'subscription' && redeemCode.plan_id) {
      // Subscription redeem
      const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(redeemCode.plan_id) as { id: number; display_name: string; monthly_credits: number } | undefined;
      if (!plan) {
        return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
      }

      const txn = db.transaction(() => {
        // Atomic: only consume if uses remain (prevents TOCTOU race on max_uses)
        const update = db.prepare(
          'UPDATE redeem_codes SET current_uses = current_uses + 1 WHERE id = ? AND current_uses < max_uses'
        ).run(redeemCode.id);
        if (update.changes === 0) {
          throw new Error('Code has been fully redeemed');
        }

        // Re-read to check if we should disable
        const updated = db.prepare('SELECT current_uses, max_uses FROM redeem_codes WHERE id = ?').get(redeemCode.id) as { current_uses: number; max_uses: number };
        if (updated.current_uses >= updated.max_uses) {
          db.prepare('UPDATE redeem_codes SET enabled = 0 WHERE id = ?').run(redeemCode.id);
        }

        // Cancel any existing active subscription
        db.prepare("UPDATE user_subscriptions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'active'").run(userId);

        const duration = redeemCode.duration_months || 1;
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + duration);

        db.prepare(
          "INSERT INTO user_subscriptions (user_id, plan_id, billing_cycle, status, credits_remaining, credits_total, current_period_start, current_period_end, is_first_purchase, auto_renew) VALUES (?, ?, ?, 'active', ?, ?, datetime('now'), ?, 0, 0)"
        ).run(userId, plan.id, redeemCode.billing_cycle || 'monthly', plan.monthly_credits, plan.monthly_credits, periodEnd.toISOString());
      });
      txn();

      return NextResponse.json({
        success: true,
        codeType: 'subscription',
        planName: plan.display_name,
        credits: plan.monthly_credits,
        duration: redeemCode.duration_months || 1,
        code: redeemCode.code,
      });
    }

    // Balance redeem
    const txn = db.transaction(() => {
      // Atomic: only consume if uses remain (prevents TOCTOU race on max_uses)
      const update = db.prepare(
        'UPDATE redeem_codes SET current_uses = current_uses + 1 WHERE id = ? AND current_uses < max_uses'
      ).run(redeemCode.id);
      if (update.changes === 0) {
        throw new Error('Code has been fully redeemed');
      }

      const updated = db.prepare('SELECT current_uses, max_uses FROM redeem_codes WHERE id = ?').get(redeemCode.id) as { current_uses: number; max_uses: number };
      if (updated.current_uses >= updated.max_uses) {
        db.prepare('UPDATE redeem_codes SET enabled = 0 WHERE id = ?').run(redeemCode.id);
      }

      const result = addBalance(userId!, redeemCode.amount, 'gift', `Redeem code: ${redeemCode.code}`);
      if (!result.success) throw new Error(result.error);

      return result.newBalance;
    });

    const newBalance = txn();

    return NextResponse.json({
      success: true,
      codeType: 'balance',
      amount: redeemCode.amount,
      newBalance,
      code: redeemCode.code,
    });
  } catch (error) {
    console.error('Redeem error:', error);
    const message = error instanceof Error && error.message.startsWith('Code ') ? error.message : 'Redemption failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
