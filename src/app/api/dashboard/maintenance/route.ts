import { NextRequest, NextResponse } from 'next/server';
import { validateUserFromCookie } from '@/lib/api-gateway';
import { logAdminAction, processAutoRenewals } from '@/lib/billing-engine';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = validateUserFromCookie(request.headers.get('cookie'));
    if (!auth.valid || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, days } = await request.json();
    const retentionDays = Math.max(7, days || 90);

    let deleted = 0;

    if (action === 'cleanup_logs' || !action) {
      // Delete old usage logs
      const result = db.prepare(`DELETE FROM usage_logs WHERE created_at < datetime('now', '-${retentionDays} days')`).run();
      deleted += result.changes;

      // Delete old audit logs (keep longer — 180 days)
      const auditResult = db.prepare(`DELETE FROM audit_log WHERE created_at < datetime('now', '-180 days')`).run();
      deleted += auditResult.changes;

      // Delete old sessions (older than 7 days)
      const sessionResult = db.prepare("DELETE FROM sessions WHERE created_at < datetime('now', '-7 days')").run();
      deleted += sessionResult.changes;

      // Delete stale rate limit counters
      const rlResult = db.prepare("DELETE FROM rate_limit_counters WHERE window_start < ?").run(Date.now() - 300_000);
      deleted += rlResult.changes;
    }

    if (action === 'vacuum') {
      db.exec('VACUUM');
    }

    let renewResult = null;
    if (action === 'auto_renew') {
      renewResult = processAutoRenewals();
    }

    logAdminAction(auth.user.id, 'maintenance', 'system', undefined, `action=${action || 'cleanup_logs'}, days=${retentionDays}, deleted=${deleted}`, request.headers.get('x-forwarded-for')?.split(',')[0]?.trim());

    return NextResponse.json({ success: true, deleted, action: action || 'cleanup_logs', renew: renewResult });
  } catch (error) {
    console.error('Maintenance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
