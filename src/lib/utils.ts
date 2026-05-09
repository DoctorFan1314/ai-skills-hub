import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export function formatDate(dateStr: string, locale: string = "zh-CN"): string {
  try {
    const normalized = dateStr.replace(/\./g, "-");
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateStr; // Return raw string if invalid
    return date.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return dateStr;
  }
}

export function getDifficultyLabel(difficulty: string, t: { prompts: { difficultyEasy: string; difficultyMedium: string; difficultyHard: string } }): string {
  switch (difficulty) {
    case "beginner": return t.prompts.difficultyEasy;
    case "intermediate": return t.prompts.difficultyMedium;
    case "advanced": return t.prompts.difficultyHard;
    default: return difficulty;
  }
}

export function canPerformAction(action: string, cooldownMs: number = 3000): boolean {
  const key = `ai-skills-hub-rate-${action}`;
  const last = localStorage.getItem(key);
  if (last && Date.now() - parseInt(last) < cooldownMs) return false;
  localStorage.setItem(key, String(Date.now()));
  return true;
}
