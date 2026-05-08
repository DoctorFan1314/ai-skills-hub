"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) setValue(JSON.parse(item));
    } catch { /* ignore parse errors */ }
    setLoaded(true);
  }, [key]);

  // Cross-tab sync: listen for storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          setValue(e.newValue as T);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  const setStoredValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch { /* quota exceeded */ }
        return next;
      });
    },
    [key],
  );

  return [value, setStoredValue, loaded] as const;
}
