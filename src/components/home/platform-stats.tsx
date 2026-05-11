"use client";

import { Activity, CheckCircle, Clock, Zap } from "lucide-react";

export function PlatformStats({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const stats = [
    { icon: Activity, value: "10M+", label: lang === "zh" ? "总调用量" : "Total API Calls" },
    { icon: CheckCircle, value: "99.9%", label: lang === "zh" ? "可用率" : "Uptime" },
    { icon: Clock, value: "<200ms", label: lang === "zh" ? "平均延迟" : "Avg Latency" },
    { icon: Zap, value: "30+", label: lang === "zh" ? "支持模型" : "Models" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <s.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold font-mono mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
