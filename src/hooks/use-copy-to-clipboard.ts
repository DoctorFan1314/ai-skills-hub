import { useState, useCallback } from "react";
import { useToast } from "@/contexts/toast-context";

export function useCopyToClipboard(successMessage?: string) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = useCallback(async (text: string, message?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast(message || successMessage || "Copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  }, [toast, successMessage]);

  return { copied, copy };
}
