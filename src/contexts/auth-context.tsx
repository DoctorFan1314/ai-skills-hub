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
  salt?: string;
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
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Legacy static salt for backward compatibility
const LEGACY_STATIC_SALT = "ai-skills-hub-salt";

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt);
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
      if (session) {
        const parsed = JSON.parse(session);
        // Check session expiry: 30 days
        if (parsed.loginTimestamp) {
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - parsed.loginTimestamp > thirtyDaysMs) {
            localStorage.removeItem(STORAGE_KEYS.session);
            setLoaded(true);
            return;
          }
        }
        setUser(parsed);
      }
    } catch {
      /* ignore */
    }
    // Run migration for old plaintext passwords (async)
    migrateOldPasswords().catch(() => { /* ignore */ });
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

  const migrateOldPasswords = useCallback(async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.users);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      // Check if any user has old "password" field
      const hasLegacy = parsed.some((u: LegacyStoredUser) => "password" in u && typeof u.password === "string");
      if (!hasLegacy) return;
      // Migrate with proper async hashing
      const migrated: StoredUser[] = await Promise.all(parsed.map(async (u: LegacyStoredUser | StoredUser) => {
        if ("password" in u && typeof (u as LegacyStoredUser).password === "string") {
          const legacy = u as LegacyStoredUser;
          const salt = generateSalt();
          return {
            username: legacy.username,
            email: legacy.email,
            passwordHash: await hashPassword(legacy.password, salt),
            salt,
            joinDate: new Date().toISOString(),
            preferences: { theme: "dark" as const, language: "zh" as const },
            role: "user" as const,
          };
        }
        return u as StoredUser;
      }));
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(migrated));
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === email);
      if (idx === -1) return false;
      const found = users[idx];

      // Determine salt to use: per-user salt, or legacy static salt if missing
      const effectiveSalt = found.salt || LEGACY_STATIC_SALT;
      const hash = await hashPassword(password, effectiveSalt);

      // Support both hashed passwords and legacy plaintext
      if (found.passwordHash !== hash && found.passwordHash !== password) return false;

      // Migrate: if matched plaintext (legacy), upgrade to hash with per-user salt
      if (found.passwordHash === password) {
        const newSalt = generateSalt();
        found.passwordHash = await hashPassword(password, newSalt);
        found.salt = newSalt;
        users[idx] = found;
        saveUsers(users);
      }

      // Migrate: if user had no salt (old static salt hash), add per-user salt on login
      if (!found.salt) {
        const newSalt = generateSalt();
        found.passwordHash = await hashPassword(password, newSalt);
        found.salt = newSalt;
        users[idx] = found;
        saveUsers(users);
      }

      const session = { ...toSessionUser(found), loginTimestamp: Date.now() };
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
      const salt = generateSalt();
      const hash = await hashPassword(password, salt);
      const newUser: StoredUser = {
        username,
        email,
        passwordHash: hash,
        salt,
        joinDate: new Date().toISOString(),
        preferences: { theme: "dark", language: "zh" },
        role: "user",
      };
      users.push(newUser);
      saveUsers(users);
      const session = { ...toSessionUser(newUser), loginTimestamp: Date.now() };
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
      const effectiveSalt = users[idx].salt || LEGACY_STATIC_SALT;
      const currentHash = await hashPassword(currentPw, effectiveSalt);
      if (users[idx].passwordHash !== currentHash && users[idx].passwordHash !== currentPw) return false;
      // Generate new salt for the new password
      const newSalt = generateSalt();
      users[idx].passwordHash = await hashPassword(newPw, newSalt);
      users[idx].salt = newSalt;
      saveUsers(users);
      return true;
    },
    [user, getUsers, saveUsers],
  );

  const resetPassword = useCallback(
    async (email: string, newPassword: string): Promise<boolean> => {
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === email);
      if (idx === -1) return false;
      // Generate new salt for the new password
      const newSalt = generateSalt();
      users[idx].passwordHash = await hashPassword(newPassword, newSalt);
      users[idx].salt = newSalt;
      saveUsers(users);
      return true;
    },
    [getUsers, saveUsers],
  );

  return (
    <AuthContext.Provider value={{ user, loaded, login, register, logout, updateProfile, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
