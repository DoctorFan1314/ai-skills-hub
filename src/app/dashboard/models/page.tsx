"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/contexts/auth-context";
import { useCurrency } from "@/contexts/currency-context";
import { Pencil, Save, X, RefreshCw, Search, DollarSign, Cpu } from "lucide-react";

interface ChannelModel {
  model_name: string;
  provider: string;
  channel_name: string;
  channel_id: number;
  enabled: number;
  input_rate: number;
  output_rate: number;
  cache_rate: number;
  cache_creation_rate: number;
  rate_id: number | null;
  display_name: string | null;
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: "bg-green-500/10 text-green-500 border-green-500/20",
  anthropic: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  deepseek: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  google: "bg-red-500/10 text-red-500 border-red-500/20",
  alibaba: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  unknown: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const PROVIDER_ICONS: Record<string, string> = {
  openai: "O",
  anthropic: "A",
  deepseek: "D",
  google: "G",
  alibaba: "Q",
};

const LABELS = {
  zh: {
    title: "模型市场",
    subtitle: "渠道中配置的可用模型",
    inputPrice: "输入价格",
    outputPrice: "补全价格",
    cacheRead: "缓存读取",
    cacheCreate: "缓存创建",
    channel: "渠道",
    enabled: "可用",
    disabled: "不可用",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    noModels: "暂无模型，请先在渠道管理中配置模型并同步",
    adminHint: "管理员可设置模型使用价格",
    userHint: "以下是渠道中可用的 AI 模型",
    perMillion: "/1M tokens",
    setPrice: "设置价格",
    syncing: "同步中...",
    syncAll: "同步所有渠道",
    noRate: "未定价",
    search: "搜索模型、供应商、渠道...",
    all: "全部",
    displayName: "显示名称",
    usdSwitch: "$ USD",
    cnySwitch: "¥ CNY",
  },
  en: {
    title: "Model Marketplace",
    subtitle: "Available models from configured channels",
    inputPrice: "Input",
    outputPrice: "Output",
    cacheRead: "Cache Read",
    cacheCreate: "Cache Write",
    channel: "Channel",
    enabled: "Available",
    disabled: "Unavailable",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    noModels: "No models available. Please configure and sync models in channel management first.",
    adminHint: "Admins can set model pricing",
    userHint: "Available AI models from channels",
    perMillion: "/1M tokens",
    setPrice: "Set Price",
    syncing: "Syncing...",
    syncAll: "Sync All Channels",
    noRate: "No pricing",
    search: "Search models, providers, channels...",
    all: "All",
    displayName: "Display Name",
    usdSwitch: "$ USD",
    cnySwitch: "¥ CNY",
  },
};

export default function ModelsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { currency, setCurrency, formatPrice, symbol, exchangeRate } = useCurrency();
  const isAdmin = user?.role === "admin";
  const t = LABELS[lang];

