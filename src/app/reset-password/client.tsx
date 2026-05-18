"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useI18n();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !token) {
      setError(
        lang === "zh"
          ? "重置链接无效，请重新申请"
          : "Invalid reset link, please request a new one"
      );
      return;
    }

    if (!password) {
      setError(t.auth.fillAllFields);
      return;
    }

    if (password.length < 8) {
      setError(t.auth.passwordMinLength);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.auth.emailOrPasswordError);
        return;
      }

      setSuccess(true);
      toast(t.auth.resetPasswordSuccess, "success");

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Missing email/token from URL
  if (!email || !token) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t.auth.resetPassword}</h1>
            <p className="text-muted-foreground">
              {lang === "zh"
                ? "重置链接无效或已过期，请重新申请"
                : "Invalid or expired reset link. Please request a new one."}
            </p>
          </div>
          <div className="glass-card p-8 text-center">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t.auth.resetPassword}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center space-y-5">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
            <p className="text-foreground">{t.auth.resetPasswordSuccess}</p>
            <p className="text-sm text-muted-foreground">
              {lang === "zh" ? "即将跳转到登录页面..." : "Redirecting to login..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.auth.setNewPassword}</h1>
          <p className="text-muted-foreground">
            {lang === "zh" ? "为 {email} 设置新密码" : `Set a new password for ${email}`}
          </p>
        </div>
        <div className="glass-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="text-sm text-foreground mb-1.5 block">{t.auth.password}</label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm text-foreground mb-1.5 block">{t.auth.confirmPassword}</label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t.auth.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            {error && <p role="alert" className="text-sm text-red-400 text-center">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.auth.resetPassword}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-primary hover:underline">{t.auth.loginNow}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
