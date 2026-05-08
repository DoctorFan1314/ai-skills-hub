"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";
import { useLocale } from "@/hooks/use-locale";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { Submission } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/types";
import { FileText, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

function getStatusConfig(t: Dictionary) {
  return {
    pending: { label: t.submit.statusPending, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
    approved: { label: t.submit.statusApproved, color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
    rejected: { label: t.submit.statusRejected, color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
  };
}

export function MySubmissionsTab() {
  const { user } = useAuth();
  const { t } = useI18n();
  const locale = useLocale();
  const statusConfig = getStatusConfig(t);
  const key = user ? STORAGE_KEYS.submissions(user.email) : "ai-skills-hub-guest";
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setSubmissions(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [key]);

  function handleDelete(id: string) {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch { /* ignore */ }
    setDeleteConfirmId(null);
  }

  if (submissions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-foreground font-medium mb-1">{t.profile.noSubmissions}</p>
        <p className="text-sm text-muted-foreground">{t.profile.noSubmissionsDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => {
        const status = statusConfig[s.status];
        return (
          <div key={s.id} className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.category} · {new Date(s.submittedAt).toLocaleDateString(locale)}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${status.bg} ${status.color} shrink-0`}>
                {status.label}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {s.status === "pending" && (
                  <Link
                    href={`/submit?edit=${s.id}`}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    aria-label={t.common.edit}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => setDeleteConfirmId(s.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-secondary transition-colors"
                  aria-label={t.common.delete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {deleteConfirmId === s.id && (
              <div className="mt-2 flex items-center gap-2 text-xs border-t border-border pt-2">
                <span className="text-muted-foreground">{"Are you sure you want to delete this submission?"}</span>
                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:underline">{t.common.confirm}</button>
                <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground hover:underline">{t.common.cancel}</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
