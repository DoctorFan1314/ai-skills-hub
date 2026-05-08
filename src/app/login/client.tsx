"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { Mail, KeyRound } from "lucide-react";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useI18n();

  // Forgot password dialog state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError(t.auth.fillAllFields);
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) {
      setError(t.auth.emailOrPasswordError);
      return;
    }
    toast(t.auth.loginSuccess, "success");
    router.push("/");
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
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.users);
      const users: { email: string }[] = raw ? JSON.parse(raw) : [];
      const exists = users.some((u) => u.email === forgotEmail.trim());
      if (!exists) {
        setForgotError(t.auth.emailNotFound);
        return;
      }
      setForgotStep("reset");
    } catch {
      setForgotError(t.auth.emailNotFound);
    }
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
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11">{loading ? "..." : t.auth.loginNow}</Button>
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
              ) : (
                <><KeyRound className="h-5 w-5 text-primary" />{t.auth.setNewPassword}</>
              )}
            </DialogTitle>
            <DialogDescription>
              {forgotStep === "email" ? t.auth.resetPasswordDesc : t.auth.setNewPassword}
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
                  {forgotLoading ? "..." : t.auth.resetPassword}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
