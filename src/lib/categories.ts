import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "content",
    name: "语言与内容生产",
    icon: "💬",
    description: "小红书爆款笔记、营销文案、视频脚本、标题生成、去AI味优化",
    skillCount: 15,
    color: "#00d4ff",
  },
  {
    slug: "coding",
    name: "编程与技术任务",
    icon: "🛠️",
    description: "代码生成、Bug修复、代码审查、重构、API集成",
    skillCount: 12,
    color: "#7c3aed",
  },
  {
    slug: "thinking",
    name: "思考与工作流",
    icon: "⚙️",
    description: "周报总结、深度研究、结构化思考、多步任务、决策辅助",
    skillCount: 13,
    color: "#10b981",
  },
];
