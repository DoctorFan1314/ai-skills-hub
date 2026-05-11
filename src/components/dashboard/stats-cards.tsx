"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, Key, Zap, Clock, CheckCircle } from "lucide-react";

interface StatsData {
  today: {
    calls: number;
    success_rate: number;
    cost: number;
    tokens: number;
    avg_latency: number;
  };
  month: {
    calls: number;
    cost: number;
    tokens: number;
  };
  active_keys: number;
  balance: number;
}

const LABELS = {
  zh: {
    todayCalls: "今日调用",
    successRate: "成功率",
    todayCost: "今日花费",
    avgLatency: "平均延迟",
    activeKeys: "活跃 Keys",
    balance: "余额",
  },
  en: {
    todayCalls: "Today's Calls",
    successRate: "Success Rate",
    todayCost: "Today's Cost",
    avgLatency: "Avg Latency",
    activeKeys: "Active Keys",
    balance: "Balance",
  },
};

export function StatsCards({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const t = LABELS[lang];

  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-16 mb-2" />
              <div className="h-8 bg-muted rounded w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { icon: Activity, label: t.todayCalls, value: stats.today.calls.toLocaleString(), color: "text-blue-500" },
    { icon: CheckCircle, label: t.successRate, value: `${stats.today.success_rate}%`, color: "text-green-500" },
    { icon: DollarSign, label: t.todayCost, value: `$${stats.today.cost.toFixed(4)}`, color: "text-orange-500" },
    { icon: Clock, label: t.avgLatency, value: `${stats.today.avg_latency}ms`, color: "text-purple-500" },
    { icon: Key, label: t.activeKeys, value: stats.active_keys.toString(), color: "text-cyan-500" },
    { icon: Zap, label: t.balance, value: `$${stats.balance.toFixed(2)}`, color: "text-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
