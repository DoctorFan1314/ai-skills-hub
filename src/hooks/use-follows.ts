"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useAuth } from "@/contexts/auth-context";

export function useFollows() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const followingRef = useRef<string[]>([]);
  followingRef.current = following;
  const userRef = useRef(user);
  userRef.current = user;
  const loadedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      loadedEmailRef.current = null;
      setFollowing([]);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.follows(user.email));
      if (raw) setFollowing(JSON.parse(raw));
      else setFollowing([]);
    } catch { setFollowing([]); }
    loadedEmailRef.current = user.email;
  }, [user?.email]);

  // Persist follows to localStorage whenever they change
  // Only persist when loaded email matches current user
  useEffect(() => {
    const u = userRef.current;
    if (!u || loadedEmailRef.current !== u.email) return;
    try {
      localStorage.setItem(STORAGE_KEYS.follows(u.email), JSON.stringify(following));
    } catch { /* ignore */ }
  }, [following]);

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
  }, [user?.email]);

  const isFollowing = useCallback((author: string) => followingRef.current.includes(author), []);

  const toggleFollow = useCallback((author: string) => {
    if (!user) return;
    setFollowing(prev =>
      prev.includes(author)
        ? prev.filter(a => a !== author)
        : [...prev, author]
    );
  }, [user]);

  return { following, isFollowing, toggleFollow };
}
