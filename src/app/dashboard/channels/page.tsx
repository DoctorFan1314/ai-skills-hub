"use client";

import { useI18n } from "@/contexts/i18n-context";
import { ChannelCard } from "@/components/dashboard/channel-card";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface HealthSummary {
  channel_id: number;
  name: string;
  status: string;
  fail_count: number;
  total_calls_24h: number;
  success_rate_24h: number | null;
  avg_latency_24h: number | null;
}

const LABELS = {
  zh: {
    title: "渠道管理",
    overview: "健康概览",
    totalChannels: "渠道总数",
    online: "在线",
    offline: "离线",
    avgSuccessRate: "平均成功率",
    avgLatency: "平均延迟",
    totalCalls24h: "24h 总调用",
  },
  en: {
    title: "Channel Management",
    overview: "Health Overview",
    totalChannels: "Total Channels",
    online: "Online",
    offline: "Offline",
    avgSuccessRate: "Avg Success Rate",
    avgLatency: "Avg Latency",
    totalCalls24h: "24h Total Calls",
  },
};

export default function ChannelsPage() {
  const { lang } = useI18n();
  const t = LABELS[lang];
  const [health, setHealth] = useState<HealthSummary[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/channels?action=health", { credentials: "include" })
      .then(r => r.json())
      .then(d => setHealth(d.health || []))
      .catch(() => {});
  }, []);

  const totalChannels = health.length;
  const onlineCount = health.filter(h => h.status === "online").length;
  const offlineCount = health.filter(h => h.status === "offline").length;
  const totalCalls = health.reduce((s, h) => s + h.total_calls_24h, 0);
  const ratesWithData = health.filter(h => h.success_rate_24h !== null);
  const avgRate = ratesWithData.length > 0
    ? ratesWithData.reduce((s, h) => s + h.success_rate_24h!, 0) / ratesWithData.length
    : null;
  const latenciesWithData = health.filter(h => h.avg_latency_24h !== null);
  const avgLatency = latenciesWithData.length > 0
    ? Math.round(latenciesWithData.reduce((s, h) => s + h.avg_latency_24h!, 0) / latenciesWithData.length)
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {t.title}
      </h1>

      {/* Health overview cards */}
      {totalChannels > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.totalChannels}</p>
                <p className="text-lg font-bold font-mono">{totalChannels}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.online}</p>
                <p className="text-lg font-bold font-mono text-green-500">{onlineCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.offline}</p>
                <p className="text-lg font-bold font-mono text-red-500">{offlineCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.totalCalls24h}</p>
                <p className="text-lg font-bold font-mono">{totalCalls.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.avgSuccessRate}</p>
                <p className={`text-lg font-bold font-mono ${avgRate !== null && avgRate >= 95 ? "text-green-500" : avgRate !== null && avgRate >= 80 ? "text-yellow-500" : "text-red-500"}`}>
                  {avgRate !== null ? `${avgRate.toFixed(1)}%` : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">{t.avgLatency}</p>
                <p className="text-lg font-bold font-mono">{avgLatency !== null ? `${avgLatency}ms` : "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ChannelCard lang={lang} />
    </div>
  );
}
