"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Gift } from "lucide-react";

interface BillingRecord {
  id: number;
  amount: number;
  type: string;
  description: string | null;
  balance_after: number | null;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof ArrowUpRight; color: string; zh: string; en: string }> = {
  recharge: { icon: ArrowDownLeft, color: "text-green-500", zh: "充值", en: "Recharge" },
  deduct: { icon: ArrowUpRight, color: "text-red-500", zh: "扣费", en: "Deduct" },
  refund: { icon: RefreshCw, color: "text-blue-500", zh: "退款", en: "Refund" },
  gift: { icon: Gift, color: "text-yellow-500", zh: "赠送", en: "Gift" },
};

const LABELS = {
  zh: { title: "账单记录", noRecords: "暂无账单记录", balance: "余额" },
  en: { title: "Billing History", noRecords: "No billing records yet", balance: "Balance" },
};

export function BillingHistory({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const t = LABELS[lang];

  useEffect(() => {
    fetch("/api/dashboard/billing", { credentials: "include" })
      .then(res => res.json())
      .then(d => { setRecords(d.records || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 animate-pulse bg-muted rounded-lg" />;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">{t.noRecords}</div>
        ) : (
          <div className="space-y-2">
            {records.map((r) => {
              const config = TYPE_CONFIG[r.type] || TYPE_CONFIG.deduct;
              const Icon = config.icon;
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Icon className={`h-4 w-4 ${config.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{r.description || config[lang]}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.created_at + "Z").toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm ${r.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {r.amount > 0 ? "+" : ""}{r.amount.toFixed(4)}
                    </div>
                    {r.balance_after !== null && (
                      <div className="text-xs text-muted-foreground">{t.balance}: ${r.balance_after.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
