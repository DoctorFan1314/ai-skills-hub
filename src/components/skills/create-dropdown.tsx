"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, GitFork, Upload } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

interface CreateDropdownProps {
  onSelectGithub: () => void;
  onSelectUpload: () => void;
  label: string;
}

export function CreateDropdown({ onSelectGithub, onSelectUpload, label }: CreateDropdownProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
      >
        <Plus className="h-4 w-4" />
        {label}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onSelectGithub(); }}
            className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/60 transition-colors text-left"
          >
            <GitFork className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{t.create.quickCreate}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.create.quickCreateDesc}</p>
            </div>
          </button>
          <div className="border-t border-border" />
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onSelectUpload(); }}
            className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/60 transition-colors text-left"
          >
            <Upload className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{t.create.customCreate}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.create.customCreateDesc}</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
