"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
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
      setToasts((prev) => {
        if (prev.some((t) => t.message === message)) return prev;
        const next = [...prev, { id, message, type }];
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
