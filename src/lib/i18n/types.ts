export interface Dictionary {
  common: {
    home: string; prompts: string; skills: string; categories: string; trending: string; tags: string;
    guide: string; submit: string; login: string; register: string; logout: string;
    profile: string; search: string; back: string; loading: string; noData: string;
    save: string; cancel: string; delete: string; edit: string; confirm: string;
    copy: string; copied: string; share: string; like: string; bookmark: string;
    more: string; all: string; viewAll: string;
  };
  home: {
    featuredTitle: string; featuredSubtitle: string;
    tabAgent: string; tabPrompt: string;
    exploreDirections: string;
    heroTitle: string; heroSubtitle: string; heroCta: string; heroCtaGuide: string;
    heroBadge: string; heroPlatforms: string; heroTrust: string;
    sectionHot: string; sectionHotSub: string;
    sectionNew: string; sectionNewSub: string;
    sectionBeginner: string; sectionBeginnerSub: string;
    categoryTitle: string; categorySubtitle: string;
    testimonialTitle: string; testimonialSubtitle: string;
  };
  prompts: {
    title: string; subtitle: string; filterAll: string; sortBy: string;
    sortPopular: string; sortRating: string; sortNewest: string;
    usageCount: string; viewDetail: string; difficulty: string; version: string;
    notFound: string; backToList: string; searchPlaceholder: string;
    emptySearch: string;
  };
  promptDetail: {
    backToList: string; copyPrompt: string; copyFailed: string;
    onlineVersion: string; localVersion: string; onlineDesc: string; localDesc: string;
    variables: string; variablesDesc: string; beforeAfter: string; input: string;
    output: string; usage: string; onlinePlatform: string; localModel: string;
    models: string; modelsYear: string; advancedTips: string; versionHistory: string;
    relatedSkills: string; notFound: string; temperature: string; effectNote: string;
  };
  agentSkills: {
    title: string; subtitle: string; filterAll: string; sortBy: string;
    sortPopular: string; sortRating: string; sortNewest: string;
    usageCount: string; viewDetail: string; difficulty: string; version: string;
    notFound: string; backToList: string; searchPlaceholder: string;
    emptySearch: string;
    capabilities: string; tools: string; platforms: string;
    setupGuide: string; triggerExamples: string; description: string;
    install: string; installCopied: string;
    overview: string; readme: string; files: string; preview: string;
    downloads: string; stars: string; author: string; license: string;
    lastUpdated: string; collection: string; category: string;
    tryItOut: string; tryPlaceholder: string; runPreview: string;
    fileTree: string; collections: string; categories: string;
    heroTitle: string; heroSubtitle: string; heroCta: string;
    sectionHot: string; sectionHotSub: string;
    developer: string; downloadAll: string; downloadFile: string;
    feedback: string; writeComment: string; metadata: string;
    skillIntro: string; skillFiles: string;
  };
  categories: { title: string; subtitle: string; viewAll: string; exploreSkill: string; };
  trending: {
    title: string; subtitle: string; hot: string; newest: string;
    featured: string; mostLiked: string; gold: string; silver: string; bronze: string;
  };
  tags: { title: string; subtitle: string; relatedSkills: string; backToCloud: string; searchPlaceholder: string; tagCount: string; };
  comments: {
    title: string; writeComment: string; placeholder: string; submitComment: string;
    loginToComment: string; noComments: string; rating: string; likes: string;
    reply: string; cancelReply: string; replyingTo: string;
  };
  profile: {
    title: string; overview: string; favorites: string; likes: string;
    submissions: string; comments: string; history: string; settings: string;
    joinedAt: string; noFavorites: string; noLikes: string; noSubmissions: string;
    noComments: string; noHistory: string; browseSkills: string;
    recentActivity: string; noActivity: string; noActivityDesc: string;
    likedLabel: string; bookmarkedLabel: string; commentedLabel: string;
    submittedLabel: string; viewedLabel: string; copiedLabel: string;
    copiedPrompt: string; viewedSkill: string;
    stats: { submissions: string; likes: string; bookmarks: string; comments: string; };
  };
  settings: {
    editProfile: string; username: string; bio: string; bioPlaceholder: string;
    changePassword: string; currentPassword: string; newPassword: string;
    confirmPassword: string; themePreference: string; dark: string; light: string;
    system: string; dataManage: string; exportData: string; clearData: string;
    deleteAccount: string; deleteConfirm: string; passwordMismatch: string;
    profileUpdated: string; passwordChanged: string; wrongPassword: string;
    saveProfile: string; exportDesc: string; dangerZone: string;
    dangerDesc: string; confirmDelete: string;
  };
  submit: {
    title: string; subtitle: string; basicInfo: string; templateName: string;
    templateNamePlaceholder: string; shortDesc: string; shortDescPlaceholder: string;
    category: string; promptContent: string; onlinePrompt: string; onlinePlaceholder: string;
    localPrompt: string; localPlaceholder: string; usage: string; usagePlaceholder: string;
    submitBtn: string; successTitle: string; successDesc: string; continueSubmit: string;
    viewHistory: string; mySubmissions: string;
  };
  guide: { title: string; subtitle: string; };
  auth: {
    loginTitle: string; loginSubtitle: string; registerTitle: string; registerSubtitle: string;
    email: string; password: string; username: string; noAccount: string; hasAccount: string;
    loginNow: string; registerNow: string;
  };
  footer: {
    description: string; quickLinks: string; resources: string; community: string;
    blog: string; changelog: string; api: string; github: string; discord: string;
    twitter: string; newsletter: string; newsletterPlaceholder: string; subscribe: string;
    unsubscribe: string; unsubscribeDesc: string; managePreferences: string;
    copyright: string; platforms: string;
  };
  create: {
    newSkill: string; newPrompt: string;
    quickCreate: string; quickCreateDesc: string;
    customCreate: string; customCreateDesc: string;
    // Github import
    importGithub: string; githubUrl: string; githubUrlPlaceholder: string;
    parse: string; selectSkills: string; confirmCreate: string; importSuccess: string;
    selectPrompts: string; selectPromptsDesc: string;
    // Custom create — Agent Skill
    englishName: string; displayName: string; displayNamePlaceholder: string;
    sourceUrl: string; sourceUrlPlaceholder: string;
    owner: string; ownerPlaceholder: string;
    isPublic: string; publicLabel: string; privateLabel: string;
    description: string; descriptionPlaceholder: string;
    skillType: string; customTags: string; customTagsPlaceholder: string;
    icon: string; changeIcon: string;
    skillFile: string; noFileSelected: string; uploadHint: string;
    // Custom create — Prompt Template
    templateTitle: string; templateTitlePlaceholder: string;
    templateSubtitle: string; templateSubtitlePlaceholder: string;
    templateDesc: string; templateDescPlaceholder: string;
    templateCategory: string; templateDifficulty: string;
    promptOnline: string; promptOnlinePlaceholder: string;
    promptLocal: string; promptLocalPlaceholder: string;
    promptVersion: string; templateTags: string; templateTagsPlaceholder: string;
    difficultyEasy: string; difficultyMedium: string; difficultyHard: string;
    promptRequired: string; templateCategoryRequired: string;
    // Common
    step: string; parsing: string; parsingDesc: string;
    back: string; next: string; finish: string;
    successTitle: string; successDesc: string;
    createAnother: string; viewSkill: string;
    // Validation
    nameRequired: string; displayNameRequired: string;
    ownerRequired: string; descRequired: string; fileRequired: string;
    githubUrlRequired: string; selectAtLeastOne: string;
  };
  admin: {
    title: string; pendingSubmissions: string; userManage: string; skillAnalytics: string;
    commentManage: string; approve: string; reject: string; reviewNote: string;
    noPending: string; registeredUsers: string; noUsers: string;
    totalSubmissions: string; totalComments: string; adminBadge: string;
    reviewed: string; approved: string; rejected: string;
  };
}
