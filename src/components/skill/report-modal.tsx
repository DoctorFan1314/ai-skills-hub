"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { useToast } from "@/contexts/toast-context";
import { canPerformAction } from "@/lib/utils";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: "spam" | "abuse" | "copyright" | "other", description: string) => void;
}

export function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [reportReason, setReportReason] = useState<"spam" | "abuse" | "copyright" | "other">("spam");
  const [reportDesc, setReportDesc] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    // Focus first focusable element on mount
    requestAnimationFrame(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    });
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  function handleSubmit() {
    if (!canPerformAction("report", 5000)) { toast(t.rateLimit.tooFast, "error"); return; }
    onSubmit(reportReason, reportDesc);
    setReportReason("spam");
    setReportDesc("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.common.report || "Report"}
        className="glass-card w-full max-w-md mx-4 p-6 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t.common.report}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label={t.common.close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{t.common.reportReason}</p>

        <div className="space-y-2 mb-4">
          {(["spam", "abuse", "copyright", "other"] as const).map((reason) => (
            <label key={reason} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="report-reason"
                value={reason}
                checked={reportReason === reason}
                onChange={() => setReportReason(reason)}
                className="accent-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {t.common[`report${reason.charAt(0).toUpperCase() + reason.slice(1)}` as keyof typeof t.common]}
              </span>
            </label>
          ))}
        </div>

        <textarea
          value={reportDesc}
          onChange={(e) => setReportDesc(e.target.value)}
          placeholder={t.common.reportReason}
          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none min-h-[60px] mb-4"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSubmit}>
            {t.common.report}
          </Button>
        </div>
      </div>
    </div>
  );
}
