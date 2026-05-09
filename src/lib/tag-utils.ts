import { skills, getPublishedPrompts } from "@/lib/mock-data";
import { agentSkills, getPublishedSkills } from "@/lib/mock-agent-skills";

export interface TagInfo {
  tag: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const map = new Map<string, number>();
  const allPrompts = [...skills, ...getPublishedPrompts()];
  const allAgents = [...agentSkills, ...getPublishedSkills()];
  for (const skill of allPrompts) {
    for (const tag of skill.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  for (const skill of allAgents) {
    for (const tag of skill.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSkillsByTag(tag: string) {
  const allPrompts = [...skills, ...getPublishedPrompts()];
  const allAgents = [...agentSkills, ...getPublishedSkills()];
  const matchedPrompts = allPrompts.filter((s) => s.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  const matchedAgents = allAgents.filter((s) => s.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  return { prompts: matchedPrompts, agents: matchedAgents };
}

export function getTagCloud(): { tag: string; count: number; weight: number }[] {
  const tags = getAllTags();
  if (tags.length === 0) return [];
  const max = tags[0].count;
  return tags.map((t) => ({ ...t, weight: Math.max(0.4, t.count / max) }));
}
