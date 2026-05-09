"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = localStorage.getItem(key);
      if (item !== null) return JSON.parse(item);
    } catch { /* ignore parse errors */ }
    return initialValue;
  });
  const [loaded, setLoaded] = useState(false);

  // Wrap initialValue in a ref so it doesn't cause re-subscriptions
  // when the caller passes an inline value
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

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
      if (e.key === key) {
        if (e.newValue === null) {
          setValue(initialValueRef.current);
        } else {
          try {
            setValue(JSON.parse(e.newValue));
          } catch {
            setValue(e.newValue as T);
          }
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
        } catch (err) {
          if (err instanceof DOMException && err.name === "QuotaExceededError") {
            console.error(`[useLocalStorage] Quota exceeded for key "${key}". Consider clearing old data.`);
          }
        }
        return next;
      });
    },
    [key],
  );

  return [value, setStoredValue, loaded] as const;
}
