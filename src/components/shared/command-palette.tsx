"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Command } from "lucide-react";
import { getCommandItems } from "@/hooks/use-keyboard-shortcuts";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items = getCommandItems({ push: (url: string) => { router.push(url); setOpen(false); setQuery(""); } });

  const filtered = query.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  const grouped = filtered.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  const flatFiltered = filtered;

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSelectedIdx(0);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleOpen();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpen]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, flatFiltered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && flatFiltered[selectedIdx]) {
        flatFiltered[selectedIdx].action();
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, flatFiltered, selectedIdx]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => { setOpen(false); setQuery(""); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索技能、页面或命令..."
            className="flex-1 h-12 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted-foreground bg-secondary border border-border rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">没有找到匹配项</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs text-muted-foreground/60 px-3 py-1.5 uppercase tracking-wider">{category}</p>
                {items.map((item) => {
                  const idx = flatFiltered.indexOf(item);
                  return (
                    <button
                      key={`${category}-${item.label}`}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                        idx === selectedIdx ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                      }`}
                      onClick={() => { item.action(); setOpen(false); setQuery(""); }}
                      onMouseEnter={() => setSelectedIdx(idx)}
                    >
                      <span className="truncate">{item.label}</span>
                      {idx === selectedIdx && <ArrowRight className="h-3.5 w-3.5 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
          <span>↑↓ 导航 · Enter 选择 · Esc 关闭</span>
          <span className="flex items-center gap-1"><Command className="h-3 w-3" />K 打开面板</span>
        </div>
      </div>
    </div>
  );
}
