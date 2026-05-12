"use client";

import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface UsageLog {
  id: number;
  model: string;
  tokens_in: number;
  tokens_out: number;
  tokens_in_cache: number;
  tokens_cache_creation: number;
  cost: number;
  latency_ms: number | null;
  success: number;
  cached: number;
  created_at: string;
}

const LABELS = {
  zh: { title: "调用日志", model: "模型", tokensIn: "输入 Tokens", tokensOut: "输出 Tokens", tokensInCache: "缓存命中", tokensCacheCreate: "缓存创建", tokens: "总 Tokens", cost: "费用", latency: "延迟", status: "状态", success: "成功", failed: "失败", noLogs: "暂无调用记录", time: "时间" },
  en: { title: "Usage Logs", model: "Model", tokensIn: "Input Tokens", tokensOut: "Output Tokens", tokensInCache: "Cache Hit", tokensCacheCreate: "Cache Create", tokens: "Total Tokens", cost: "Cost", latency: "Latency", status: "Status", success: "Success", failed: "Failed", noLogs: "No usage logs yet", time: "Time" },
};

export default function UsagePage() {
  const { lang } = useI18n();
  const { formatPrice } = useCurrency();
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const t = LABELS[lang];

  useEffect(() => {
    fetch("/api/v1/billing/usage?limit=20", { credentials: "include" })
      .then(res => res.json())
      .then(d => { setLogs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{lang === "zh" ? "用量分析" : "Usage Analytics"}</h1>
      <UsageChart lang={lang} />

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 animate-pulse bg-muted rounded-lg" />
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">{t.noLogs}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">{t.model}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.tokensIn}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.tokensOut}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.tokensInCache}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.tokensCacheCreate}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.tokens}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.cost}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.latency}</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">{t.status}</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">{t.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/20 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono text-xs">{log.model}</td>
                      <td className="py-2 px-3 text-right font-mono">{log.tokens_in.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">{log.tokens_out.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">{log.tokens_in_cache ? log.tokens_in_cache.toLocaleString() : "-"}</td>
                      <td className="py-2 px-3 text-right font-mono">{log.tokens_cache_creation ? log.tokens_cache_creation.toLocaleString() : "-"}</td>
                      <td className="py-2 px-3 text-right font-mono">{(log.tokens_in + log.tokens_out).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatPrice(log.cost)}</td>
                      <td className="py-2 px-3 text-right font-mono">{log.latency_ms ? `${log.latency_ms}ms` : "-"}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${log.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {log.success ? t.success : t.failed}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
