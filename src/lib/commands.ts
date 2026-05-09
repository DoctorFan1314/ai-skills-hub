import type { Dictionary } from "@/lib/i18n/types";
import { categories, getCategoryI18n } from "@/lib/categories";
import { skills, getPublishedPrompts } from "@/lib/mock-data";
import { agentSkills, getPublishedSkills } from "@/lib/mock-agent-skills";

export interface CommandItem {
  label: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function getCommandItems(router: { push: (url: string) => void }, t: Dictionary): CommandItem[] {
  const navLabel = t.common.navigation;
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
    const i18n = getCategoryI18n(cat.slug, t);
    items.push({ label: `${catLabel}：${i18n.name || cat.name}`, action: () => router.push(`/categories/${cat.slug}`), category: catLabel });
  }

  const allPrompts = [...skills, ...getPublishedPrompts()];
  for (const skill of allPrompts) {
    items.push({ label: skill.title, action: () => router.push(`/prompts/${skill.id}`), category: promptLabel });
  }

  const allAgents = [...agentSkills, ...getPublishedSkills()];
  for (const skill of allAgents) {
    items.push({ label: skill.name, action: () => router.push(`/skills/${skill.id}`), category: skillLabel });
  }

  return items;
}
