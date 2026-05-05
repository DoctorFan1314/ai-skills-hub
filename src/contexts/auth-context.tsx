"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  username: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loaded: boolean;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

const USERS_KEY = "ai-skills-hub-users";
const SESSION_KEY = "ai-skills-hub-session";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  const getUsers = useCallback((): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }, []);

  const login = useCallback(
    (email: string, password: string): boolean => {
      const users = getUsers();
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) return false;
      const session: User = { username: found.username, email: found.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return true;
    },
    [getUsers],
  );

  const register = useCallback(
    (username: string, email: string, password: string): boolean => {
      const users = getUsers();
      if (users.some((u) => u.email === email)) return false;
      const newUser: StoredUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const session: User = { username, email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return true;
    },
    [getUsers],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loaded, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
