"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("请填写所有字段");
      return;
    }
    const ok = await login(email, password);
    if (!ok) {
      setError("邮箱或密码错误");
      return;
    }
    toast("登录成功！", "success");
    router.push("/");
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">登录</h1>
          <p className="text-muted-foreground">欢迎回来，继续探索 AI 技能</p>
        </div>
        <div className="glass-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm text-foreground mb-1.5 block">邮箱</label>
              <Input id="email" type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm text-foreground">密码</label>
                <span className="text-xs text-muted-foreground/40 cursor-default">忘记密码？</span>
              </div>
              <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11">登录</Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-muted-foreground">或</span></div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" type="button" onClick={() => toast("OAuth 登录即将推出，敬请期待！")} className="w-full border-border text-foreground hover:bg-secondary">使用 Google 登录</Button>
            <Button variant="outline" type="button" onClick={() => toast("OAuth 登录即将推出，敬请期待！")} className="w-full border-border text-foreground hover:bg-secondary">使用 GitHub 登录</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            还没有账号？ <Link href="/register" className="text-primary hover:underline">免费注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
