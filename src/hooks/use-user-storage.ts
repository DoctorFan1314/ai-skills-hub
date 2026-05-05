"use client";

import { useLocalStorage } from "./use-local-storage";
import { useAuth } from "@/contexts/auth-context";

export function useUserStorage<T>(
  keyFn: (email: string) => string,
  fallback: T
): readonly [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const { user } = useAuth();
  const key = user ? keyFn(user.email) : "ai-skills-hub-guest";
  return useLocalStorage<T>(key, fallback);
}
