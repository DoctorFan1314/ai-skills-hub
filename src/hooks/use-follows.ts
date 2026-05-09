"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useAuth } from "@/contexts/auth-context";

export function useFollows() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const followingRef = useRef<string[]>([]);
  followingRef.current = following;

  useEffect(() => {
    if (!user) {
      setFollowing([]);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.follows(user.email));
      if (raw) setFollowing(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [user]);

  // Cross-tab sync for follows
  useEffect(() => {
    if (!user) return;
    const followKey = STORAGE_KEYS.follows(user.email);
    const handler = (e: StorageEvent) => {
      if (e.key === followKey) {
        try {
          setFollowing(e.newValue !== null ? JSON.parse(e.newValue) : []);
        } catch {
          setFollowing([]);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [user]);

  const isFollowing = useCallback((author: string) => followingRef.current.includes(author), []);

  const toggleFollow = useCallback((author: string) => {
    if (!user) return;
    setFollowing(prev => {
      const updated = prev.includes(author)
        ? prev.filter(a => a !== author)
        : [...prev, author];
      localStorage.setItem(STORAGE_KEYS.follows(user.email), JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  return { following, isFollowing, toggleFollow };
}
