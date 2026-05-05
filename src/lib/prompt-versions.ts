import { skills } from "@/lib/mock-data";
import type { Skill } from "@/lib/types";

export interface PromptVersion {
  id: string;
  skillId: string;
  version: string;
  changelog: string;
  updatedAt: string;
}

const VERSION_KEY_PREFIX = "ai-skills-hub-versions-";

export function getVersions(skillId: string): PromptVersion[] {
  try {
    const raw = localStorage.getItem(`${VERSION_KEY_PREFIX}${skillId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function initVersionForSkill(skill: Skill): void {
  const key = `${VERSION_KEY_PREFIX}${skill.id}`;
  const existing = localStorage.getItem(key);
  if (existing) return;
  const initial: PromptVersion = {
    id: `${skill.id}-v0`,
    skillId: skill.id,
    version: skill.version,
    changelog: "初始版本",
    updatedAt: skill.lastUpdated,
  };
  localStorage.setItem(key, JSON.stringify([initial]));
}

export function getAllVersions(): Map<string, PromptVersion[]> {
  const map = new Map<string, PromptVersion[]>();
  for (const skill of skills) {
    map.set(skill.id, getVersions(skill.id));
  }
  return map;
}
