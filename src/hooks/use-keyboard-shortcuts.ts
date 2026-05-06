"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { skills } from "@/lib/mock-data";
import { agentSkills } from "@/lib/mock-agent-skills";
import { categories } from "@/lib/categories";

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
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="搜索"]');
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

export function getCommandItems(router: { push: (url: string) => void }): CommandItem[] {
  const items: CommandItem[] = [
    { label: "首页", action: () => router.push("/"), category: "导航" },
    { label: "Prompt 模板", action: () => router.push("/prompts"), category: "导航" },
    { label: "Agent 技能", action: () => router.push("/skills"), category: "导航" },
    { label: "分类浏览", action: () => router.push("/categories"), category: "导航" },
    { label: "排行榜", action: () => router.push("/trending"), category: "导航" },
    { label: "标签云", action: () => router.push("/tags"), category: "导航" },
    { label: "新手指南", action: () => router.push("/guide"), category: "导航" },
    { label: "提交模板", action: () => router.push("/submit"), category: "导航" },
    { label: "个人中心", action: () => router.push("/profile"), category: "导航" },
  ];

  for (const cat of categories) {
    items.push({ label: `分类：${cat.name}`, action: () => router.push(`/categories/${cat.slug}`), category: "分类" });
  }

  for (const skill of skills.slice(0, 20)) {
    items.push({ label: skill.title, action: () => router.push(`/prompts/${skill.id}`), category: "Prompt" });
  }

  for (const skill of agentSkills) {
    items.push({ label: skill.name, action: () => router.push(`/skills/${skill.id}`), category: "Agent 技能" });
  }

  return items;
}
