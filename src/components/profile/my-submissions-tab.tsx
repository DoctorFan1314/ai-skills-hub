"use client";

import { useAuth } from "@/contexts/auth-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { Submission } from "@/lib/types";
import { FileText } from "lucide-react";

const statusConfig = {
  pending: { label: "待审核", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  approved: { label: "已通过", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  rejected: { label: "已拒绝", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
};

export function MySubmissionsTab() {
  const { user } = useAuth();
  const key = user ? STORAGE_KEYS.submissions(user.email) : "ai-skills-hub-guest";
  const [submissions] = useLocalStorage<Submission[]>(key, []);

  if (submissions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-foreground font-medium mb-1">暂无提交</p>
        <p className="text-sm text-muted-foreground">前往"提交模板"页面贡献你的 Prompt 技能</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => {
        const status = statusConfig[s.status];
        return (
          <div key={s.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.category} · {new Date(s.submittedAt).toLocaleDateString("zh-CN")}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${status.bg} ${status.color} shrink-0`}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
