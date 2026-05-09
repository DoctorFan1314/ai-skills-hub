import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/contexts/toast-context";

export function useCopyToClipboard(successMessage?: string) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(async (text: string, message?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast(message || successMessage || "Copied!", "success");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  }, [toast, successMessage]);

  return { copied, copy };
}
