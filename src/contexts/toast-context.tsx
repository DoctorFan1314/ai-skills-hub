"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
  createdAt?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = crypto.randomUUID();
      const now = Date.now();
      setToasts((prev) => {
        // Only suppress if an identical message was added less than 500ms ago
        const recentDuplicate = prev.some((t) => t.message === message && t.createdAt && now - t.createdAt < 500);
        if (recentDuplicate) return prev;
        const next = [...prev, { id, message, type, createdAt: now }];
        // Keep at most 5 toasts, remove earliest
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [],
  );

  const dismiss = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
