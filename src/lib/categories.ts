import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "content",
    name: "语言与内容生产",
    icon: "💬",
    description: "小红书爆款笔记、营销文案、视频脚本、标题生成、去AI味优化",
    color: "#00d4ff",
  },
  {
    slug: "coding",
    name: "编程与技术任务",
    icon: "🛠️",
    description: "代码生成、Bug修复、代码审查、重构、API集成",
    color: "#7c3aed",
  },
  {
    slug: "thinking",
    name: "思考与工作流",
    icon: "⚙️",
    description: "周报总结、深度研究、结构化思考、多步任务、决策辅助",
    color: "#10b981",
  },
  {
    slug: "data",
    name: "数据分析",
    icon: "📊",
    description: "SQL优化、数据清洗、可视化建议、数据洞察、报表生成",
    color: "#f59e0b",
  },
  {
    slug: "productivity",
    name: "效率工具",
    icon: "⚡",
    description: "会议纪要、任务分解、邮件撰写、日程规划、工作流自动化",
    color: "#ef4444",
  },
  {
    slug: "creative",
    name: "创意写作",
    icon: "✍️",
    description: "故事大纲、角色塑造、世界观搭建、对白优化、创意脑暴",
    color: "#ec4899",
  },
];
