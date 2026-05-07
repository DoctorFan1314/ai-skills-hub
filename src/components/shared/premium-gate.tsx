"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";
import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PremiumGateProps {
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  skillTitle?: string;
}

export function PremiumGate({ children, previewContent, skillTitle }: PremiumGateProps) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  if (expanded) return <>{children}</>;

  return (
    <div className="relative">
      {previewContent || children}
      <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/95 to-transparent pt-24">
        <div className="text-center p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-foreground">{t.create.premiumSkill}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {skillTitle ? `${t.create.premiumDesc.replace("{name}", skillTitle)}` : t.create.premiumUnlock}
          </p>
          <div className="flex items-center gap-3 justify-center">
            {user ? (
              <Button onClick={() => setExpanded(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Lock className="h-4 w-4 mr-2" />{t.create.unlockView}
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{t.create.loginUnlock}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="border-border text-foreground hover:bg-secondary">{t.create.registerFree}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
