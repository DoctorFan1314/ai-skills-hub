export const COLORS = {
  primary: "#00d4ff",
  primaryHover: "#00d4ff99",
  muted: "#8b949e",
  defaultCategoryColor: "#6e7781",
  category: {
    content: "#00d4ff",
    coding: "#7c3aed",
    thinking: "#10b981",
    data: "#f59e0b",
    productivity: "#ef4444",
    creative: "#ec4899",
  } as Record<string, string>,
} as const;

/**
 * Get the color for a category slug, falling back to the default category color
 * if the slug is not recognized.
 */
export function getCategoryColor(slug: string): string {
  return COLORS.category[slug] ?? COLORS.defaultCategoryColor;
}
