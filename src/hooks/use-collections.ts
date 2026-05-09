"use client";
import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useAuth } from "@/contexts/auth-context";
import type { UserCollection } from "@/lib/types";

function isValidCollection(item: unknown): item is UserCollection {
  if (!item || typeof item !== "object") return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.skillIds)
  );
}

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<UserCollection[]>([]);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.collections(user.email));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCollections(parsed.filter(isValidCollection));
        }
      }
    } catch { /* ignore */ }
  }, [user]);

  const createCollection = useCallback((name: string, description: string, isPublic: boolean = true, options?: { coverImage?: string; color?: string }) => {
    if (!user) return null;
    const collection: UserCollection = {
      id: crypto.randomUUID(),
      name,
      description,
      skillIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.email,
      isPublic,
      coverImage: options?.coverImage,
      color: options?.color,
    };
    setCollections(prev => {
      const updated = [...prev, collection];
      localStorage.setItem(STORAGE_KEYS.collections(user.email), JSON.stringify(updated));
      return updated;
    });
    return collection;
  }, [user]);

  const addToCollection = useCallback((collectionId: string, skillId: string) => {
    if (!user) return;
    setCollections(prev => {
      const updated = prev.map(c =>
        c.id === collectionId && !c.skillIds.includes(skillId)
          ? { ...c, skillIds: [...c.skillIds, skillId], updatedAt: new Date().toISOString() }
          : c
      );
      localStorage.setItem(STORAGE_KEYS.collections(user.email), JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const removeFromCollection = useCallback((collectionId: string, skillId: string) => {
    if (!user) return;
    setCollections(prev => {
      const updated = prev.map(c =>
        c.id === collectionId
          ? { ...c, skillIds: c.skillIds.filter(id => id !== skillId), updatedAt: new Date().toISOString() }
          : c
      );
      localStorage.setItem(STORAGE_KEYS.collections(user.email), JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const deleteCollection = useCallback((collectionId: string) => {
    if (!user) return;
    setCollections(prev => {
      const updated = prev.filter(c => c.id !== collectionId);
      localStorage.setItem(STORAGE_KEYS.collections(user.email), JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const updateCollection = useCallback((collectionId: string, updates: Partial<Pick<UserCollection, "name" | "description" | "isPublic" | "coverImage" | "color">>) => {
    if (!user) return;
    setCollections(prev => {
      const updated = prev.map(c =>
        c.id === collectionId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      localStorage.setItem(STORAGE_KEYS.collections(user.email), JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const isInCollection = useCallback((skillId: string): UserCollection[] => {
    return collections.filter(c => c.skillIds.includes(skillId));
  }, [collections]);

  return { collections, createCollection, addToCollection, removeFromCollection, deleteCollection, updateCollection, isInCollection };
}
