"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyData {
  date: string;
  calls: number;
  cost: number;
  tokens: number;
}

const LABELS = {
  zh: { title: "近 7 天用量", calls: "调用次数", cost: "花费 ($)" },
  en: { title: "Last 7 Days Usage", calls: "Calls", cost: "Cost ($)" },
};

export function UsageChart({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [data, setData] = useState<DailyData[]>([]);
  const t = LABELS[lang];

  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d.daily_usage || []))
      .catch(() => {});
  }, []);

  const maxCalls = Math.max(...data.map(d => d.calls), 1);
  const maxCost = Math.max(...data.map(d => d.cost), 0.001);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            {lang === "zh" ? "暂无数据" : "No data yet"}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar chart for calls */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">{t.calls}</div>
              <div className="flex items-end gap-2 h-32">
                {data.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-mono text-muted-foreground">{d.calls}</div>
                    <div
                      className="w-full bg-primary/20 rounded-t-sm transition-all"
                      style={{ height: `${(d.calls / maxCalls) * 100}%`, minHeight: d.calls > 0 ? 4 : 0 }}
                    />
                    <div className="text-[10px] text-muted-foreground">{d.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Cost line */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">{t.cost}</div>
              <div className="flex items-center gap-2">
                {data.map((d) => (
                  <div key={d.date} className="flex-1 text-center">
                    <div className="text-xs font-mono">${d.cost.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
