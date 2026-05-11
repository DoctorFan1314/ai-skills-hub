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

    // Redeem the code
    const txn = db.transaction(() => {
      const result = addBalance(userId!, redeemCode.amount, 'gift', `Redeem code: ${redeemCode.code}`);
      if (!result.success) throw new Error(result.error);

      const newUses = redeemCode.current_uses + 1;
      db.prepare('UPDATE redeem_codes SET current_uses = ? WHERE id = ?').run(newUses, redeemCode.id);

      if (newUses >= redeemCode.max_uses) {
        db.prepare('UPDATE redeem_codes SET enabled = 0 WHERE id = ?').run(redeemCode.id);
      }

      return result.newBalance;
    });

    const newBalance = txn();

    return NextResponse.json({
      success: true,
      amount: redeemCode.amount,
      newBalance,
      code: redeemCode.code,
    });
  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ error: String(error).replace('Error: ', '') }, { status: 400 });
  }
}
