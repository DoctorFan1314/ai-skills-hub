"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";

export function useUserLocalStorage<T>(key: string, initialValue: T, serialize = JSON.stringify, deserialize = JSON.parse) {
  const { user } = useAuth();
  const userKey = user ? `${key}-${user.email}` : `${key}-guest`;
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(userKey);
      if (raw !== null) {
        setValue(deserialize(raw));
      } else {
        setValue(initialValue);
      }
    } catch {
      setValue(initialValue);
    }
    setLoaded(true);
  }, [userKey]);

  const set = useCallback((updater: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
      try {
        localStorage.setItem(userKey, serialize(next));
      } catch { /* quota exceeded */ }
      return next;
    });
  }, [userKey, serialize]);

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(userKey);
    } catch { /* ignore */ }
    setValue(initialValue);
  }, [userKey, initialValue]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === userKey) {
        try {
          setValue(e.newValue !== null ? deserialize(e.newValue) : initialValue);
        } catch {
          setValue(initialValue);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [userKey, initialValue, deserialize]);

  return { value, set, remove, loaded };
}
