"use client";
import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: number;
}

export function CopyButton({ text, label, className = "", size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button onClick={handleCopy} aria-label={label || (copied ? t.common.copied : t.common.copy)} className={className}>
      {copied ? <Check size={size} className="text-green-500" /> : <Copy size={size} />}
    </button>
  );
}
