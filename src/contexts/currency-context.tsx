"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type Currency = "USD" | "CNY";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  formatPrice: (usdAmount: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  exchangeRate: 7.3,
  formatPrice: (usd) => `$${usd.toFixed(4)}`,
  symbol: "$",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState(7.3);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.currency) as Currency | null;
      if (stored && (stored === "USD" || stored === "CNY")) {
        setCurrencyState(stored);
      }
    } catch { /* ignore */ }

    fetch("/api/dashboard/settings", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.settings?.exchange_rate) {
          setExchangeRate(parseFloat(data.settings.exchange_rate) || 7.3);
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEYS.currency, c);
    } catch { /* ignore */ }
  }, []);

  const symbol = currency === "CNY" ? "¥" : "$";

  const formatPrice = useCallback((usdAmount: number) => {
    if (currency === "CNY") {
      return `¥${(usdAmount * exchangeRate).toFixed(2)}`;
    }
    return `$${usdAmount.toFixed(4)}`;
  }, [currency, exchangeRate]);

  const value = useMemo(
    () => ({ currency, setCurrency, exchangeRate, formatPrice, symbol }),
    [currency, setCurrency, exchangeRate, formatPrice, symbol],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
