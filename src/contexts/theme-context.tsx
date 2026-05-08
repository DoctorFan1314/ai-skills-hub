"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type Theme = "dark" | "light" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "dark" | "light" {
  return theme === "system" ? getSystemTheme() : theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;
    const initial = stored || "dark";
    setThemeState(initial);
    const resolved = resolveTheme(initial);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.theme, newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement;
  const isDark = resolved === "dark";
  // Smooth the color change
  root.style.transition = "background-color 0.3s, color 0.3s, border-color 0.3s";
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  // Remove transition after it completes to avoid interfering with other animations
  setTimeout(() => {
    root.style.transition = "";
  }, 350);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
