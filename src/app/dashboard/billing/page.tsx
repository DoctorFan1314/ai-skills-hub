"use client";

import { useI18n } from "@/contexts/i18n-context";
import { BillingHistory } from "@/components/dashboard/billing-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Wallet, Plus } from "lucide-react";

const LABELS = {
  zh: { title: "账单中心", balance: "当前余额", recharge: "充值", pricing: "定价说明", free: "免费层", freeDesc: "注册赠送 $10 余额", pro: "按量付费", proDesc: "按实际 Token 用量扣费", enterprise: "企业定制", enterpriseDesc: "联系客服获取专属方案" },
  en: { title: "Billing", balance: "Current Balance", recharge: "Recharge", pricing: "Pricing", free: "Free Tier", freeDesc: "$10 bonus on registration", pro: "Pay as you go", proDesc: "Charged by actual token usage", enterprise: "Enterprise", enterpriseDesc: "Contact us for custom plans" },
};

export default function BillingPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const t = LABELS[lang];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{t.balance}</div>
              <div className="text-4xl font-bold font-mono">${(user?.balance || 0).toFixed(2)}</div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t.recharge}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base text-green-500">{t.free}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.freeDesc}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/50">
          <CardHeader>
            <CardTitle className="text-base text-primary">{t.pro}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.proDesc}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base text-yellow-500">{t.enterprise}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.enterpriseDesc}</p>
          </CardContent>
        </Card>
      </div>

      <BillingHistory lang={lang} />
    </div>
  );
}
