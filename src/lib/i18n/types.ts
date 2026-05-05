export interface Dictionary {
  common: {
    home: string; skills: string; categories: string; trending: string; tags: string;
    guide: string; submit: string; login: string; register: string; logout: string;
    profile: string; search: string; back: string; loading: string; noData: string;
    save: string; cancel: string; delete: string; edit: string; confirm: string;
    copy: string; copied: string; share: string; like: string; bookmark: string;
    more: string; all: string;
  };
  home: {
    heroTitle: string; heroSubtitle: string; heroCta: string; heroStats: string;
    heroUsers: string; heroCategories: string; trustTitle: string; trustSubtitle: string;
  };
  skills: {
    title: string; subtitle: string; filterAll: string; sortBy: string;
    sortPopular: string; sortRating: string; sortNewest: string;
    usageCount: string; viewDetail: string; difficulty: string; version: string;
  };
  categories: { title: string; subtitle: string; viewAll: string; };
  trending: {
    title: string; subtitle: string; hot: string; newest: string;
    featured: string; mostLiked: string; gold: string; silver: string; bronze: string;
  };
  tags: { title: string; subtitle: string; relatedSkills: string; backToCloud: string; };
  skillDetail: {
    backToList: string; copyPrompt: string; copyFailed: string;
    onlineVersion: string; localVersion: string; onlineDesc: string; localDesc: string;
    variables: string; variablesDesc: string; beforeAfter: string; input: string;
    output: string; usage: string; onlinePlatform: string; localModel: string;
    models: string; modelsYear: string; advancedTips: string; versionHistory: string;
    relatedSkills: string; notFound: string; temperature: string; effectNote: string;
  };
  comments: {
    title: string; writeComment: string; placeholder: string; submitComment: string;
    loginToComment: string; noComments: string; rating: string; likes: string;
  };
  profile: {
    title: string; overview: string; favorites: string; likes: string;
    submissions: string; comments: string; history: string; settings: string;
    joinedAt: string; noFavorites: string; noLikes: string; noSubmissions: string;
    noComments: string; noHistory: string; browseSkills: string;
    stats: { submissions: string; likes: string; bookmarks: string; comments: string; };
  };
  settings: {
    editProfile: string; username: string; bio: string; bioPlaceholder: string;
    changePassword: string; currentPassword: string; newPassword: string;
    confirmPassword: string; themePreference: string; dark: string; light: string;
    system: string; dataManage: string; exportData: string; clearData: string;
    deleteAccount: string; deleteConfirm: string; passwordMismatch: string;
    profileUpdated: string; passwordChanged: string; wrongPassword: string;
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
    copyright: string;
  };
  admin: {
    title: string; pendingSubmissions: string; userManage: string; skillAnalytics: string;
    commentManage: string; approve: string; reject: string; reviewNote: string;
  };
}
