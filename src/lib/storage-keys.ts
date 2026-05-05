export const STORAGE_KEYS = {
  users: "ai-skills-hub-users",
  session: "ai-skills-hub-session",
  theme: "ai-skills-hub-theme",
  language: "ai-skills-hub-language",
  allComments: "ai-skills-hub-all-comments",
  allSubmissions: "ai-skills-hub-all-submissions",
  newsletter: "ai-skills-hub-newsletter",
  // User-scoped keys
  likes: (email: string) => `ai-skills-hub-likes-${email}`,
  bookmarks: (email: string) => `ai-skills-hub-bookmarks-${email}`,
  submissions: (email: string) => `ai-skills-hub-submissions-${email}`,
  comments: (email: string) => `ai-skills-hub-comments-${email}`,
  activity: (email: string) => `ai-skills-hub-activity-${email}`,
  // Published agent skills
  publishedSkills: "ai-skills-hub-published-skills",
  // Legacy global keys (for migration)
  legacyLikes: "ai-skills-hub-likes",
  legacyBookmarks: "ai-skills-hub-bookmarks",
  legacySubmissions: "ai-skills-hub-submissions",
} as const;
