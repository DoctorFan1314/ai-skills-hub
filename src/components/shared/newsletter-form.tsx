"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Mail, Settings } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useI18n } from "@/contexts/i18n-context";

export function NewsletterForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already subscribed on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.newsletter);
      if (raw) {
        const list: string[] = JSON.parse(raw);
        if (list.length > 0) {
          setSubscribed(true);
          setEmail(list[0]); // Show their subscribed email
        }
      }
    } catch { /* ignore */ }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setError("请输入邮箱"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("请输入有效的邮箱地址"); return; }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.newsletter);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(trimmed)) { setError("该邮箱已订阅"); return; }
      list.push(trimmed);
      localStorage.setItem(STORAGE_KEYS.newsletter, JSON.stringify(list));
    } catch { /* ignore */ }

    setSubscribed(true);
    setError("");
  }

  function handleUnsubscribe() {
    try {
      localStorage.removeItem(STORAGE_KEYS.newsletter);
    } catch { /* ignore */ }
    setSubscribed(false);
    setUnsubscribed(true);
    setEmail("");
    setShowManage(false);
  }

  if (unsubscribed) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm">{t.footer.unsubscribeDesc}</span>
      </div>
    );
  }

  if (subscribed && !showManage) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">订阅成功！感谢关注</span>
        </div>
        <button
          onClick={() => setShowManage(true)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-3 w-3" />
          {t.footer.managePreferences}
        </button>
      </div>
    );
  }

  if (showManage) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{email}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={handleUnsubscribe}
          >
            {t.footer.unsubscribe}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowManage(false)}
          >
            {t.common.cancel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <div className="flex-1 relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="输入邮箱订阅更新..."
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
        <Send className="h-4 w-4 mr-2" />订阅
      </Button>
      {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
    </form>
  );
}
