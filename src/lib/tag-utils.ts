import { skills } from "@/lib/mock-data";

export interface TagInfo {
  tag: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const map = new Map<string, number>();
  for (const skill of skills) {
    for (const tag of skill.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSkillsByTag(tag: string) {
  return skills.filter((s) => s.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export function getTagCloud(): { tag: string; count: number; weight: number }[] {
  const tags = getAllTags();
  if (tags.length === 0) return [];
  const max = tags[0].count;
  return tags.map((t) => ({ ...t, weight: Math.max(0.4, t.count / max) }));
}
