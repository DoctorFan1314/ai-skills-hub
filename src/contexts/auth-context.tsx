"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

interface User {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  preferences: {
    theme: "dark" | "light" | "system";
    language: "zh" | "en";
  };
  role: "user" | "admin";
}

interface StoredUser {
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  preferences: {
    theme: "dark" | "light" | "system";
    language: "zh" | "en";
  };
  role: "user" | "admin";
}

// Legacy type for migration
interface LegacyStoredUser {
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loaded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "username" | "avatar" | "bio" | "preferences">>) => void;
  changePassword: (currentPw: string, newPw: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + "ai-skills-hub-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toSessionUser(u: StoredUser): User {
  return {
    username: u.username,
    email: u.email,
    avatar: u.avatar,
    bio: u.bio,
    joinDate: u.joinDate,
    preferences: u.preferences,
    role: u.role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.session);
      if (session) setUser(JSON.parse(session));
    } catch {
      /* ignore */
    }
    // Run migration for old plaintext passwords
    migrateOldPasswords();
    setLoaded(true);
  }, []);

  const getUsers = useCallback((): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "[]");
    } catch {
      return [];
    }
  }, []);

  const saveUsers = useCallback((users: StoredUser[]) => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, []);

  const migrateOldPasswords = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.users);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      // Check if any user has old "password" field
      const hasLegacy = parsed.some((u: LegacyStoredUser) => "password" in u && typeof u.password === "string");
      if (!hasLegacy) return;
      // Migrate synchronously is not possible with async hash, so we do best-effort
      // For migration, we store plaintext as hash temporarily and let user re-login
      const migrated: StoredUser[] = parsed.map((u: LegacyStoredUser | StoredUser) => {
        if ("password" in u && typeof (u as LegacyStoredUser).password === "string") {
          const legacy = u as LegacyStoredUser;
          // Store password directly as hash placeholder — will be properly hashed on next login
          return {
            username: legacy.username,
            email: legacy.email,
            passwordHash: legacy.password, // will be fixed on next login
            joinDate: new Date().toISOString(),
            preferences: { theme: "dark" as const, language: "zh" as const },
            role: "user" as const,
          };
        }
        return u as StoredUser;
      });
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(migrated));
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const users = getUsers();
      const found = users.find((u) => u.email === email);
      if (!found) return false;
      const hash = await hashPassword(password);
      // Support both legacy plaintext and hashed passwords
      if (found.passwordHash !== hash && found.passwordHash !== password) return false;
      // If matched plaintext (legacy), upgrade to hash
      if (found.passwordHash === password) {
        found.passwordHash = hash;
        saveUsers(users);
      }
      const session = toSessionUser(found);
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      setUser(session);
      return true;
    },
    [getUsers, saveUsers],
  );

  const register = useCallback(
    async (username: string, email: string, password: string): Promise<boolean> => {
      const users = getUsers();
      if (users.some((u) => u.email === email)) return false;
      const hash = await hashPassword(password);
      const newUser: StoredUser = {
        username,
        email,
        passwordHash: hash,
        joinDate: new Date().toISOString(),
        preferences: { theme: "dark", language: "zh" },
        role: "user",
      };
      users.push(newUser);
      saveUsers(users);
      const session = toSessionUser(newUser);
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      setUser(session);
      return true;
    },
    [getUsers, saveUsers],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<Pick<User, "username" | "avatar" | "bio" | "preferences">>) => {
      if (!user) return;
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1) return;
      if (data.username !== undefined) users[idx].username = data.username;
      if (data.avatar !== undefined) users[idx].avatar = data.avatar;
      if (data.bio !== undefined) users[idx].bio = data.bio;
      if (data.preferences !== undefined) users[idx].preferences = { ...users[idx].preferences, ...data.preferences };
      saveUsers(users);
      const session = toSessionUser(users[idx]);
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      setUser(session);
    },
    [user, getUsers, saveUsers],
  );

  const changePassword = useCallback(
    async (currentPw: string, newPw: string): Promise<boolean> => {
      if (!user) return false;
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1) return false;
      const currentHash = await hashPassword(currentPw);
      if (users[idx].passwordHash !== currentHash && users[idx].passwordHash !== currentPw) return false;
      users[idx].passwordHash = await hashPassword(newPw);
      saveUsers(users);
      return true;
    },
    [user, getUsers, saveUsers],
  );

  return (
    <AuthContext.Provider value={{ user, loaded, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
