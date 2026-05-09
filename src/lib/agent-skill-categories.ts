export interface AgentSkillCategory {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  nameI18nKey: string;
  descI18nKey: string;
}

export const agentSkillCategories: AgentSkillCategory[] = [
  {
    slug: "skills-management",
    name: "Skills 管理",
    icon: "📦",
    description: "技能发现、安装、更新与管理",
    color: "#00d4ff",
    nameI18nKey: "agentNameSkillsMgmt",
    descI18nKey: "agentDescSkillsMgmt",
  },
  {
    slug: "web-development",
    name: "Web 开发",
    icon: "🌐",
    description: "前端设计、组件生成、页面构建与部署",
    color: "#7c3aed",
    nameI18nKey: "agentNameWebDev",
    descI18nKey: "agentDescWebDev",
  },
  {
    slug: "web-search",
    name: "Web 搜索",
    icon: "🔍",
    description: "多平台数据搜索、信息聚合与内容抓取",
    color: "#10b981",
    nameI18nKey: "agentNameWebSearch",
    descI18nKey: "agentDescWebSearch",
  },
  {
    slug: "multi-platform",
    name: "多平台交互",
    icon: "🔗",
    description: "跨平台 API 调用、社交媒体发布与消息推送",
    color: "#f59e0b",
    nameI18nKey: "agentNameMultiPlatform",
    descI18nKey: "agentDescMultiPlatform",
  },
  {
    slug: "code-execution",
    name: "代码执行",
    icon: "⚡",
    description: "代码运行、测试执行、构建部署与安全审计",
    color: "#ef4444",
    nameI18nKey: "agentNameCodeExec",
    descI18nKey: "agentDescCodeExec",
  },
  {
    slug: "file-processing",
    name: "文件处理",
    icon: "📁",
    description: "文件读写、格式转换、压缩打包与资源管理",
    color: "#ec4899",
    nameI18nKey: "agentNameFileProc",
    descI18nKey: "agentDescFileProc",
  },
  {
    slug: "communication",
    name: "通讯协作",
    icon: "✉️",
    description: "邮件发送、通知推送、日程管理与团队协作",
    color: "#8b5cf6",
    nameI18nKey: "agentNameComm",
    descI18nKey: "agentDescComm",
  },
  {
    slug: "data-analysis",
    name: "数据分析",
    icon: "📊",
    description: "数据查询、报表生成、趋势分析与可视化",
    color: "#06b6d4",
    nameI18nKey: "agentNameDataAnalysis",
    descI18nKey: "agentDescDataAnalysis",
  },
];

export function getAgentCategoryBySlug(slug: string): AgentSkillCategory | undefined {
  return agentSkillCategories.find((c) => c.slug === slug);
}
