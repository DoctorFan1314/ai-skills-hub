import { skills, getPublishedPrompts } from "@/lib/mock-data";
import type { Skill } from "@/lib/types";

export function getRelatedSkills(skill: Skill, limit = 4): Skill[] {
  const allSkills = [...skills, ...getPublishedPrompts()];
  const scored = allSkills
    .filter((s) => s.id !== skill.id)
    .map((s) => {
      let score = 0;
      if (s.categorySlug === skill.categorySlug) score += 3;
      const sharedTags = s.tags.filter((t) => skill.tags.includes(t)).length;
      score += sharedTags * 2;
      if (s.difficulty === skill.difficulty) score += 1;
      return { skill: s, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.skill);
}
