"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
}

const I18nContext = createContext<I18nContextValue>({
  lang: "zh",
  setLang: () => {},
  t: zh,
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

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.language, newLang);
    } catch { /* ignore */ }
  }, []);

  const t = dictionaries[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
