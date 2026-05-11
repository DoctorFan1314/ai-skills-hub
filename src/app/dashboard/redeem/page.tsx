"use client";

import { useI18n } from "@/contexts/i18n-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { Gift, Loader2, Plus, Trash2, Copy, Check } from "lucide-react";

interface RedeemCode {
  id: number;
  code: string;
  amount: number;
  enabled: number;
  max_uses: number;
  current_uses: number;
  created_at: string;
  expires_at: string | null;
}

const LABELS = {
  zh: {
    title: "兑换码管理", generate: "生成兑换码", amount: "面额 ($)", count: "数量", maxUses: "最大使用次数",
    expiresAt: "过期时间 (可选)", create: "创建", cancel: "取消",
    code: "兑换码", uses: "使用情况", status: "状态", created: "创建时间", expires: "过期时间", actions: "操作",
    active: "有效", inactive: "已禁用", expired: "已过期", exhausted: "已用完",
    disable: "禁用", enable: "启用", delete: "删除",
    noCodes: "暂无兑换码", deleteConfirm: "确定要删除此兑换码吗？",
    copyAll: "复制全部", copied: "已复制!", batchResult: "批量生成结果",
  },
  en: {
    title: "Redeem Codes", generate: "Generate Codes", amount: "Amount ($)", count: "Count", maxUses: "Max Uses",
    expiresAt: "Expires At (optional)", create: "Create", cancel: "Cancel",
    code: "Code", uses: "Uses", status: "Status", created: "Created", expires: "Expires", actions: "Actions",
    active: "Active", inactive: "Disabled", expired: "Expired", exhausted: "Exhausted",
    disable: "Disable", enable: "Enable", delete: "Delete",
    noCodes: "No redeem codes yet", deleteConfirm: "Delete this redeem code?",
    copyAll: "Copy All", copied: "Copied!", batchResult: "Batch Result",
  },
};

export default function RedeemPage() {
  const { lang } = useI18n();
  const t = LABELS[lang];
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Generate dialog
  const [genOpen, setGenOpen] = useState(false);
  const [genAmount, setGenAmount] = useState("10");
  const [genCount, setGenCount] = useState("5");
  const [genMaxUses, setGenMaxUses] = useState("1");
  const [genExpires, setGenExpires] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/redeem?page=${page}&limit=50`, { credentials: "include" });
      const data = await res.json();
      setCodes(data.codes || []);
      setHasMore(data.has_more || false);
    } catch { /* ignore */ }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  async function handleGenerate() {
    setGenLoading(true);
    setGenResult([]);
    try {
      const res = await fetch("/api/dashboard/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(genAmount),
          count: parseInt(genCount, 10),
          maxUses: parseInt(genMaxUses, 10),
          expiresAt: genExpires || undefined,
        }),
      });
      const data = await res.json();
      if (data.codes) {
        setGenResult(data.codes);
        fetchCodes();
      }
    } catch { /* ignore */ }
    setGenLoading(false);
  }

  async function handleToggle(id: number, enabled: number) {
    await fetch("/api/dashboard/redeem", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, enabled: !enabled }),
    });
    fetchCodes();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    await fetch("/api/dashboard/redeem", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteLoading(false);
    setDeleteId(null);
    fetchCodes();
  }

  function copyAll() {
    navigator.clipboard.writeText(genResult.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getStatus(code: RedeemCode) {
    if (!code.enabled) return { label: t.inactive, cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    if (code.expires_at && new Date(code.expires_at) < new Date()) return { label: t.expired, cls: "bg-red-500/10 text-red-400 border-red-500/20" };
    if (code.current_uses >= code.max_uses) return { label: t.exhausted, cls: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
    return { label: t.active, cls: "bg-green-500/10 text-green-400 border-green-500/20" };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6" />{t.title}</h1>
        <Button onClick={() => { setGenOpen(true); setGenResult([]); }} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />{t.generate}
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="h-48 animate-pulse bg-muted rounded-lg m-6" />
          ) : codes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">{t.noCodes}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t.code}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.amount}</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">{t.uses}</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">{t.status}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.expires}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => {
                    const st = getStatus(c);
                    return (
                      <tr key={c.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono text-xs">{c.code}</td>
                        <td className="py-3 px-4 text-right font-mono">${c.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center text-xs">{c.current_uses}/{c.max_uses}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={st.cls}>{st.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-muted-foreground">
                          {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => handleToggle(c.id, c.enabled)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs" title={c.enabled ? t.disable : t.enable}>
                              {c.enabled ? t.disable : t.enable}
                            </button>
                            <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title={t.delete}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {(page > 1 || hasMore) && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</Button>
          <span className="text-sm text-muted-foreground py-1.5">Page {page}</span>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage(p => p + 1)}>→</Button>
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={genOpen} onOpenChange={(open) => { if (!open) { setGenOpen(false); setGenResult([]); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.generate}</DialogTitle>
          </DialogHeader>
          {genResult.length === 0 ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">{t.amount}</label>
                  <Input type="number" min="0.01" step="0.01" value={genAmount} onChange={(e) => setGenAmount(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">{t.count}</label>
                  <Input type="number" min="1" max="100" value={genCount} onChange={(e) => setGenCount(e.target.value)} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">{t.maxUses}</label>
                  <Input type="number" min="1" value={genMaxUses} onChange={(e) => setGenMaxUses(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">{t.expiresAt}</label>
                  <Input type="datetime-local" value={genExpires} onChange={(e) => setGenExpires(e.target.value)} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setGenOpen(false)}>{t.cancel}</Button>
                <Button onClick={handleGenerate} disabled={genLoading}>{genLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.create}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t.batchResult} ({genResult.length})</p>
                <Button variant="outline" size="sm" onClick={copyAll}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t.copied : t.copyAll}
                </Button>
              </div>
              <div className="bg-secondary rounded-lg p-3 max-h-60 overflow-y-auto">
                {genResult.map((c, i) => (
                  <div key={i} className="font-mono text-sm py-0.5">{c}</div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => { setGenOpen(false); setGenResult([]); }}>{t.cancel}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.delete}</DialogTitle>
            <DialogDescription>{t.deleteConfirm}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t.cancel}</Button>
            <Button onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 text-white hover:bg-red-700">
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.delete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
