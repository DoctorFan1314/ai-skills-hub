"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <div className="glass-card p-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-3">出了点问题</h2>
        <p className="text-muted-foreground text-sm mb-6">{error.message || "页面加载时发生了未知错误"}</p>
        <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          重试
        </Button>
      </div>
    </div>
  );
}
