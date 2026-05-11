"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/contexts/auth-context";
import { Pencil, Save, X, DollarSign, RefreshCw } from "lucide-react";

interface ChannelModel {
  model_name: string;
  provider: string;
  channel_name: string;
  channel_id: number;
  enabled: number;
  input_rate: number;
  output_rate: number;
  cache_rate: number;
  rate_id: number | null;
  display_name: string | null;
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: "bg-green-500/10 text-green-500",
  anthropic: "bg-orange-500/10 text-orange-500",
  deepseek: "bg-blue-500/10 text-blue-500",
  google: "bg-red-500/10 text-red-500",
  alibaba: "bg-purple-500/10 text-purple-500",
  unknown: "bg-gray-500/10 text-gray-500",
};

const LABELS = {
  zh: {
    title: "模型市场",
    subtitle: "渠道中配置的可用模型",
    model: "模型",
    provider: "供应商",
    channel: "渠道",
    inputPrice: "输入价格",
    outputPrice: "输出价格",
    cachePrice: "缓价",
    status: "状态",
    enabled: "可用",
    disabled: "不可用",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    noModels: "暂无模型，请先在渠道管理中配置模型并同步",
    adminHint: "管理员可设置模型使用价格（$/百万tokens）",
    userHint: "以下是渠道中可用的 AI 模型",
    perMillion: "/百万tokens",
    setPrice: "设置价格",
    syncing: "同步中...",
    syncAll: "同步所有渠道",
    synced: "已同步",
    noRate: "未定价",
  },
  en: {
    title: "Model Marketplace",
    subtitle: "Available models from configured channels",
    model: "Model",
    provider: "Provider",
    channel: "Channel",
    inputPrice: "Input Price",
    outputPrice: "Output Price",
    cachePrice: "Cache Price",
    status: "Status",
    enabled: "Available",
    disabled: "Unavailable",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    noModels: "No models available. Please configure and sync models in channel management first.",
    adminHint: "Admins can set model pricing ($/million tokens)",
    userHint: "Available AI models from channels",
    perMillion: "/1M tokens",
    setPrice: "Set Price",
    syncing: "Syncing...",
    syncAll: "Sync All Channels",
    synced: "Synced",
    noRate: "No pricing",
  },
};

export default function ModelsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const t = LABELS[lang];

  const [models, setModels] = useState<ChannelModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ input_rate: 0, output_rate: 0, cache_rate: 0, display_name: "" });
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const fetchModels = () => {
    fetch("/api/dashboard/models?source=channels", { credentials: "include" })
      .then((res) => res.json())
      .then((d) => { setModels(d.models || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchModels(); }, []);

  const syncAllChannels = async () => {
    setSyncing(true);
    // Get all channels and sync each
    const chRes = await fetch("/api/dashboard/channels", { credentials: "include" });
    const chData = await chRes.json();
    const channels = chData.channels || [];
    for (const ch of channels) {
      if (ch.enabled) {
        await fetch("/api/dashboard/channels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "sync-models", id: ch.id }),
        });
      }
    }
    setSyncing(false);
    fetchModels();
  };

  const startEdit = (m: ChannelModel) => {
    setEditingModel(m.model_name);
    setEditForm({
      input_rate: m.input_rate,
      output_rate: m.output_rate,
      cache_rate: m.cache_rate,
      display_name: m.display_name || m.model_name,
    });
  };

  const savePrice = async (modelName: string) => {
    await fetch("/api/dashboard/models", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ model_name: modelName, ...editForm }),
    });
    setEditingModel(null);
    fetchModels();
  };

  const filtered = models.filter((m) =>
    m.model_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase()) ||
    m.channel_name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by provider
  const grouped = filtered.reduce<Record<string, ChannelModel[]>>((acc, m) => {
    (acc[m.provider] ||= []).push(m);
    return acc;
  }, {});

  if (loading) return <div className="h-48 animate-pulse bg-muted rounded-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isAdmin ? t.adminHint : t.userHint}</p>
        </div>
        {isAdmin && (
          <Button size="sm" variant="outline" onClick={syncAllChannels} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? t.syncing : t.syncAll}
          </Button>
        )}
      </div>

      <Input
        placeholder={lang === "zh" ? "搜索模型、供应商、渠道..." : "Search models, providers, channels..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">{t.noModels}</div>
      ) : (
        Object.entries(grouped).map(([provider, providerModels]) => (
          <div key={provider}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PROVIDER_COLORS[provider] || PROVIDER_COLORS.unknown}`}>
                {provider.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">{providerModels.length} {lang === "zh" ? "个模型" : "models"}</span>
            </div>
            <div className="grid gap-2">
              {providerModels.map((m) => (
                <Card key={`${m.model_name}-${m.channel_id}`} className={`glass-card ${!m.enabled ? "opacity-50" : ""}`}>
                  <CardContent className="p-4">
                    {editingModel === m.model_name && isAdmin ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground">显示名称</label>
                            <Input value={editForm.display_name} onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))} className="h-8 mt-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">{t.inputPrice} ($/1M)</label>
                            <Input type="number" step="0.0001" value={editForm.input_rate} onChange={(e) => setEditForm((f) => ({ ...f, input_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">{t.outputPrice} ($/1M)</label>
                            <Input type="number" step="0.0001" value={editForm.output_rate} onChange={(e) => setEditForm((f) => ({ ...f, output_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">{t.cachePrice} ($/1M)</label>
                            <Input type="number" step="0.0001" value={editForm.cache_rate} onChange={(e) => setEditForm((f) => ({ ...f, cache_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => savePrice(m.model_name)}>
                            <Save className="h-3.5 w-3.5 mr-1" />{t.save}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingModel(null)}>
                            <X className="h-3.5 w-3.5 mr-1" />{t.cancel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm font-mono">{m.model_name}</span>
                            {m.display_name && m.display_name !== m.model_name && (
                              <span className="text-xs text-muted-foreground">({m.display_name})</span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${m.enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                              {m.enabled ? t.enabled : t.disabled}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{t.channel}: {m.channel_name}</span>
                            {m.rate_id ? (
                              <>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {t.inputPrice}: ${m.input_rate.toFixed(4)}{t.perMillion}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {t.outputPrice}: ${m.output_rate.toFixed(4)}{t.perMillion}
                                </span>
                              </>
                            ) : (
                              <span className="text-yellow-500">{t.noRate}</span>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <button onClick={() => startEdit(m)} className="text-muted-foreground hover:text-blue-500" title={t.setPrice}>
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
