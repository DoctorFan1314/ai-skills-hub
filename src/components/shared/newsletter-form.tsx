"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Mail } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

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

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">订阅成功！感谢关注</span>
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
