"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { Mail, KeyRound, Loader2 } from "lucide-react";

function safeReturnUrl(url: string | null): string {
  if (!url || !url.startsWith("/") || url.includes("://")) return "/";
  return url;
}

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // Forgot password dialog state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "confirm" | "reset">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError(t.auth.fillAllFields);
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || t.auth.emailOrPasswordError);
      return;
    }
    toast(t.auth.loginSuccess, "success");
    const returnUrl = searchParams.get("returnUrl");
    router.push(safeReturnUrl(returnUrl));
  }

  function handleOpenForgot() {
    setForgotStep("email");
    setForgotEmail("");
    setNewPw("");
    setConfirmPw("");
    setForgotError("");
    setForgotOpen(true);
  }

  function handleVerifyEmail() {
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError(t.auth.fillAllFields);
      return;
    }
    // Rate limiting: check cooldown
    const lastReset = parseInt(localStorage.getItem(STORAGE_KEYS.lastPasswordReset) || "0", 10);
    const elapsed = Date.now() - lastReset;
    if (elapsed < 60000) {
      const remaining = Math.ceil((60000 - elapsed) / 1000);
      setResetCooldown(remaining);
      setForgotError(t.auth.resetPasswordRateLimit.replace("{seconds}", String(remaining)));
      return;
    }
    setForgotStep("confirm");
  }

  function handleConfirmReset() {
    setForgotStep("reset");
  }

  async function handleResetPassword() {
    setForgotError("");
    if (!newPw || !confirmPw) {
      setForgotError(t.auth.fillAllFields);
      return;
    }
    if (newPw.length < 8) {
      setForgotError(t.auth.passwordMinLength);
      return;
    }
    if (newPw !== confirmPw) {
      setForgotError(t.auth.passwordMismatch);
      return;
    }
    setForgotLoading(true);
    const ok = await resetPassword(forgotEmail.trim(), newPw);
    setForgotLoading(false);
    if (!ok) {
      setForgotError(t.auth.emailNotFound);
      return;
    }
    // Record last password reset timestamp for rate limiting
    try { localStorage.setItem(STORAGE_KEYS.lastPasswordReset, String(Date.now())); } catch { /* ignore */ }
    toast(t.auth.resetPasswordSuccess, "success");
    setForgotOpen(false);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.auth.loginTitle}</h1>
          <p className="text-muted-foreground">{t.auth.welcomeBack}</p>
        </div>
        <div className="glass-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm text-foreground mb-1.5 block">{t.auth.email}</label>
              <Input id="email" type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm text-foreground">{t.auth.password}</label>
                <button type="button" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors cursor-pointer" onClick={handleOpenForgot}>{t.auth.forgotPassword}</button>
              </div>
              <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
            </div>
            {error && <p role="alert" className="text-sm text-red-400 text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.auth.loginNow}</Button>
          </form>
          {/* OAuth buttons removed — not yet available */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t.auth.noAccount} <Link href="/register" className="text-primary hover:underline">{t.auth.registerNow}</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {forgotStep === "email" ? (
                <><Mail className="h-5 w-5 text-primary" />{t.auth.resetPassword}</>
              ) : forgotStep === "confirm" ? (
                <><Mail className="h-5 w-5 text-primary" />{t.auth.resetPassword}</>
              ) : (
                <><KeyRound className="h-5 w-5 text-primary" />{t.auth.setNewPassword}</>
              )}
            </DialogTitle>
            <DialogDescription>
              {forgotStep === "email" ? t.auth.resetPasswordDesc : forgotStep === "confirm" ? t.auth.resetPasswordConfirm.replace("{email}", forgotEmail) : t.auth.setNewPassword}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {forgotStep === "email" ? (
              <>
                <div>
                  <label htmlFor="forgot-email" className="text-sm text-foreground mb-1.5 block">{t.auth.email}</label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleVerifyEmail(); } }}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
                <Button onClick={handleVerifyEmail} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10">
                  {t.common.confirm}
                </Button>
              </>
            ) : forgotStep === "confirm" ? (
              <>
                <p className="text-sm text-muted-foreground">{t.auth.resetPasswordConfirm.replace("{email}", forgotEmail)}</p>
                {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setForgotStep("email")} className="flex-1 border-border text-foreground hover:bg-secondary h-10">
                    {t.common.back || "Back"}
                  </Button>
                  <Button onClick={handleConfirmReset} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10">
                    {t.common.confirm}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="new-password" className="text-sm text-foreground mb-1.5 block">{t.auth.password}</label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder={t.auth.passwordPlaceholder}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-new-password" className="text-sm text-foreground mb-1.5 block">{t.auth.confirmPassword}</label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleResetPassword(); } }}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
                <Button onClick={handleResetPassword} disabled={forgotLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10">
                  {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.auth.resetPassword}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
