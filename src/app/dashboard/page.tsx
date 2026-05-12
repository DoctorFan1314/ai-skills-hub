"use client";

import { useI18n } from "@/contexts/i18n-context";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ModelAnalytics } from "@/components/dashboard/model-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

const LABELS = {
  zh: { title: "快速开始", description: "使用以下代码开始调用 OortAPI" },
  en: { title: "Quick Start", description: "Use the following code to start calling OortAPI" },
};

export default function DashboardPage() {
  const { lang } = useI18n();
  const t = LABELS[lang];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {lang === "zh" ? "控制台" : "Dashboard"}
      </h1>

      <StatsCards lang={lang} />
      <ModelAnalytics />

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
          <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono">
{`curl https://your-domain.com/api/v1/chat/completions \\
  -H "Authorization: Bearer sk-oort-YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
