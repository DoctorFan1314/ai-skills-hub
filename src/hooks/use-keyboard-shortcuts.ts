"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { skills } from "@/lib/mock-data";
import { agentSkills } from "@/lib/mock-agent-skills";
import { categories } from "@/lib/categories";
import type { Dictionary } from "@/lib/i18n/types";

interface CommandItem {
  label: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function useCommandPalette(onOpen: () => void) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder]');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen, router]);
}

export function getCommandItems(router: { push: (url: string) => void }, t: Dictionary): CommandItem[] {
  const navLabel = "Navigation";
  const catLabel = t.categories.title;
  const promptLabel = t.common.prompts;
  const skillLabel = t.common.skills;

  const items: CommandItem[] = [
    { label: t.common.home, action: () => router.push("/"), category: navLabel },
    { label: t.common.prompts, action: () => router.push("/prompts"), category: navLabel },
    { label: t.common.skills, action: () => router.push("/skills"), category: navLabel },
    { label: t.common.categories, action: () => router.push("/categories"), category: navLabel },
    { label: t.common.trending, action: () => router.push("/trending"), category: navLabel },
    { label: t.common.tags, action: () => router.push("/tags"), category: navLabel },
    { label: t.common.guide, action: () => router.push("/guide"), category: navLabel },
    { label: t.common.submit, action: () => router.push("/submit"), category: navLabel },
    { label: t.common.profile, action: () => router.push("/profile"), category: navLabel },
  ];

  for (const cat of categories) {
    items.push({ label: `${catLabel}：${cat.name}`, action: () => router.push(`/categories/${cat.slug}`), category: catLabel });
  }

  for (const skill of skills.slice(0, 20)) {
    items.push({ label: skill.title, action: () => router.push(`/prompts/${skill.id}`), category: promptLabel });
  }

  for (const skill of agentSkills) {
    items.push({ label: skill.name, action: () => router.push(`/skills/${skill.id}`), category: skillLabel });
  }

  return items;
}
