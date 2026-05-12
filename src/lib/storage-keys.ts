export const STORAGE_KEYS = {
  users: "oortapi-users",
  session: "oortapi-session",
  theme: "oortapi-theme",
  language: "oortapi-language",
  allComments: "oortapi-all-comments",
  allSubmissions: "oortapi-all-submissions",
  newsletter: "oortapi-newsletter",
  // User-scoped keys
  likes: (email: string) => `oortapi-likes-${email || "anonymous"}`,
  bookmarks: (email: string) => `oortapi-bookmarks-${email || "anonymous"}`,
  submissions: (email: string) => `oortapi-submissions-${email || "anonymous"}`,
  comments: (email: string) => `oortapi-comments-${email || "anonymous"}`,
  activity: (email: string) => `oortapi-activity-${email || "anonymous"}`,
  // Agent skill comments (per-skill)
  skillComments: (skillId: string) => `oortapi-skill-comments-${skillId}`,
  // Published agent skills
  publishedSkills: "oortapi-published-skills",
  // Published prompt templates
  publishedPrompts: "oortapi-published-prompts",
  // Notifications
  notifications: (email: string) => `oortapi-notifications-${email || "anonymous"}`,
  // Collections
  collections: (email: string) => `oortapi-collections-${email || "anonymous"}`,
  // Follows
  follows: (email: string) => `oortapi-follows-${email || "anonymous"}`,
  // Reports
  reports: "oortapi-reports",
  // Recent searches
  recentSearches: "oortapi-recent-searches",
  // Last password reset timestamp (for rate limiting)
  lastPasswordReset: "oortapi-last-pw-reset",
  // Notification preferences (user-scoped)
  notificationPrefs: (email: string) => `oortapi-notification-prefs-${email || "anonymous"}`,
  // Currency preference
  currency: "oortapi-currency",
} as const;
