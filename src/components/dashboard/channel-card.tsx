"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ToggleLeft, ToggleRight, Radio } from "lucide-react";

interface Channel {
  id: number;
  name: string;
  type: string;
  base_url: string | null;
  weight: number;
  enabled: number;
  models: string;
  status: string;
  priority: number;
  fail_count: number;
  created_at: string;
}

const PROVIDER_LABELS: Record<string, { zh: string; en: string }> = {
  openai: { zh: "OpenAI", en: "OpenAI" },
  anthropic: { zh: "Anthropic", en: "Anthropic" },
  deepseek: { zh: "DeepSeek", en: "DeepSeek" },
  google: { zh: "Google Gemini", en: "Google Gemini" },
  alibaba: { zh: "阿里云", en: "Alibaba" },
  midjourney: { zh: "Midjourney", en: "Midjourney" },
  suno: { zh: "Suno", en: "Suno" },
};

const LABELS = {
  zh: {
    title: "渠道管理",
    add: "添加渠道",
    name: "名称",
    type: "类型",
    url: "Base URL",
    weight: "权重",
    priority: "优先级",
    apiKey: "API Key",
    models: "模型列表",
    status: "状态",
    online: "在线",
    offline: "离线",
    unknown: "未知",
    enabled: "已启用",
    disabled: "已禁用",
    fails: "失败次数",
    save: "保存",
    cancel: "取消",
    noChannels: "暂无渠道，点击上方按钮添加",
  },
  en: {
    title: "Channel Management",
    add: "Add Channel",
    name: "Name",
    type: "Type",
    url: "Base URL",
    weight: "Weight",
    priority: "Priority",
    apiKey: "API Key",
    models: "Models",
    status: "Status",
    online: "Online",
    offline: "Offline",
    unknown: "Unknown",
    enabled: "Enabled",
    disabled: "Disabled",
    fails: "Failures",
    save: "Save",
    cancel: "Cancel",
    noChannels: "No channels yet. Click above to add one.",
  },
};

export function ChannelCard({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "openai", api_key_encrypted: "", base_url: "", weight: 1, priority: 0, models: "" });
  const t = LABELS[lang];

  const fetchChannels = () => {
    fetch("/api/dashboard/channels", { credentials: "include" })
      .then(res => res.json())
      .then(d => { setChannels(d.channels || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useState(() => { fetchChannels(); });

  const createChannel = async () => {
    await fetch("/api/dashboard/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        models: form.models ? form.models.split(",").map(m => m.trim()) : [],
      }),
    });
    setShowForm(false);
    setForm({ name: "", type: "openai", api_key_encrypted: "", base_url: "", weight: 1, priority: 0, models: "" });
    fetchChannels();
  };

  const toggleChannel = async (id: number, enabled: boolean) => {
    await fetch("/api/dashboard/channels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, enabled }),
    });
    fetchChannels();
  };

  const deleteChannel = async (id: number) => {
    await fetch("/api/dashboard/channels", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    fetchChannels();
  };

  if (loading) return <div className="h-48 animate-pulse bg-muted rounded-lg" />;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t.title}</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" />
          {t.add}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 rounded-lg border border-border/50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">{t.name}</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-9 mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t.type}</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-9 mt-1 rounded-md border border-input bg-background px-3 text-sm">
                  {Object.entries(PROVIDER_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>{val[lang]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t.apiKey}</label>
              <Input type="password" value={form.api_key_encrypted} onChange={e => setForm(f => ({ ...f, api_key_encrypted: e.target.value }))} className="h-9 mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">{t.url}</label>
                <Input value={form.base_url} onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))} placeholder="https://api.openai.com" className="h-9 mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t.weight}</label>
                <Input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} className="h-9 mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t.priority}</label>
                <Input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))} className="h-9 mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t.models} ({lang === "zh" ? "逗号分隔，留空支持全部" : "comma separated, empty = all"})</label>
              <Input value={form.models} onChange={e => setForm(f => ({ ...f, models: e.target.value }))} placeholder="gpt-4o, claude-3-5-sonnet" className="h-9 mt-1" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={createChannel}>{t.save}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {channels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">{t.noChannels}</div>
        ) : (
          <div className="space-y-3">
            {channels.map((ch) => (
              <div key={ch.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                <Radio className={`h-5 w-5 shrink-0 ${ch.status === "online" ? "text-green-500" : ch.status === "offline" ? "text-red-500" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{ch.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{PROVIDER_LABELS[ch.type]?.[lang] || ch.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ch.enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {ch.enabled ? t.enabled : t.disabled}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ch.base_url || "default"} · {t.weight}: {ch.weight} · {t.priority}: {ch.priority} · {t.fails}: {ch.fail_count}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleChannel(ch.id, !ch.enabled)} className="text-muted-foreground hover:text-foreground">
                    {ch.enabled ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button onClick={() => deleteChannel(ch.id)} className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
