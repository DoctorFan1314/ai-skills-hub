"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { zh } from "@/lib/i18n/zh";
import { en } from "@/lib/i18n/en";
import type { Dictionary } from "@/lib/i18n/types";

type Lang = "zh" | "en";

const dictionaries: Record<Lang, Dictionary> = { zh, en };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  tFormat: (key: string, vars: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "zh",
  setLang: () => {},
  t: zh,
  tFormat: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.language) as Lang | null;
      if (stored && (stored === "zh" || stored === "en")) {
        setLangState(stored);
      }
    } catch { /* ignore */ }
  }, []);

  // Update <html lang> on language change
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.language, newLang);
    } catch { /* ignore */ }
  }, []);

  const tFormat = useCallback((key: string, vars: Record<string, string | number>) => {
    let result = key;
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
    return result;
  }, []);

  const t = dictionaries[lang];

  const value = useMemo(() => ({ lang, setLang, t, tFormat }), [lang, setLang, t, tFormat]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
