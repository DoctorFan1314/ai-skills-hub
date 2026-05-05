import type { AgentSkill } from "./types";

export const agentSkills: AgentSkill[] = [
  {
    id: "agent-reach",
    name: "Agent Reach — 全网搜索与交互",
    description: `# Agent Reach — 全网搜索与交互工具

Agent Reach 是一个强大的 AI Agent 技能，能够搜索、读取和交互 13+ 主流平台。

## 支持的平台

- **Twitter/X** — 搜索推文、读取用户时间线、获取完整线程
- **YouTube** — 获取视频元数据、下载字幕、搜索视频
- **Bilibili** — 获取视频信息、下载字幕
- **小红书** — 搜索笔记、获取详情、发布内容、加载评论
- **抖音** — 解析视频信息、获取下载链接
- **微信公众号** — 搜索文章、阅读全文（Camoufox 绕过反爬）
- **LinkedIn** — 获取个人资料、搜索人脉
- **Boss直聘** — 获取推荐职位、搜索岗位
- **GitHub** — 搜索仓库、代码、Issue
- **Reddit** — 搜索帖子、获取热门内容
- **RSS** — 解析任意 RSS Feed
- **Exa Web Search** — 通用网页搜索
- **任意网页** — 通过 Jina Reader 读取

## 使用方式

直接告诉 AI 你想做什么，例如：
- "搜推特上的 AI Agent 讨论"
- "帮我查小红书上关于春季穿搭的笔记"
- "看这个 YouTube 视频的字幕"
- "搜 GitHub 上 star 最多的 Python Agent 框架"`,
    triggers: [
      "搜推特", "搜小红书", "看视频", "搜一下", "上网搜", "帮我查", "全网搜索",
      "search twitter", "read tweet", "youtube transcript", "search reddit",
      "read this link", "看这个链接", "B站", "bilibili", "抖音视频",
      "微信文章", "公众号", "LinkedIn", "GitHub issue", "RSS",
      "search online", "web search", "find information", "research",
    ],
  },
  {
    id: "code-executor",
    name: "Code Executor — 代码执行与调试",
    description: `# Code Executor — 代码执行与调试

一个能够执行代码、调试错误、运行测试的 Agent 技能。

## 核心能力

- **执行代码** — 运行 Python、JavaScript、Shell 等脚本
- **调试错误** — 分析错误信息，自动修复代码
- **运行测试** — 执行单元测试、集成测试
- **代码分析** — 静态分析、性能分析
- **环境管理** — 安装依赖、管理虚拟环境

## 使用方式

- "帮我运行这段 Python 代码"
- "这个 Bug 怎么修"
- "跑一下测试看看结果"`,
    triggers: [
      "运行代码", "执行代码", "debug", "调试", "跑测试", "run code",
      "execute", "fix bug", "代码报错",
    ],
  },
  {
    id: "file-manager",
    name: "File Manager — 文件管理与处理",
    description: `# File Manager — 文件管理与处理

一个能够读取、写入、转换各种文件格式的 Agent 技能。

## 核心能力

- **文件读写** — 读取和写入各种文本文件
- **格式转换** — PDF、Markdown、JSON、CSV 等格式互转
- **图片处理** — 图片压缩、格式转换、OCR 文字识别
- **数据处理** — CSV/Excel 数据清洗和分析
- **批量操作** — 批量重命名、移动、整理文件

## 使用方式

- "帮我读取这个 PDF 文件"
- "把这个 CSV 转成 JSON"
- "批量重命名这些文件"`,
    triggers: [
      "读文件", "写文件", "文件转换", "PDF", "CSV", "read file",
      "convert file", "batch rename", "OCR", "图片处理",
    ],
  },
];

export function getAgentSkillById(id: string): AgentSkill | undefined {
  return agentSkills.find((s) => s.id === id);
}
