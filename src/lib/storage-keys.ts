export const STORAGE_KEYS = {
  users: "ai-skills-hub-users",
  session: "ai-skills-hub-session",
  theme: "ai-skills-hub-theme",
  language: "ai-skills-hub-language",
  allComments: "ai-skills-hub-all-comments",
  allSubmissions: "ai-skills-hub-all-submissions",
  newsletter: "ai-skills-hub-newsletter",
  // User-scoped keys
  likes: (email: string) => `ai-skills-hub-likes-${email || "anonymous"}`,
  bookmarks: (email: string) => `ai-skills-hub-bookmarks-${email || "anonymous"}`,
  submissions: (email: string) => `ai-skills-hub-submissions-${email || "anonymous"}`,
  comments: (email: string) => `ai-skills-hub-comments-${email || "anonymous"}`,
  activity: (email: string) => `ai-skills-hub-activity-${email || "anonymous"}`,
  // Agent skill comments (per-skill)
  skillComments: (skillId: string) => `ai-skills-hub-skill-comments-${skillId}`,
  // Published agent skills
  publishedSkills: "ai-skills-hub-published-skills",
  // Published prompt templates
  publishedPrompts: "ai-skills-hub-published-prompts",
  // Notifications
  notifications: (email: string) => `ai-skills-hub-notifications-${email || "anonymous"}`,
  // Collections
  collections: (email: string) => `ai-skills-hub-collections-${email || "anonymous"}`,
  // Follows
  follows: (email: string) => `ai-skills-hub-follows-${email || "anonymous"}`,
  // Reports
  reports: "ai-skills-hub-reports",
  // Recent searches
  recentSearches: "ai-skills-hub-recent-searches",
  // Last password reset timestamp (for rate limiting)
  lastPasswordReset: "ai-skills-hub-last-pw-reset",
  // Notification preferences (user-scoped)
  notificationPrefs: (email: string) => `ai-skills-hub-notification-prefs-${email || "anonymous"}`,
} as const;