  const [models, setModels] = useState<ChannelModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ input_rate: 0, output_rate: 0, cache_rate: 0, cache_creation_rate: 0, display_name: "" });
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
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
      cache_creation_rate: m.cache_creation_rate,
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

  const filtered = models.filter((m) => {
    const matchesSearch = !search ||
      m.model_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.channel_name.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === "all" || m.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const providers = [...new Set(models.map(m => m.provider))].sort();

  const formatRate = (rate: number) => {
    if (currency === "CNY") {
      return `¥${(rate * exchangeRate).toFixed(2)}`;
    }
    return `$${rate.toFixed(4)}`;
  };

  if (loading) return <div className="h-48 animate-pulse bg-muted rounded-lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isAdmin ? t.adminHint : t.userHint}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Currency toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                currency === "USD" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.usdSwitch}
            </button>
            <button
              onClick={() => setCurrency("CNY")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                currency === "CNY" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.cnySwitch}
            </button>
          </div>
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={syncAllChannels} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? t.syncing : t.syncAll}
            </Button>
          )}
        </div>
      </div>

      {/* Search + Provider Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setProviderFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              providerFilter === "all" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {t.all}
          </button>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setProviderFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                providerFilter === p ? `${PROVIDER_COLORS[p] || PROVIDER_COLORS.unknown}` : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">{t.noModels}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Card key={`${m.model_name}-${m.channel_id}`} className={`glass-card overflow-hidden transition-all hover:shadow-md ${!m.enabled ? "opacity-50" : ""}`}>
              <CardContent className="p-0">
                {editingModel === m.model_name && isAdmin ? (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">{t.displayName}</label>
                      <Input value={editForm.display_name} onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))} className="h-8 mt-1 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">{t.inputPrice} ({symbol}/1M)</label>
                        <Input type="number" step="0.0001" value={editForm.input_rate} onChange={(e) => setEditForm((f) => ({ ...f, input_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t.outputPrice} ({symbol}/1M)</label>
                        <Input type="number" step="0.0001" value={editForm.output_rate} onChange={(e) => setEditForm((f) => ({ ...f, output_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t.cacheRead} ({symbol}/1M)</label>
                        <Input type="number" step="0.0001" value={editForm.cache_rate} onChange={(e) => setEditForm((f) => ({ ...f, cache_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t.cacheCreate} ({symbol}/1M)</label>
                        <Input type="number" step="0.0001" value={editForm.cache_creation_rate} onChange={(e) => setEditForm((f) => ({ ...f, cache_creation_rate: Number(e.target.value) }))} className="h-8 mt-1 text-xs" />
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
                  <>
                    {/* Card Header */}
                    <div className="px-4 pt-4 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${PROVIDER_COLORS[m.provider] || PROVIDER_COLORS.unknown}`}>
                          {m.provider.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${m.enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {m.enabled ? t.enabled : t.disabled}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm font-mono truncate" title={m.model_name}>
                          {m.display_name && m.display_name !== m.model_name ? m.display_name : m.model_name}
                        </span>
                      </div>
                      {m.display_name && m.display_name !== m.model_name && (
                        <div className="text-xs text-muted-foreground font-mono mt-1 ml-6 truncate" title={m.model_name}>
                          {m.model_name}
                        </div>
                      )}
                    </div>

                    {/* Price Grid */}
                    {m.rate_id ? (
                      <div className="grid grid-cols-2 gap-px bg-border/30 mx-4 rounded-lg overflow-hidden">
                        <PriceCell label={t.inputPrice} rate={m.input_rate} formatRate={formatRate} perMillion={t.perMillion} />
                        <PriceCell label={t.outputPrice} rate={m.output_rate} formatRate={formatRate} perMillion={t.perMillion} />
                        <PriceCell label={t.cacheRead} rate={m.cache_rate} formatRate={formatRate} perMillion={t.perMillion} />
                        <PriceCell label={t.cacheCreate} rate={m.cache_creation_rate} formatRate={formatRate} perMillion={t.perMillion} />
                      </div>
                    ) : (
                      <div className="mx-4 mb-3">
                        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">{t.noRate}</span>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="px-4 py-3 flex items-center justify-between border-t border-border/30 mt-3">
                      <span className="text-xs text-muted-foreground">{t.channel}: {m.channel_name}</span>
                      {isAdmin && (
                        <button onClick={() => startEdit(m)} className="text-muted-foreground hover:text-blue-500 transition-colors" title={t.setPrice}>
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PriceCell({ label, rate, formatRate, perMillion }: { label: string; rate: number; formatRate: (r: number) => string; perMillion: string }) {
  return (
    <div className="bg-card p-2.5">
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-mono font-medium">
        {rate > 0 ? formatRate(rate) : "-"}
        {rate > 0 && <span className="text-xs text-muted-foreground font-normal ml-0.5">{perMillion}</span>}
      </div>
    </div>
  );
}
