import type { AgentSkill } from "./types";
import { STORAGE_KEYS } from "./storage-keys";

export const agentSkills: AgentSkill[] = [
  {
    id: "find-skills",
    name: "find-skills",
    title: "Find Skills — Discover & Install Agent Skills",
    description: "Search, discover, and install agent skills from the community registry. Browse trending skills, filter by category, and one-click install any skill into your project.",
    avatar: "",
    author: "@vercel-labs",
    authorBadge: "Official",
    developer: "vercel-labs",
    downloads: 24300,
    stars: 8200,
    rating: 4.2,
    lastUpdated: "2026-04-30",
    collection: "Vercel Agent Toolkit",
    category: "Skills 管理",
    categorySlug: "skills-management",
    installCommand: "npx skills add @vercel-labs/find-skills",
    license: "MIT",
    version: "1.4.2",
    readme: `# find-skills

帮助用户在询问诸如"我如何做X"、"寻找X的技能"、"是否有可以...的技能"，或表示有兴趣扩展功能时，发现并安装代理技能。当用户正在寻找可能作为可安装技能存在的功能时，应使用此技能。

## 何时使用此技能

当用户：

- 提问"如何做 X"，而 X 可能是已有现成技能支持的常见任务
- 说"为 X 找一个技能"或"有没有适用于 X 的技能"
- 询问"你能做 X 吗"，而 X 是一种专业能力
- 表达希望扩展代理功能的兴趣
- 想要搜索工具、模板或工作流
- 提到希望在特定领域（如设计、测试、部署等）获得帮助

## 什么是 Skills CLI？

Skills CLI（npx skills）是开放代理技能生态系统的包管理器。技能是以模块化包的形式存在，用于通过专业知识、工作流和工具来扩展代理的能力。

主要命令：

\`\`\`
npx skills find [query]    - 通过关键词交互式地搜索技能
npx skills add <package>   - 从 GitHub 或其他来源安装技能
npx skills check           - 检查技能更新
npx skills update          - 更新所有已安装的技能
\`\`\`

浏览技能请访问：https://skills.sh/

## 如何帮助用户查找技能

### 步骤 1：理解用户需求

当用户请求帮助时，请识别：

- 领域（例如 React、测试、设计、部署）
- 具体任务（例如编写测试、创建动画、审查 PR）
- 该任务是否足够常见，很可能已有对应技能存在

### 步骤 2：先查看排行榜

在运行 CLI 搜索之前，请先查看 skills.sh 排行榜，确认该领域是否已有知名技能。排行榜按总安装量对技能进行排名，展示最受欢迎且经过实战检验的选项。

例如，Web 开发领域的热门技能包括：

- vercel-labs/agent-skills — React、Next.js、网页设计（每个技能安装量超 10 万次）
- anthropics/skills — 前端设计、文档处理（安装量超 10 万次）

### 步骤 3：搜索技能

如果排行榜未覆盖用户需求，则运行 find 命令：

\`\`\`
npx skills find [query]
\`\`\`

例如：

- 用户提问"如何让我的 React 应用更快？" → \`npx skills find react performance\`
- 用户提问"你能帮我做 PR 审查吗？" → \`npx skills find pr review\`
- 用户提问"我需要生成一份 changelog" → \`npx skills find changelog\`

### 步骤 4：推荐前验证质量

切勿仅凭搜索结果就推荐技能。务必验证：

- **安装次数** — 优先选择安装量超过 1000 次的技能。对安装量低于 100 的技能请保持谨慎。
- **来源可信度** — 官方来源（如 vercel-labs、anthropics、microsoft）比未知作者更值得信赖。
- **GitHub Stars 数量** — 检查源代码仓库。来自 Stars 数量少于 100 的仓库的技能应持怀疑态度。

### 步骤 5：向用户展示选项

当你找到相关技能时，请向用户提供以下信息：

- 技能名称及其功能
- 安装次数和来源
- 用户可运行的安装命令
- 指向 skills.sh 的链接，以便了解更多信息

### 步骤 6：提供安装选项

如果用户希望继续，你可以为他们安装该技能：

\`\`\`
npx skills add <owner/repo@skill> -g -y
\`\`\`

-g 标志表示全局（用户级别）安装，-y 标志跳过确认提示。

## 常见技能类别

| 类别 | 示例查询关键词 |
|------|--------------|
| Web 开发 | react, nextjs, typescript, css, tailwind |
| 测试 | testing, jest, playwright, e2e |
| DevOps | deploy, docker, kubernetes, ci-cd |
| 文档 | docs, readme, changelog, api-docs |
| 代码质量 | review, lint, refactor, best-practices |
| 设计 | ui, ux, design-system, accessibility |
| 效率提升 | workflow, automation, git |

## 未找到相关技能时

如果没有找到相关技能：

1. 明确告知用户未找到现有技能
2. 主动提出使用你的通用能力直接协助完成任务
3. 建议用户可通过 \`npx skills init\` 创建自己的技能`,
    files: {
      "index.ts": `import { searchRegistry, installSkill } from "@skills-sdk/registry";

export default async function findSkills(query: string) {
  const results = await searchRegistry(query, {
    sortBy: "downloads",
    limit: 10,
  });

  return results.map((skill) => ({
    name: skill.name,
    author: skill.author,
    downloads: skill.downloads,
    description: skill.description,
    installCommand: \`npx skills add \${skill.id}\`,
  }));
}`,
      "schema.json": `{
  "name": "find-skills",
  "description": "Search and discover agent skills from the registry",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query for finding skills"
      },
      "category": {
        "type": "string",
        "enum": ["web", "code", "devops", "data", "media"],
        "description": "Filter by skill category"
      },
      "sortBy": {
        "type": "string",
        "enum": ["downloads", "stars", "newest"],
        "description": "Sort results by"
      }
    },
    "required": ["query"]
  }
}`,
      "README.md": "# Find Skills\n\nSearch and install agent skills from the community registry.",
    },
    demoInput: "帮我找一个能搜索网页的技能",
    demoOutput: `[
  {
    "name": "web-search",
    "author": "@inference-sh",
    "downloads": "15.2k",
    "description": "Search the web with multiple search engines",
    "installCommand": "npx skills add @inference-sh/web-search"
  },
  {
    "name": "agent-reach",
    "author": "@community",
    "downloads": "8.3k",
    "description": "Search and interact with 13+ platforms",
    "installCommand": "npx skills add @community/agent-reach"
  }
]`,
    triggers: [
      "找技能", "搜索技能", "发现技能", "有什么技能", "推荐技能",
      "find skills", "search skills", "discover skills", "browse skills",
      "安装技能", "install skill", "add skill",
    ],
    tags: ["discovery", "registry", "marketplace", "vercel"],
    featured: true,
    trending: true,
    difficulty: "beginner",
  },
  {
    id: "frontend-design",
    name: "frontend-design",
    title: "Frontend Design — UI/UX Design Agent",
    description: "Generate beautiful frontend designs, UI components, and complete page layouts from natural language descriptions. Supports React, Vue, Tailwind CSS and more.",
    avatar: "",
    author: "@anthropics",
    authorBadge: "Official",
    developer: "anthropics",
    downloads: 18700,
    stars: 6500,
    rating: 4.5,
    lastUpdated: "2026-04-28",
    collection: "Anthropic Agent Suite",
    category: "Web 开发",
    categorySlug: "web-development",
    installCommand: "npx skills add @anthropics/frontend-design",
    license: "Apache-2.0",
    version: "2.1.0",
    readme: `# Frontend Design — UI/UX Design Agent

由 Anthropic 官方发布的前端设计技能，能够从自然语言描述生成完整的 UI 设计。

## 何时使用此技能

- 需要快速生成页面布局和组件
- 想要从文字描述创建 UI 原型
- 需要生成响应式设计代码

## 功能描述

- **页面生成** — 从描述生成完整页面布局
- **组件设计** — 创建可复用的 UI 组件
- **响应式适配** — 自动生成移动端适配方案
- **主题支持** — 支持自定义主题和设计系统

## 使用示例

\`\`\`
帮我设计一个登录页面，深色风格
生成一个 Dashboard 布局，左侧边栏 + 顶部导航
创建一个产品卡片组件，要支持暗黑模式
\`\`\``,
    files: {
      "index.ts": `export default async function frontendDesign(prompt: string) {
  const design = await generateDesign(prompt, {
    framework: "react",
    styling: "tailwindcss",
    responsive: true,
  });

  return {
    code: design.code,
    preview: design.screenshot,
    components: design.extractedComponents,
  };
}`,
      "schema.json": `{
  "name": "frontend-design",
  "description": "Generate frontend UI designs from natural language",
  "parameters": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "Description of the desired UI design"
      },
      "framework": {
        "type": "string",
        "enum": ["react", "vue", "svelte"],
        "description": "Target framework"
      }
    },
    "required": ["prompt"]
  }
}`,
      "README.md": "# Frontend Design\n\nGenerate beautiful UI designs from natural language descriptions.",
    },
    demoInput: "帮我设计一个深色风格的登录页面",
    demoOutput: `// Generated React + Tailwind component
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        <form className="space-y-4">
          <input className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white" placeholder="Email" />
          <input className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white" placeholder="Password" type="password" />
          <button className="w-full py-3 bg-blue-600 rounded-lg text-white font-medium">Sign In</button>
        </form>
      </div>
    </div>
  );
}`,
    triggers: [
      "设计页面", "UI设计", "前端设计", "生成组件", "页面布局",
      "design UI", "frontend design", "create component", "page layout",
      "登录页", "dashboard", "landing page",
    ],
    tags: ["frontend", "design", "ui", "react", "tailwind"],
    featured: true,
    trending: true,
    difficulty: "intermediate",
  },
  {
    id: "web-search",
    name: "web-search",
    title: "Web Search — Multi-Engine Web Search",
    description: "Search the web using multiple search engines. Supports Google, Bing, DuckDuckGo and more. Returns structured results with titles, snippets, and URLs.",
    avatar: "",
    author: "@inference-sh",
    developer: "inference-sh",
    downloads: 15200,
    stars: 4800,
    rating: 3.8,
    lastUpdated: "2026-04-25",
    collection: "Inference.sh Toolkit",
    category: "Web 搜索",
    categorySlug: "web-search",
    installCommand: "npx skills add @inference-sh/web-search",
    license: "MIT",
    version: "3.0.1",
    readme: `# Web Search — Multi-Engine Search

支持多种搜索引擎的网页搜索技能，返回结构化的搜索结果。

## 何时使用此技能

- Agent 需要获取最新网络信息
- 需要搜索特定主题的内容
- 需要验证某个事实或数据

## 功能描述

- **多引擎搜索** — 支持 Google、Bing、DuckDuckGo
- **结构化结果** — 返回标题、摘要、URL
- **区域过滤** — 支持按地区和语言过滤
- **时间过滤** — 支持按时间范围搜索

## 使用示例

\`\`\`
搜索最新的 AI Agent 框架
查一下 2026 年最流行的编程语言
搜一下 Next.js 16 的新特性
\`\`\``,
    files: {
      "index.ts": `import { search } from "@inference-sh/search-sdk";

export default async function webSearch(query: string, options?: {
  engine?: "google" | "bing" | "duckduckgo";
  region?: string;
  timeRange?: "day" | "week" | "month" | "year";
}) {
  const results = await search(query, {
    engine: options?.engine || "google",
    region: options?.region,
    timeRange: options?.timeRange,
    maxResults: 10,
  });

  return results.map((r) => ({
    title: r.title,
    snippet: r.snippet,
    url: r.url,
  }));
}`,
      "schema.json": `{
  "name": "web-search",
  "description": "Search the web with multiple search engines",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query"
      },
      "engine": {
        "type": "string",
        "enum": ["google", "bing", "duckduckgo"],
        "description": "Search engine to use"
      }
    },
    "required": ["query"]
  }
}`,
      "README.md": "# Web Search\n\nMulti-engine web search for AI agents.",
    },
    demoInput: "搜索最新的 AI Agent 框架",
    demoOutput: `[
  {
    "title": "Top 10 AI Agent Frameworks in 2026",
    "snippet": "A comprehensive overview of the most popular AI agent frameworks...",
    "url": "https://example.com/ai-agent-frameworks-2026"
  },
  {
    "title": "Building AI Agents with Next.js - A Complete Guide",
    "snippet": "Learn how to build and deploy AI agents using Next.js 16...",
    "url": "https://example.com/nextjs-ai-agents"
  }
]`,
    triggers: [
      "搜索", "搜一下", "上网搜", "帮我查", "search", "web search",
      "google", "bing", "搜索网页", "查一下", "搜搜看",
    ],
    tags: ["search", "web", "google", "information-retrieval"],
    featured: true,
    trending: true,
    difficulty: "beginner",
  },
  {
    id: "agent-reach",
    name: "agent-reach",
    title: "Agent Reach — 全网搜索与交互",
    description: "搜索、读取和交互 13+ 主流平台。支持 Twitter/X、YouTube、Bilibili、小红书、抖音、微信公众号、LinkedIn、GitHub 等。",
    avatar: "",
    author: "@community",
    developer: "community",
    downloads: 8300,
    stars: 2000,
    rating: 4.7,
    lastUpdated: "2026-04-20",
    collection: "社区精选",
    category: "多平台交互",
    categorySlug: "multi-platform",
    installCommand: "npx skills add @community/agent-reach",
    license: "MIT",
    version: "2.3.0",
    readme: `# Agent Reach — 全网搜索与交互工具

Agent Reach 是一个强大的 AI Agent 技能，能够搜索、读取和交互 13+ 主流平台。

## 何时使用此技能

- 需要从社交媒体获取信息
- 需要搜索多个平台的内容
- 需要读取和分析网页内容

## 支持的平台

- **Twitter/X** — 搜索推文、读取用户时间线、获取完整线程
- **YouTube** — 获取视频元数据、下载字幕、搜索视频
- **Bilibili** — 获取视频信息、下载字幕
- **小红书** — 搜索笔记、获取详情、发布内容
- **抖音** — 解析视频信息、获取下载链接
- **微信公众号** — 搜索文章、阅读全文
- **LinkedIn** — 获取个人资料、搜索人脉
- **GitHub** — 搜索仓库、代码、Issue
- **Reddit** — 搜索帖子、获取热门内容
- **RSS** — 解析任意 RSS Feed

## 使用示例

\`\`\`
搜推特上的 AI Agent 讨论
帮我查小红书上关于春季穿搭的笔记
看这个 YouTube 视频的字幕
搜 GitHub 上 star 最多的 Python Agent 框架
\`\`\``,
    files: {
      "index.ts": `import { PlatformRouter } from "./router";

export default async function agentReach(platform: string, action: string, params: Record<string, unknown>) {
  const router = new PlatformRouter();
  const handler = router.getHandler(platform, action);
  return await handler(params);
}`,
      "schema.json": `{
  "name": "agent-reach",
  "description": "Search and interact with 13+ platforms",
  "parameters": {
    "type": "object",
    "properties": {
      "platform": {
        "type": "string",
        "enum": ["twitter", "youtube", "bilibili", "xiaohongshu", "github", "reddit"],
        "description": "Target platform"
      },
      "action": {
        "type": "string",
        "enum": ["search", "read", "interact"],
        "description": "Action to perform"
      },
      "query": {
        "type": "string",
        "description": "Search query or content identifier"
      }
    },
    "required": ["platform", "action"]
  }
}`,
      "README.md": "# Agent Reach\n\nSearch and interact with 13+ platforms from your AI agent.",
    },
    demoInput: "搜推特上的 AI Agent 讨论",
    demoOutput: `Found 5 recent tweets about "AI Agent":

1. @openai: "Introducing the next generation of AI agents that can browse, code, and create..."
2. @anthropics: "Claude's new agent capabilities are now available in public beta..."
3. @google: "Project Astra: Our vision for the future of AI assistants..."`,
    triggers: [
      "搜推特", "搜小红书", "看视频", "搜一下", "上网搜", "帮我查", "全网搜索",
      "search twitter", "read tweet", "youtube transcript", "search reddit",
      "read this link", "看这个链接", "B站", "bilibili", "抖音视频",
      "微信文章", "公众号", "LinkedIn", "GitHub issue", "RSS",
    ],
    tags: ["social-media", "search", "multi-platform", "scraping"],
    featured: false,
    trending: true,
    difficulty: "intermediate",
  },
  {
    id: "code-executor",
    name: "code-executor",
    title: "Code Executor — 代码执行与调试",
    description: "在沙盒环境中执行 Python、JavaScript、Shell 等代码，支持调试错误、运行测试和代码分析。",
    avatar: "",
    author: "@community",
    developer: "community",
    downloads: 12100,
    stars: 3400,
    rating: 4.1,
    lastUpdated: "2026-04-22",
    collection: "开发者工具",
    category: "代码执行",
    categorySlug: "code-execution",
    installCommand: "npx skills add @community/code-executor",
    license: "MIT",
    version: "1.8.0",
    readme: `# Code Executor — 代码执行与调试

一个能够在安全沙盒环境中执行代码、调试错误、运行测试的 Agent 技能。

## 何时使用此技能

- 需要运行和测试代码片段
- 需要调试代码错误
- 需要执行数据分析脚本

## 功能描述

- **多语言支持** — Python、JavaScript、Shell、Go、Rust
- **沙盒隔离** — 安全的代码执行环境
- **调试模式** — 自动分析错误并提供修复建议
- **测试运行** — 执行单元测试和集成测试

## 使用示例

\`\`\`
帮我运行这段 Python 代码
这个 Bug 怎么修
跑一下测试看看结果
分析这段代码的性能
\`\`\``,
    files: {
      "index.ts": `import { Sandbox } from "@code-executor/sandbox";

export default async function executeCode(language: string, code: string) {
  const sandbox = new Sandbox({ language, timeout: 30000 });
  const result = await sandbox.run(code);
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}`,
      "schema.json": `{
  "name": "code-executor",
  "description": "Execute and debug code in a sandbox environment",
  "parameters": {
    "type": "object",
    "properties": {
      "language": {
        "type": "string",
        "enum": ["python", "javascript", "shell", "go", "rust"],
        "description": "Programming language"
      },
      "code": {
        "type": "string",
        "description": "Code to execute"
      }
    },
    "required": ["language", "code"]
  }
}`,
      "README.md": "# Code Executor\n\nExecute and debug code in a secure sandbox.",
    },
    demoInput: "帮我运行这段 Python 代码: print(sum(range(100)))",
    demoOutput: `Execution Result:
stdout: 4950
stderr: (empty)
exitCode: 0

Execution time: 0.12s`,
    triggers: [
      "运行代码", "执行代码", "debug", "调试", "跑测试", "run code",
      "execute", "fix bug", "代码报错", "run python", "run javascript",
    ],
    tags: ["code", "execution", "debugging", "sandbox"],
    featured: false,
    trending: true,
    difficulty: "advanced",
  },
  {
    id: "file-manager",
    name: "file-manager",
    title: "File Manager — 文件管理与处理",
    description: "读取、写入、转换各种文件格式。支持 PDF、Markdown、JSON、CSV、图片等格式的处理和转换。",
    avatar: "",
    author: "@community",
    developer: "community",
    downloads: 9800,
    stars: 2800,
    rating: 3.9,
    lastUpdated: "2026-04-18",
    collection: "效率工具",
    category: "文件处理",
    categorySlug: "file-processing",
    installCommand: "npx skills add @community/file-manager",
    license: "MIT",
    version: "1.5.3",
    readme: `# File Manager — 文件管理与处理

一个能够读取、写入、转换各种文件格式的 Agent 技能。

## 何时使用此技能

- 需要处理各种格式的文件
- 需要在不同格式之间转换文件
- 需要批量处理文件

## 功能描述

- **文件读写** — 读取和写入各种文本文件
- **格式转换** — PDF、Markdown、JSON、CSV 等格式互转
- **图片处理** — 图片压缩、格式转换、OCR 文字识别
- **数据处理** — CSV/Excel 数据清洗和分析

## 使用示例

\`\`\`
帮我读取这个 PDF 文件
把这个 CSV 转成 JSON
批量重命名这些文件
\`\`\``,
    files: {
      "index.ts": `import { readFile, writeFile, convert } from "@file-manager/core";

export default async function manageFile(action: string, path: string, options?: Record<string, unknown>) {
  switch (action) {
    case "read": return await readFile(path);
    case "write": return await writeFile(path, options?.content);
    case "convert": return await convert(path, options?.targetFormat);
    default: throw new Error(\`Unknown action: \${action}\`);
  }
}`,
      "schema.json": `{
  "name": "file-manager",
  "description": "Manage and convert files in various formats",
  "parameters": {
    "type": "object",
    "properties": {
      "action": {
        "type": "string",
        "enum": ["read", "write", "convert", "compress"],
        "description": "File operation"
      },
      "path": {
        "type": "string",
        "description": "File path"
      }
    },
    "required": ["action", "path"]
  }
}`,
      "README.md": "# File Manager\n\nRead, write, and convert files in various formats.",
    },
    demoInput: "把这个 CSV 转成 JSON",
    demoOutput: `Conversion complete!

Input: data.csv (245 rows, 8 columns)
Output: data.json (245 records)

Preview (first 2 records):
[
  { "id": 1, "name": "Alice", "score": 95 },
  { "id": 2, "name": "Bob", "score": 87 }
]`,
    triggers: [
      "读文件", "写文件", "文件转换", "PDF", "CSV", "read file",
      "convert file", "batch rename", "OCR", "图片处理", "JSON转换",
    ],
    tags: ["files", "conversion", "pdf", "csv", "ocr"],
    featured: false,
    trending: false,
    difficulty: "beginner",
  },
  {
    id: "email-sender",
    name: "email-sender",
    title: "Email Sender — 邮件发送与管理",
    description: "发送和管理电子邮件。支持 HTML 模板、附件、批量发送、定时发送等功能。",
    avatar: "",
    author: "@community",
    developer: "community",
    downloads: 6500,
    stars: 1800,
    rating: 4.6,
    lastUpdated: "2026-04-15",
    collection: "效率工具",
    category: "通讯协作",
    categorySlug: "communication",
    installCommand: "npx skills add @community/email-sender",
    license: "MIT",
    version: "1.2.0",
    readme: `# Email Sender — 邮件发送与管理

一个能够发送和管理电子邮件的 Agent 技能。

## 何时使用此技能

- 需要自动发送邮件通知
- 需要批量发送营销邮件
- 需要发送带附件的邮件

## 功能描述

- **邮件发送** — 支持纯文本和 HTML 格式
- **模板系统** — 预设邮件模板，支持变量替换
- **附件支持** — 支持各种文件格式的附件
- **批量发送** — 支持批量发送和定时发送

## 使用示例

\`\`\`
给团队发一封周报邮件
发送会议邀请给所有参与者
批量发送客户通知
\`\`\``,
    files: {
      "index.ts": `import { createTransport } from "@email-sender/transport";

export default async function sendEmail(to: string, subject: string, body: string, options?: {
  html?: boolean;
  attachments?: string[];
  scheduled?: string;
}) {
  const transporter = createTransport();
  return await transporter.send({ to, subject, body, ...options });
}`,
      "schema.json": `{
  "name": "email-sender",
  "description": "Send and manage emails",
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string", "description": "Recipient email" },
      "subject": { "type": "string", "description": "Email subject" },
      "body": { "type": "string", "description": "Email body" }
    },
    "required": ["to", "subject", "body"]
  }
}`,
      "README.md": "# Email Sender\n\nSend and manage emails with templates and attachments.",
    },
    demoInput: "给团队发一封周报邮件",
    demoOutput: `Email sent successfully!

To: team@company.com
Subject: Weekly Report - Week 18
Format: HTML
Status: Delivered`,
    triggers: [
      "发邮件", "发送邮件", "邮件通知", "send email", "email",
      "发通知", "批量邮件", "邮件模板",
    ],
    tags: ["email", "communication", "notifications"],
    featured: false,
    trending: false,
    difficulty: "intermediate",
  },
  {
    id: "data-analyst",
    name: "data-analyst",
    title: "Data Analyst — 数据分析与可视化",
    description: "分析数据集并生成可视化图表。支持 CSV、Excel、JSON 数据源，生成折线图、柱状图、饼图等。",
    avatar: "",
    author: "@community",
    developer: "community",
    downloads: 11400,
    stars: 3100,
    rating: 4.3,
    lastUpdated: "2026-04-26",
    collection: "数据工具",
    category: "数据分析",
    categorySlug: "data-analysis",
    installCommand: "npx skills add @community/data-analyst",
    license: "MIT",
    version: "2.0.0",
    readme: `# Data Analyst — 数据分析与可视化

一个能够分析数据集并生成可视化图表的 Agent 技能。

## 何时使用此技能

- 需要分析 CSV/Excel 数据
- 需要生成数据可视化图表
- 需要进行数据清洗和统计分析

## 功能描述

- **数据加载** — 支持 CSV、Excel、JSON、SQL 数据源
- **统计分析** — 均值、中位数、标准差、相关性分析
- **可视化** — 折线图、柱状图、饼图、散点图、热力图
- **数据清洗** — 去重、填充缺失值、格式转换

## 使用示例

\`\`\`
分析这份销售数据，生成月度趋势图
这个 CSV 里有哪些异常值？
帮我做一个用户留存分析
\`\`\``,
    files: {
      "index.ts": `import { loadData, analyze, visualize } from "@data-analyst/core";

export default async function analyzeData(source: string, analysis: string) {
  const data = await loadData(source);
  const result = await analyze(data, analysis);
  const chart = await visualize(result);
  return { summary: result.summary, chart: chart.url };
}`,
      "schema.json": `{
  "name": "data-analyst",
  "description": "Analyze data and generate visualizations",
  "parameters": {
    "type": "object",
    "properties": {
      "source": { "type": "string", "description": "Data source path or URL" },
      "analysis": { "type": "string", "description": "Type of analysis" }
    },
    "required": ["source"]
  }
}`,
      "README.md": "# Data Analyst\n\nAnalyze data and create beautiful visualizations.",
    },
    demoInput: "分析这份销售数据，生成月度趋势图",
    demoOutput: `Analysis Complete!

Dataset: sales_2026.csv (1,234 rows)
Period: Jan - Apr 2026

Key Insights:
- Total Revenue: ¥2,456,789 (+12.3% MoM)
- Best Month: March (¥789,012)
- Top Product: Widget Pro (34% of sales)

Chart generated: monthly_trend.png`,
    triggers: [
      "分析数据", "数据可视化", "生成图表", "CSV分析", "Excel分析",
      "analyze data", "data visualization", "create chart", "统计分析",
    ],
    tags: ["data", "analytics", "visualization", "charts"],
    featured: true,
    trending: false,
    difficulty: "advanced",
  },
  {
    id: "langchain",
    name: "langchain",
    title: "LangChain — LLM Application Framework",
    description: "The agent engineering platform for building LLM-powered applications with chains, agents, and retrieval",
    avatar: "🦜",
    author: "@langchain-ai",
    authorBadge: "Verified",
    developer: "langchain-ai",
    downloads: 136200,
    stars: 136220,
    rating: 4.6,
    lastUpdated: "2026-05-01",
    collection: "AI Frameworks",
    category: "Research",
    categorySlug: "research",
    installCommand: "pip install langchain",
    license: "MIT",
    version: "0.3.25",
    readme: `# LangChain — LLM Application Framework

LangChain is the most popular framework for building LLM-powered applications. It provides composable building blocks for chains, agents, retrieval-augmented generation (RAG), and more.

## Key Features

- **Chains** — Composable sequences of calls to LLMs and tools
- **Agents** — Autonomous LLM-powered decision makers
- **RAG** — Connect LLMs to your own data with retrieval
- **Memory** — Persistent conversation state across interactions
- **Integrations** — 750+ integrations with LLMs, tools, and data stores

## Quick Start

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("user", "{input}")
])
chain = prompt | llm
result = chain.invoke({"input": "What is LangChain?"})
\`\`\``,
    files: {
      "agent.py": `from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

def create_agent(tools, system_prompt="You are a helpful assistant."):
    llm = ChatOpenAI(model="gpt-4o")
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("placeholder", "{chat_history}"),
        ("user", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)`,
      "README.md": "# LangChain Agent\n\nBuild LLM agents with LangChain's composable framework.",
    },
    demoInput: "Create an agent that can search the web and summarize results",
    demoOutput: `Agent created with tools: [WebSearch, Summarizer]

Query: "Latest AI news May 2026"

Step 1: Calling WebSearch("Latest AI news May 2026")
Step 2: Found 5 results, calling Summarizer

Result: "In May 2026, several major AI developments emerged..."`,
    triggers: ["langchain", "llm agent", "chain", "rag", "retrieval", "ai framework", "build agent", "创建agent"],
    tags: ["agents", "llm", "rag", "framework", "python"],
    featured: true,
    trending: true,
    difficulty: "intermediate",
    verified: true,
  },
  {
    id: "crewai",
    name: "crewai",
    title: "CrewAI — Multi-Agent Orchestration",
    description: "Framework for orchestrating role-playing, autonomous AI agents that collaborate on complex tasks",
    avatar: "👥",
    author: "@crewAIInc",
    authorBadge: "Verified",
    developer: "crewAIInc",
    downloads: 50900,
    stars: 50976,
    rating: 4.4,
    lastUpdated: "2026-04-28",
    collection: "AI Frameworks",
    category: "Productivity",
    categorySlug: "productivity",
    installCommand: "pip install crewai",
    license: "MIT",
    version: "0.108.0",
    readme: `# CrewAI — Multi-Agent Orchestration

CrewAI enables you to create teams of AI agents with specific roles, goals, and backstories that collaborate to accomplish complex tasks.

## Key Features

- **Role-Based Agents** — Define agents with specific roles and expertise
- **Task Delegation** — Agents can delegate tasks to each other
- **Sequential & Parallel Processes** — Flexible execution flows
- **Tool Integration** — Give agents access to external tools
- **Memory** — Agents maintain context across interactions

## Quick Start

\`\`\`python
from crewai import Agent, Task, Crew

researcher = Agent(role="Researcher", goal="Find accurate info", backstory="Expert analyst")
writer = Agent(role="Writer", goal="Create engaging content", backstory="Experienced writer")

task1 = Task(description="Research AI trends", agent=researcher)
task2 = Task(description="Write article", agent=writer)

crew = Crew(agents=[researcher, writer], tasks=[task1, task2])
result = crew.kickoff()
\`\`\``,
    files: {
      "crew.py": `from crewai import Agent, Task, Crew, Process

def create_research_crew(topic):
    researcher = Agent(
        role="Senior Researcher",
        goal=f"Research {topic} thoroughly",
        backstory="You are an expert researcher with deep domain knowledge."
    )
    writer = Agent(
        role="Content Writer",
        goal="Write clear, engaging summaries",
        backstory="You are a skilled technical writer."
    )

    research_task = Task(
        description=f"Research {topic} and compile key findings",
        agent=researcher,
        expected_output="Detailed research findings with sources"
    )
    write_task = Task(
        description="Write a clear summary of the research",
        agent=writer,
        expected_output="Well-structured article"
    )

    return Crew(agents=[researcher, writer], tasks=[research_task, write_task], process=Process.sequential)`,
      "README.md": "# CrewAI Multi-Agent\n\nCreate collaborative AI agent teams with CrewAI.",
    },
    demoInput: "Create a research team to analyze market trends",
    demoOutput: `Crew: Market Analysis Team
├── Agent 1: Senior Researcher
│   └── Task: Research market trends and data
├── Agent 2: Data Analyst
│   └── Task: Analyze findings and identify patterns
└── Agent 3: Report Writer
    └── Task: Compile final market report

Process: Sequential
Result: 15-page market analysis report generated`,
    triggers: ["crewai", "multi-agent", "agent team", "orchestration", "协作", "团队agent", "role-playing"],
    tags: ["agents", "orchestration", "multi-agent", "automation", "llm"],
    featured: true,
    trending: true,
    difficulty: "intermediate",
    verified: true,
  },
  {
    id: "llama-index",
    name: "llama-index",
    title: "LlamaIndex — Data Agent Framework",
    description: "The leading framework for connecting LLMs with external data through RAG, document agents, and OCR",
    avatar: "🦙",
    author: "@run-llama",
    authorBadge: "Verified",
    developer: "run-llama",
    downloads: 49200,
    stars: 49257,
    rating: 4.5,
    lastUpdated: "2026-05-02",
    collection: "AI Frameworks",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install llama-index",
    license: "MIT",
    version: "0.12.30",
    readme: `# LlamaIndex — Data Agent Framework

LlamaIndex is the leading framework for building data agents that can reason over your private data using LLMs.

## Key Features

- **Data Connectors** — Ingest data from 160+ sources
- **Vector Store Integration** — Pinecone, Weaviate, Chroma, and more
- **Query Engines** — Natural language queries over your data
- **Document Agents** — Autonomous agents that work with documents
- **OCR** — Extract text from images and scanned documents

## Quick Start

\`\`\`python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What are the key findings?")
print(response)
\`\`\``,
    files: {
      "query_engine.py": `from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI

def create_query_engine(data_dir, model="gpt-4o"):
    documents = SimpleDirectoryReader(data_dir).load_data()
    llm = OpenAI(model=model, temperature=0)
    index = VectorStoreIndex.from_documents(documents)
    return index.as_query_engine(llm=llm)`,
      "README.md": "# LlamaIndex Query Engine\n\nBuild data agents that reason over your documents.",
    },
    demoInput: "Query my PDF documents about Q1 revenue",
    demoOutput: `Query: "What was Q1 revenue growth?"

Sources: Q1_2026_report.pdf (page 3, 7)

Response: Q1 2026 revenue grew 23% YoY to $4.2B, driven by
strong performance in cloud services (+31%) and enterprise
licenses (+18%). Key growth markets were APAC (+42%) and
EMEA (+28%).`,
    triggers: ["llamaindex", "rag", "document query", "data agent", "pdf查询", "文档问答", "vector store"],
    tags: ["rag", "data", "agents", "documents", "ocr"],
    featured: true,
    trending: true,
    difficulty: "intermediate",
    verified: true,
  },
  {
    id: "screenshot-to-code",
    name: "screenshot-to-code",
    title: "Screenshot-to-Code — AI Code Generation from Images",
    description: "Drop in a screenshot and convert it to clean code (HTML/Tailwind/React/Vue) using AI vision",
    avatar: "📸",
    author: "@abi",
    authorBadge: "Verified",
    developer: "abi",
    downloads: 72500,
    stars: 72503,
    rating: 4.7,
    lastUpdated: "2026-04-25",
    collection: "AI Frameworks",
    category: "Web Development",
    categorySlug: "web-development",
    installCommand: "npx skills add @abi/screenshot-to-code",
    license: "MIT",
    version: "3.2.0",
    readme: `# Screenshot-to-Code

Convert screenshots, mockups, and designs into clean, functional code using AI vision models.

## Key Features

- **Multi-Framework** — Generates HTML/Tailwind, React, Vue, or Svelte code
- **GPT-4 Vision** — Uses advanced vision models for accurate conversion
- **Iterative Refinement** — Chat to refine the generated code
- **Video Support** — Convert screen recordings to code
- **Component Detection** — Identifies and generates reusable components

## How It Works

1. Upload a screenshot or mockup
2. AI analyzes the visual layout
3. Clean, responsive code is generated
4. Refine with follow-up instructions`,
    files: {
      "converter.ts": `interface ConversionResult {
  code: string;
  framework: "react" | "vue" | "html";
  components: string[];
}

async function screenshotToCode(
  imageBase64: string,
  framework: "react" | "vue" | "html" = "react"
): Promise<ConversionResult> {
  const response = await fetch("/api/convert", {
    method: "POST",
    body: JSON.stringify({ image: imageBase64, framework }),
  });
  return response.json();
}`,
      "README.md": "# Screenshot-to-Code\n\nConvert designs to code with AI vision.",
    },
    demoInput: "[Upload screenshot of a pricing page]",
    demoOutput: `// Generated React + Tailwind component
export default function PricingPage() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Simple, transparent pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pricing cards generated... */}
        </div>
      </div>
    </div>
  );
}`,
    triggers: ["screenshot to code", "design to code", "mockup", "psd转代码", "截图生成代码", "ui to code", "figma to code"],
    tags: ["code-generation", "design", "html", "react", "tailwind"],
    featured: true,
    trending: true,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "semantic-kernel",
    name: "semantic-kernel",
    title: "Semantic Kernel — Microsoft AI SDK",
    description: "Integrate cutting-edge LLM technology quickly and easily into your apps with Microsoft's AI orchestration SDK",
    avatar: "🧠",
    author: "@microsoft",
    authorBadge: "Verified",
    developer: "microsoft",
    downloads: 27800,
    stars: 27865,
    rating: 4.3,
    lastUpdated: "2026-04-20",
    collection: "Enterprise SDKs",
    category: "DevOps",
    categorySlug: "devops",
    installCommand: "pip install semantic-kernel",
    license: "MIT",
    version: "1.28.0",
    readme: `# Semantic Kernel — Microsoft AI SDK

Semantic Kernel is an open-source SDK that lets you easily build agents that can call your existing code.

## Key Features

- **Plugin Architecture** — Encapsulate prompts and functions as plugins
- **Multi-Language** — C#, Python, and Java support
- **Auto Function Calling** — LLMs automatically invoke your functions
- **Planners** — AI-powered task planning and execution
- **Memory** — Built-in vector store support for RAG

## Quick Start

\`\`\`python
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

kernel = sk.Kernel()
kernel.add_service(OpenAIChatCompletion("gpt-4o"))

# Create a plugin
plugin = kernel.add_plugin("my_plugin", "path/to/plugin")
result = await kernel.invoke(plugin["my_function"], input="Hello")
\`\`\``,
    files: {
      "kernel_setup.py": `import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.functions import kernel_function

class MathPlugin:
    @kernel_function(description="Evaluate a math expression")
    def evaluate(self, expression: str) -> str:
        return str(eval(expression))

def create_kernel():
    kernel = sk.Kernel()
    kernel.add_service(OpenAIChatCompletion("gpt-4o"))
    kernel.add_plugin(MathPlugin(), "math")
    return kernel`,
      "README.md": "# Semantic Kernel Agent\n\nBuild AI agents with Microsoft's Semantic Kernel SDK.",
    },
    demoInput: "Create a plugin that can do math and search the web",
    demoOutput: `Plugin registered: "productivity"
├── math.evaluate(expression: str) -> str
├── web.search(query: str) -> list[SearchResult]
└── web.summarize(url: str) -> str

Kernel ready. Try: "What's 42 * 17 + 3?"`,
    triggers: ["semantic kernel", "microsoft ai", "sk plugin", "ai sdk", "微软ai", "plugin架构"],
    tags: ["ai", "llm", "sdk", "openai", "microsoft"],
    featured: false,
    trending: false,
    difficulty: "advanced",
    verified: true,
  },
  {
    id: "pydantic-ai",
    name: "pydantic-ai",
    title: "Pydantic AI — Type-Safe Agent Framework",
    description: "AI Agent Framework, the Pydantic way — type-safe, structured agent development with built-in validation",
    avatar: "📐",
    author: "@pydantic",
    authorBadge: "Verified",
    developer: "pydantic",
    downloads: 16900,
    stars: 16948,
    rating: 4.5,
    lastUpdated: "2026-04-30",
    collection: "AI Frameworks",
    category: "Productivity",
    categorySlug: "productivity",
    installCommand: "pip install pydantic-ai",
    license: "MIT",
    version: "0.2.5",
    readme: `# Pydantic AI — Type-Safe Agent Framework

Pydantic AI brings the Pydantic philosophy to AI agent development — type safety, validation, and clean APIs.

## Key Features

- **Type-Safe** — Full type hints and IDE support
- **Structured Output** — Use Pydantic models for LLM output
- **Tool Calling** — Type-safe tool definitions with automatic validation
- **Dependencies** — Inject typed dependencies into agents
- **Streaming** — Stream structured responses

## Quick Start

\`\`\`python
from pydantic_ai import Agent
from pydantic import BaseModel

class CityInfo(BaseModel):
    city: str
    country: str
    population: int

agent = Agent("openai:gpt-4o", result_type=CityInfo)
result = await agent.run("Tell me about Tokyo")
print(result.data)  # CityInfo(city="Tokyo", country="Japan", population=13960000)
\`\`\``,
    files: {
      "agent.py": `from pydantic_ai import Agent, RunContext
from pydantic import BaseModel

class AnalysisResult(BaseModel):
    summary: str
    key_points: list[str]
    confidence: float

def create_analyst():
    return Agent(
        "openai:gpt-4o",
        result_type=AnalysisResult,
        system_prompt="You are a data analyst. Provide structured analysis."
    )`,
      "README.md": "# Pydantic AI Agent\n\nType-safe AI agents with Pydantic validation.",
    },
    demoInput: "Analyze this data and provide structured output",
    demoOutput: `AnalysisResult(
    summary="Revenue grew 23% QoQ driven by cloud expansion",
    key_points=[
        "Cloud services: +31% YoY",
        "Enterprise: +18% YoY",
        "APAC region: +42% growth leader"
    ],
    confidence=0.92
)`,
    triggers: ["pydantic ai", "type-safe agent", "structured output", "验证", "类型安全", "pydantic agent"],
    tags: ["agents", "pydantic", "python", "llm", "type-safe"],
    featured: false,
    trending: true,
    difficulty: "intermediate",
    verified: true,
  },
  {
    id: "vanna",
    name: "vanna",
    title: "Vanna — Text-to-SQL AI Agent",
    description: "Chat with your SQL database — accurate Text-to-SQL generation via LLMs using Agentic Retrieval",
    avatar: "🗄️",
    author: "@vanna-ai",
    developer: "vanna-ai",
    downloads: 23400,
    stars: 23402,
    rating: 4.3,
    lastUpdated: "2026-04-18",
    collection: "Data Tools",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install vanna",
    license: "MIT",
    version: "0.7.5",
    readme: `# Vanna — Text-to-SQL AI Agent

Vanna allows you to chat with your SQL database using natural language. It uses RAG to learn your database schema and generate accurate SQL queries.

## Key Features

- **Text-to-SQL** — Ask questions in plain English
- **RAG-Based** — Learns your schema for accurate queries
- **Self-Learning** — Improves from feedback
- **Multi-DB** — Supports PostgreSQL, MySQL, BigQuery, Snowflake
- **Visualization** — Auto-generates charts from query results

## Quick Start

\`\`\`python
import vanna as vn
from vanna.chromadb import ChromaDB_VectorStore
from vanna.openai import OpenAI

class MyVanna(ChromaDB_VectorStore, OpenAI):
    pass

vn = MyVanna()
vn.connect_to_postgres("localhost", "mydb", "user", "pass")
df = vn.ask("What were our top 10 customers last month?")
vn.generate_followup_questions(df)
\`\`\``,
    files: {
      "query_agent.py": `import vanna as vn
from vanna.chromadb import ChromaDB_VectorStore
from vanna.openai import OpenAI

class DataAgent(ChromaDB_VectorStore, OpenAI):
    pass

def create_data_agent(db_url):
    agent = DataAgent()
    agent.connect_to_postgres(db_url)
    return agent

def query(agent, question):
    sql = agent.generate_sql(question)
    df = agent.run_sql(sql)
    return df, sql`,
      "README.md": "# Vanna Text-to-SQL\n\nChat with your database using natural language.",
    },
    demoInput: "What were our top 5 products by revenue last quarter?",
    demoOutput: `Generated SQL:
SELECT p.name, SUM(o.amount) as revenue
FROM products p JOIN orders o ON p.id = o.product_id
WHERE o.date >= '2026-01-01' AND o.date < '2026-04-01'
GROUP BY p.name ORDER BY revenue DESC LIMIT 5;

Result:
| Product     | Revenue    |
|-------------|------------|
| Widget Pro  | $2,456,789 |
| Cloud Plan  | $1,892,345 |
| Enterprise  | $1,234,567 |`,
    triggers: ["vanna", "text-to-sql", "sql查询", "数据库查询", "natural language sql", "chat with database"],
    tags: ["sql", "text-to-sql", "data-analysis", "database", "rag"],
    featured: false,
    trending: false,
    difficulty: "intermediate",
  },
  {
    id: "guidance",
    name: "guidance",
    title: "Guidance — Structured LLM Generation",
    description: "A guidance language for controlling large language models with structured generation, regex, and context-free grammars",
    avatar: "🎛️",
    author: "@guidance-ai",
    developer: "guidance-ai",
    downloads: 21400,
    stars: 21448,
    rating: 4.2,
    lastUpdated: "2026-04-15",
    collection: "AI Frameworks",
    category: "Research",
    categorySlug: "research",
    installCommand: "pip install guidance",
    license: "MIT",
    version: "0.2.0",
    readme: `# Guidance — Structured LLM Generation

Guidance enables precise control over LLM outputs using a template-like syntax with regex, context-free grammars, and structured generation.

## Key Features

- **Structured Output** — Constrain generation with regex and grammars
- **Context-Free Grammars** — Define complex output structures
- **Selective Generation** — Choose what the LLM generates vs. what's fixed
- **Multi-Model** — Supports OpenAI, Anthropic, HuggingFace, llama.cpp
- **Few-Shot** — Easy few-shot prompting with templates

## Quick Start

\`\`\`python
from guidance import models, gen, select

model = models.OpenAI("gpt-4o")

with model:
    model += "The best programming language is "
    model += select(["Python", "JavaScript", "Rust", "Go"])
    model += " because "
    model += gen(max_tokens=100, stop=".")
\`\`\``,
    files: {
      "structured_gen.py": `from guidance import models, gen, select, regex

def extract_entities(text, model_name="gpt-4o"):
    model = models.OpenAI(model_name)
    with model:
        model += f"Extract entities from: {text}\n"
        model += "Person: " + gen(regex=r"[A-Z][a-z]+ [A-Z][a-z]+", name="person")
        model += "\nOrganization: " + gen(regex=r"[A-Za-z ]+", name="org")
    return model`,
      "README.md": "# Guidance Structured Generation\n\nControl LLM output with structured generation.",
    },
    demoInput: "Extract structured data from a product description",
    demoOutput: `Input: "The iPhone 16 Pro Max costs $1,199 and has 256GB storage"

Structured Output:
{
  "product": "iPhone 16 Pro Max",
  "price": "$1,199",
  "storage": "256GB"
}

Generation constrained to JSON format via grammar.`,
    triggers: ["guidance", "structured output", "constrained generation", "结构化输出", "regex", "grammar"],
    tags: ["llm", "structured-output", "prompt-engineering", "generation"],
    featured: false,
    trending: false,
    difficulty: "advanced",
  },
  {
    id: "fastapi",
    name: "fastapi",
    title: "FastAPI — High-Performance Python Web Framework",
    description: "High performance, easy to learn, fast to code, ready for production Python web framework for building APIs",
    avatar: "⚡",
    author: "@fastapi",
    authorBadge: "Verified",
    developer: "fastapi",
    downloads: 98000,
    stars: 98043,
    rating: 4.8,
    lastUpdated: "2026-05-03",
    collection: "Web Frameworks",
    category: "Web Development",
    categorySlug: "web-development",
    installCommand: "pip install fastapi",
    license: "MIT",
    version: "0.115.12",
    readme: `# FastAPI — High-Performance Python Web Framework

FastAPI is a modern, fast web framework for building APIs with Python based on standard type hints.

## Key Features

- **Fast** — Very high performance, on par with Node.js and Go
- **Type-Safe** — Automatic validation from Python type hints
- **Auto Docs** — Interactive API documentation (Swagger/ReDoc)
- **Async** — Native async/await support
- **Standards-Based** — OpenAPI and JSON Schema

## Quick Start

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

@app.post("/items/")
async def create_item(item: Item):
    return {"item_name": item.name, "created": True}
\`\`\``,
    files: {
      "api.py": `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Agent API")

class QueryRequest(BaseModel):
    question: str
    context: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    confidence: float
    sources: list[str]

@app.post("/query", response_model=QueryResponse)
async def query_agent(req: QueryRequest):
    # Agent processing here
    return QueryResponse(answer="...", confidence=0.95, sources=["doc1.pdf"])`,
      "README.md": "# FastAPI Agent Backend\n\nBuild high-performance API backends for AI agents.",
    },
    demoInput: "Create an API endpoint for an AI agent query service",
    demoOutput: `POST /query
{
  "question": "What is our refund policy?",
  "context": "customer_support"
}

Response (200):
{
  "answer": "Our refund policy allows returns within 30 days...",
  "confidence": 0.94,
  "sources": ["policy.pdf", "faq.html"]
}

Auto-generated docs at /docs`,
    triggers: ["fastapi", "api", "web server", "python api", "rest api", "后端", "api框架"],
    tags: ["api", "python", "async", "openapi", "web"],
    featured: true,
    trending: false,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "transformers",
    name: "transformers",
    title: "HuggingFace Transformers — ML Model Hub",
    description: "State-of-the-art machine learning models in text, vision, audio, and multimodal — for both inference and training",
    avatar: "🤗",
    author: "@huggingface",
    authorBadge: "Verified",
    developer: "huggingface",
    downloads: 160400,
    stars: 160410,
    rating: 4.7,
    lastUpdated: "2026-05-04",
    collection: "ML Models",
    category: "Research",
    categorySlug: "research",
    installCommand: "pip install transformers",
    license: "Apache-2.0",
    version: "4.51.3",
    readme: `# HuggingFace Transformers

Transformers provides thousands of pretrained models for text, vision, audio, and multimodal tasks.

## Key Features

- **100K+ Models** — Access the largest model hub
- **Multi-Modal** — Text, vision, audio, and more
- **Easy API** — Pipeline abstraction for quick inference
- **Fine-Tuning** — Customize models for your use case
- **Multi-Framework** — PyTorch, TensorFlow, JAX

## Quick Start

\`\`\`python
from transformers import pipeline

# Text classification
classifier = pipeline("sentiment-analysis")
result = classifier("I love this product!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Text generation
generator = pipeline("text-generation", model="gpt2")
result = generator("Once upon a time")
\`\`\``,
    files: {
      "classify.py": `from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

def create_classifier(model_name="distilbert-base-uncased-finetuned-sst-2-english"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    return pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

def classify_batch(texts, classifier):
    return classifier(texts)`,
      "README.md": "# HuggingFace Transformers\n\nAccess 100K+ ML models with a simple pipeline API.",
    },
    demoInput: "Classify the sentiment of these customer reviews",
    demoOutput: `Input: 50 customer reviews

Results:
- Positive: 38 (76%)
- Neutral: 8 (16%)
- Negative: 4 (8%)

Top Positive: "Absolutely love this product! Best purchase ever."
Top Negative: "Terrible quality, broke after one week."

Model: distilbert-base-uncased-finetuned-sst-2-english`,
    triggers: ["huggingface", "transformers", "ml model", "nlp", "机器学习", "预训练模型", "pipeline"],
    tags: ["machine-learning", "nlp", "llm", "pytorch", "model-hub"],
    featured: true,
    trending: true,
    difficulty: "intermediate",
    verified: true,
  },
  {
    id: "mem0",
    name: "mem0",
    title: "Mem0 — Universal Memory for AI Agents",
    description: "Universal memory layer for AI Agents — long-term memory management with intelligent retrieval",
    avatar: "🧠",
    author: "@mem0ai",
    authorBadge: "Verified",
    developer: "mem0ai",
    downloads: 55200,
    stars: 55206,
    rating: 4.5,
    lastUpdated: "2026-05-01",
    collection: "AI Infrastructure",
    category: "Productivity",
    categorySlug: "productivity",
    installCommand: "pip install mem0ai",
    license: "Apache-2.0",
    version: "0.1.88",
    readme: `# Mem0 — Universal Memory for AI Agents

Mem0 provides a universal memory layer that gives AI agents persistent, searchable memory across conversations.

## Key Features

- **Persistent Memory** — Agents remember across sessions
- **Smart Retrieval** — Automatically surfaces relevant memories
- **User-Level Memory** — Per-user memory isolation
- **Multi-Platform** — Works with any LLM framework
- **Conflict Resolution** — Handles contradictory information

## Quick Start

\`\`\`python
from mem0 import Memory

m = Memory()

# Store memories
m.add("I prefer dark mode in all my apps", user_id="alice")
m.add("My favorite language is Python", user_id="alice")

# Retrieve relevant memories
results = m.search("What UI theme does Alice prefer?", user_id="alice")
# Returns: "I prefer dark mode in all my apps"
\`\`\``,
    files: {
      "memory_agent.py": `from mem0 import Memory

class MemoryAgent:
    def __init__(self):
        self.memory = Memory()

    def remember(self, fact: str, user_id: str):
        self.memory.add(fact, user_id=user_id)

    def recall(self, query: str, user_id: str) -> str:
        results = self.memory.search(query, user_id=user_id)
        return results[0]["memory"] if results else "No relevant memories found"

    def get_all_memories(self, user_id: str):
        return self.memory.get_all(user_id=user_id)`,
      "README.md": "# Mem0 Memory Agent\n\nGive your AI agents persistent, searchable memory.",
    },
    demoInput: "Remember that I prefer Python and dark mode",
    demoOutput: `Memory stored for user "alice":
- "Prefers Python as primary language"
- "Uses dark mode in all applications"

Later retrieval: "What theme does Alice use?"
→ "Dark mode" (confidence: 0.97)

Memory count: 12 entries for this user`,
    triggers: ["mem0", "memory", "agent memory", "长期记忆", "记忆层", "persistent memory", "state management"],
    tags: ["memory", "agents", "state-management", "llm", "rag"],
    featured: true,
    trending: true,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "gradio",
    name: "gradio",
    title: "Gradio — ML Demo Builder",
    description: "Build and share delightful machine learning apps, all in Python — from demos to production dashboards",
    avatar: "🎨",
    author: "@gradio-app",
    authorBadge: "Verified",
    developer: "gradio-app",
    downloads: 42500,
    stars: 42534,
    rating: 4.6,
    lastUpdated: "2026-04-28",
    collection: "ML Tools",
    category: "Design",
    categorySlug: "design",
    installCommand: "pip install gradio",
    license: "Apache-2.0",
    version: "5.29.0",
    readme: `# Gradio — ML Demo Builder

Gradio lets you build and share web UIs for machine learning models in just a few lines of Python.

## Key Features

- **Quick Demos** — Create ML demos in 3 lines of code
- **Pre-Built Components** — 30+ UI components
- **Sharing** — One-click public links
- **Customizable** — Full CSS/HTML control
- **Production** — Deploy as API or web app

## Quick Start

\`\`\`python
import gradio as gr

def greet(name, intensity):
    return f"Hello, {name}! {'!' * intensity}"

demo = gr.Interface(
    fn=greet,
    inputs=[gr.Textbox(label="Name"), gr.Slider(1, 10, label="Intensity")],
    outputs=gr.Textbox(label="Greeting")
)
demo.launch()
\`\`\``,
    files: {
      "app.py": `import gradio as gr
from transformers import pipeline

def analyze_sentiment(text):
    classifier = pipeline("sentiment-analysis")
    result = classifier(text)
    label = result[0]["label"]
    score = result[0]["score"]
    return f"{label} (confidence: {score:.2%})"

demo = gr.Interface(
    fn=analyze_sentiment,
    inputs=gr.Textbox(label="Enter text", lines=3),
    outputs=gr.Textbox(label="Sentiment"),
    title="Sentiment Analyzer",
    description="Analyze the sentiment of any text"
)

demo.launch()`,
      "README.md": "# Gradio ML Demo\n\nBuild beautiful ML demos with Gradio.",
    },
    demoInput: "Create a sentiment analysis demo with Gradio",
    demoOutput: `Gradio app created:
- Input: Text area for user input
- Output: Sentiment label + confidence
- Features: Examples, API access, share link

Running at: http://localhost:7860
Public link: https://xxxxx.gradio.live

API endpoint: POST /api/predict`,
    triggers: ["gradio", "ml demo", "web ui", "机器学习demo", "demo app", "share ml"],
    tags: ["ui", "machine-learning", "demo", "python", "data-visualization"],
    featured: false,
    trending: false,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "streamlit",
    name: "streamlit",
    title: "Streamlit — Data App Builder",
    description: "A faster way to build and share data apps — turn data scripts into web apps in minutes",
    avatar: "📊",
    author: "@streamlit",
    authorBadge: "Verified",
    developer: "streamlit",
    downloads: 44500,
    stars: 44514,
    rating: 4.5,
    lastUpdated: "2026-04-30",
    collection: "Data Tools",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install streamlit",
    license: "Apache-2.0",
    version: "1.45.0",
    readme: `# Streamlit — Data App Builder

Streamlit turns Python scripts into shareable web apps in minutes. No frontend experience required.

## Key Features

- **Pure Python** — Build web apps without HTML/CSS/JS
- **Interactive Widgets** — Sliders, buttons, file uploaders
- **Real-Time** — Live updates as code changes
- **Data Viz** — Built-in charting with Altair, Plotly
- **Deployment** — One-click deploy to Streamlit Cloud

## Quick Start

\`\`\`python
import streamlit as st
import pandas as pd

st.title("Sales Dashboard")
data = pd.read_csv("sales.csv")
st.line_chart(data["revenue"])

filter = st.selectbox("Region", data["region"].unique())
st.dataframe(data[data["region"] == filter])
\`\`\``,
    files: {
      "dashboard.py": `import streamlit as st
import pandas as pd
import plotly.express as px

def create_dashboard(csv_path):
    st.set_page_config(page_title="AI Data Dashboard", layout="wide")
    st.title("📊 AI-Powered Data Dashboard")

    df = pd.read_csv(csv_path)

    col1, col2, col3 = st.columns(3)
    col1.metric("Total Rows", len(df))
    col2.metric("Columns", len(df.columns))
    col3.metric("Missing Values", df.isnull().sum().sum())

    st.dataframe(df.head(100))

    numeric_cols = df.select_dtypes(include="number").columns
    if len(numeric_cols) >= 2:
        fig = px.scatter(df, x=numeric_cols[0], y=numeric_cols[1])
        st.plotly_chart(fig)`,
      "README.md": "# Streamlit Data Dashboard\n\nBuild interactive data dashboards with Streamlit.",
    },
    demoInput: "Create a sales dashboard from my CSV file",
    demoOutput: `Dashboard created with:
- KPI metrics: Total sales, Avg order, Top product
- Interactive filters: Date range, Region, Category
- Charts: Revenue trend, Category breakdown, Geo map
- Data table with search and sort

Running at: http://localhost:8501`,
    triggers: ["streamlit", "data app", "dashboard", "数据看板", "数据分析app", "web app"],
    tags: ["data-science", "python", "dashboards", "data-visualization", "web-app"],
    featured: false,
    trending: false,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "aider",
    name: "aider",
    title: "Aider — AI Pair Programming in Terminal",
    description: "AI pair programming in your terminal — edit code with natural language, integrated with your git workflow",
    avatar: "🤝",
    author: "@Aider-AI",
    authorBadge: "Verified",
    developer: "Aider-AI",
    downloads: 44500,
    stars: 44559,
    rating: 4.6,
    lastUpdated: "2026-05-02",
    collection: "Developer Tools",
    category: "Web Development",
    categorySlug: "web-development",
    installCommand: "pip install aider-chat",
    license: "Apache-2.0",
    version: "0.82.3",
    readme: `# Aider — AI Pair Programming

Aider is an AI pair programming tool that works in your terminal, editing code alongside you with full git integration.

## Key Features

- **Terminal-Based** — Works in your existing terminal workflow
- **Git Integration** — Auto-commits changes with meaningful messages
- **Multi-File** — Edit multiple files in a single conversation
- **Context-Aware** — Understands your whole repo structure
- **Voice Coding** — Dictate changes with voice input

## Quick Start

\`\`\`bash
# Install aider
pip install aider-chat

# Start aider in your repo
cd my-project
aider

# Ask it to make changes
> Add error handling to the API endpoint in server.py
> Refactor the database module to use async/await
> Write tests for the authentication flow
\`\`\``,
    files: {
      ".aider.conf.yml": `## Aider Configuration

# Auto-commit changes
auto-commits: true

# Show diffs before applying
dry-run: false

# Model to use
model: gpt-4o

# Files to watch
read:
  - "*.py"
  - "*.ts"
  - "*.tsx"`,
      "README.md": "# Aider Configuration\n\nAI pair programming setup for your project.",
    },
    demoInput: "Add input validation to the user registration endpoint",
    demoOutput: `Working with: auth/register.py

Changes:
1. Added Pydantic model for registration input
2. Added email format validation
3. Added password strength check (8+ chars, uppercase, number)
4. Added duplicate email check
5. Added try/except for database errors

Auto-committed: "feat: add input validation to registration endpoint"

Files modified: 1
Lines added: 34
Lines removed: 8`,
    triggers: ["aider", "pair programming", "ai coding", "terminal coding", "编程助手", "代码编辑", "git integration"],
    tags: ["coding-assistant", "cli", "pair-programming", "llm", "terminal"],
    featured: true,
    trending: true,
    difficulty: "beginner",
    verified: true,
  },
  {
    id: "gpt-researcher",
    name: "gpt-researcher",
    title: "GPT Researcher — Autonomous Deep Research Agent",
    description: "Autonomous agent that conducts deep research on any topic using any LLM provider, producing comprehensive reports",
    avatar: "🔬",
    author: "@assafelovic",
    developer: "assafelovic",
    downloads: 26900,
    stars: 26954,
    rating: 4.4,
    lastUpdated: "2026-04-25",
    collection: "Research Tools",
    category: "Research",
    categorySlug: "research",
    installCommand: "pip install gpt-researcher",
    license: "Apache-2.0",
    version: "0.12.8",
    readme: `# GPT Researcher — Autonomous Deep Research

GPT Researcher is an autonomous agent that conducts comprehensive research on any topic, producing detailed reports with sources.

## Key Features

- **Autonomous** — Researches topics independently
- **Multi-Source** — Searches web, academic papers, news
- **Report Generation** — Produces structured, cited reports
- **Configurable** — Adjust depth, source types, report length
- **Multi-LLM** — Works with OpenAI, Anthropic, local models

## Quick Start

\`\`\`python
from gpt_researcher import GPTResearcher
import asyncio

async def research(topic):
    researcher = GPTResearcher(query=topic, report_type="research_report")
    report = await researcher.conduct_research()
    return report

# Run research
report = asyncio.run(research("Impact of AI on healthcare in 2026"))
print(report)
\`\`\``,
    files: {
      "researcher.py": `from gpt_researcher import GPTResearcher
import asyncio

class ResearchAgent:
    def __init__(self, report_type="research_report"):
        self.report_type = report_type

    async def research(self, topic: str) -> str:
        researcher = GPTResearcher(
            query=topic,
            report_type=self.report_type
        )
        await researcher.conduct_research()
        report = researcher.write_report()
        return report

async def main():
    agent = ResearchAgent()
    report = await agent.research("Latest developments in quantum computing 2026")
    print(report)`,
      "README.md": "# GPT Researcher\n\nAutonomous deep research agent that produces comprehensive reports.",
    },
    demoInput: "Research the current state of quantum computing",
    demoOutput: `Researching: "Current state of quantum computing 2026"

Sources consulted: 47
├── Web articles: 23
├── Academic papers: 15
├── News articles: 9

Report (2,847 words):
1. Executive Summary
2. Key Developments
   - IBM's 1000-qubit processor
   - Google's error correction breakthrough
3. Industry Applications
4. Challenges and Limitations
5. Future Outlook

Generated: quantum_computing_2026_report.md`,
    triggers: ["gpt researcher", "deep research", "research agent", "深度研究", "调研", "report generation", "web research"],
    tags: ["research", "agent", "web-scraping", "deep-research", "automation"],
    featured: false,
    trending: true,
    difficulty: "intermediate",
  },
  {
    id: "chroma",
    name: "chroma",
    title: "Chroma — AI Embedding Database",
    description: "Search infrastructure for AI — the open-source embedding database for RAG, semantic search, and recommendations",
    avatar: "🔍",
    author: "@chroma-core",
    developer: "chroma-core",
    downloads: 27800,
    stars: 27879,
    rating: 4.4,
    lastUpdated: "2026-04-22",
    collection: "AI Infrastructure",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install chromadb",
    license: "Apache-2.0",
    version: "0.6.5",
    readme: `# Chroma — AI Embedding Database

Chroma is an open-source embedding database that makes it easy to build LLM apps with memory, search, and recommendations.

## Key Features

- **Embeddings** — Store and query vector embeddings
- **Semantic Search** — Find similar documents by meaning
- **RAG Ready** — Built for retrieval-augmented generation
- **Multi-Modal** — Text, images, and more
- **Simple API** — Get started in 3 lines of code

## Quick Start

\`\`\`python
import chromadb

client = chromadb.Client()
collection = client.create_collection("my_docs")

# Add documents
collection.add(
    documents=["AI is transforming healthcare", "Quantum computing breakthrough"],
    ids=["doc1", "doc2"]
)

# Query
results = collection.query(query_texts=["medical AI"], n_results=2)
print(results)
\`\`\``,
    files: {
      "vector_store.py": `import chromadb
from chromadb.config import Settings

class VectorStore:
    def __init__(self, collection_name="documents"):
        self.client = chromadb.Client(Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(collection_name)

    def add(self, documents: list[str], metadatas: list[dict] = None):
        ids = [f"doc_{i}" for i in range(len(documents))]
        self.collection.add(documents=documents, ids=ids, metadatas=metadatas)

    def search(self, query: str, n_results: int = 5):
        return self.collection.query(query_texts=[query], n_results=n_results)`,
      "README.md": "# Chroma Vector Store\n\nEmbedding database for AI applications.",
    },
    demoInput: "Store my documents and search semantically",
    demoOutput: `Collection: "knowledge_base"
Documents added: 1,247

Query: "How does machine learning work?"

Results:
1. "Machine learning is a subset of AI that..." (score: 0.89)
2. "Neural networks learn by adjusting weights..." (score: 0.85)
3. "Deep learning uses multiple layers to..." (score: 0.82)

Latency: 12ms`,
    triggers: ["chroma", "vector database", "embedding", "semantic search", "向量数据库", "rag", "相似度搜索"],
    tags: ["vector-database", "embeddings", "search", "ai", "rag"],
    featured: false,
    trending: false,
    difficulty: "beginner",
  },
  {
    id: "qdrant",
    name: "qdrant",
    title: "Qdrant — High-Performance Vector Search Engine",
    description: "High-performance, massive-scale Vector Database and Search Engine for next-gen AI applications",
    avatar: "🚀",
    author: "@qdrant",
    developer: "qdrant",
    downloads: 31100,
    stars: 31174,
    rating: 4.5,
    lastUpdated: "2026-04-28",
    collection: "AI Infrastructure",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install qdrant-client",
    license: "Apache-2.0",
    version: "1.14.0",
    readme: `# Qdrant — Vector Search Engine

Qdrant is a high-performance vector similarity search engine with extended filtering support.

## Key Features

- **High Performance** — Sub-millisecond search at billion scale
- **Advanced Filtering** — Combine vector search with metadata filters
- **Multi-Tenancy** — Isolate data per user/tenant
- **Payload Support** — Store and filter by rich metadata
- **Cloud Ready** — Managed cloud or self-hosted

## Quick Start

\`\`\`python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(":memory:")

client.create_collection(
    collection_name="products",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)

client.upsert(
    collection_name="products",
    points=[PointStruct(id=1, vector=[0.1]*384, payload={"name": "Widget"})]
)

results = client.search(collection_name="products", query_vector=[0.1]*384, limit=5)
\`\`\``,
    files: {
      "search_engine.py": `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

class SearchEngine:
    def __init__(self, collection="documents", vector_size=384):
        self.client = QdrantClient(":memory:")
        self.collection = collection
        self.client.create_collection(
            collection_name=collection,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
        )

    def index(self, items: list[dict]):
        points = [PointStruct(id=i, vector=item["vector"], payload=item["payload"])
                  for i, item in enumerate(items)]
        self.client.upsert(collection_name=self.collection, points=points)

    def search(self, query_vector, limit=10, filters=None):
        return self.client.search(collection_name=self.collection,
                                  query_vector=query_vector, limit=limit, query_filter=filters)`,
      "README.md": "# Qdrant Search Engine\n\nHigh-performance vector search for AI applications.",
    },
    demoInput: "Build a product recommendation engine with Qdrant",
    demoOutput: `Collection: "products"
├── Vectors indexed: 50,000
├── Vector size: 384 (all-MiniLM-L6-v2)
└── Distance: Cosine similarity

Query: "wireless headphones for running"

Results:
1. "Sport BT Pro" (score: 0.94) — $79.99
2. "RunBuds Ultra" (score: 0.91) — $59.99
3. "FitAudio X3" (score: 0.89) — $99.99

Latency: 0.8ms`,
    triggers: ["qdrant", "vector search", "recommendation", "向量搜索", "推荐系统", "embedding search"],
    tags: ["vector-database", "search-engine", "embeddings", "ai-search", "mlops"],
    featured: false,
    trending: false,
    difficulty: "intermediate",
  },
  {
    id: "haystack",
    name: "haystack",
    title: "Haystack — AI Orchestration Framework",
    description: "Open-source AI orchestration framework for building production-ready LLM applications with RAG, agents, and pipelines",
    avatar: "🌾",
    author: "@deepset-ai",
    developer: "deepset-ai",
    downloads: 25100,
    stars: 25131,
    rating: 4.3,
    lastUpdated: "2026-04-20",
    collection: "AI Frameworks",
    category: "Research",
    categorySlug: "research",
    installCommand: "pip install haystack-ai",
    license: "Apache-2.0",
    version: "2.13.2",
    readme: `# Haystack — AI Orchestration Framework

Haystack is an end-to-end framework for building production-ready LLM applications.

## Key Features

- **Pipelines** — Composable, production-ready AI pipelines
- **RAG** — Built-in retrieval-augmented generation
- **Agents** — Autonomous LLM-powered agents
- **Document Stores** — Elasticsearch, Pinecone, Weaviate, and more
- **Evaluation** — Built-in evaluation and benchmarking

## Quick Start

\`\`\`python
from haystack import Pipeline, Document
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from haystack.components.builders import PromptBuilder

retriever = InMemoryBM25Retriever(document_store=store)
generator = OpenAIGenerator(model="gpt-4o")
prompt_builder = PromptBuilder(template="...")

pipeline = Pipeline()
pipeline.add_component("retriever", retriever)
pipeline.add_component("prompt", prompt_builder)
pipeline.add_component("llm", generator)

result = pipeline.run({"retriever": {"query": "What is RAG?"}})
\`\`\``,
    files: {
      "rag_pipeline.py": `from haystack import Pipeline, Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from haystack.components.builders import PromptBuilder

TEMPLATE = """
Given these documents, answer the question.
Documents: {% for doc in documents %}{{ doc.content }}{% endfor %}
Question: {{ question }}
Answer:
"""

def build_rag_pipeline():
    store = InMemoryDocumentStore()
    retriever = InMemoryBM25Retriever(document_store=store)
    prompt = PromptBuilder(template=TEMPLATE)
    llm = OpenAIGenerator(model="gpt-4o")

    pipe = Pipeline()
    pipe.add_component("retriever", retriever)
    pipe.add_component("prompt", prompt)
    pipe.add_component("llm", llm)
    pipe.connect("retriever.documents", "prompt.documents")
    pipe.connect("prompt.prompt", "llm.prompt")
    return pipe, store`,
      "README.md": "# Haystack RAG Pipeline\n\nProduction-ready RAG pipelines with Haystack.",
    },
    demoInput: "Build a QA system over my company documents",
    demoOutput: `RAG Pipeline configured:
├── Retriever: BM25 + Dense (hybrid)
├── Documents indexed: 3,456
├── Prompt: Custom QA template
└── LLM: GPT-4o

Query: "What is our vacation policy?"

Answer: "Full-time employees receive 20 days of paid
vacation per year, with an additional 5 days after
5 years of employment..."

Sources: HR_handbook.pdf (p.12), Benefits_2026.pdf (p.3)`,
    triggers: ["haystack", "rag pipeline", "qa system", "问答系统", "document qa", "knowledge base"],
    tags: ["rag", "agents", "orchestration", "nlp", "pipelines"],
    featured: false,
    trending: false,
    difficulty: "intermediate",
  },
  {
    id: "dash",
    name: "dash",
    title: "Plotly Dash — Data Visualization Apps",
    description: "Data Apps & Dashboards for Python — build interactive analytical web applications without JavaScript",
    avatar: "📈",
    author: "@plotly",
    developer: "plotly",
    downloads: 24100,
    stars: 24160,
    rating: 4.4,
    lastUpdated: "2026-04-18",
    collection: "Data Tools",
    category: "Data Analysis",
    categorySlug: "data-analysis",
    installCommand: "pip install dash",
    license: "MIT",
    version: "2.18.2",
    readme: `# Plotly Dash — Data Visualization Apps

Dash is the most downloaded, trusted framework for building data visualization apps in Python.

## Key Features

- **Pure Python** — No JavaScript required
- **Interactive** — Hover, zoom, filter, drill-down
- **Production** — Used by Fortune 500 companies
- **Customizable** — Full control over layout and styling
- **Callbacks** — Reactive programming model

## Quick Start

\`\`\`python
import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd

app = dash.Dash(__name__)

app.layout = html.Div([
    dcc.Dropdown(options=["A", "B", "C"], value="A", id="filter"),
    dcc.Graph(id="chart")
])

@app.callback(Output("chart", "figure"), Input("filter", "value"))
def update_chart(filter_value):
    df = px.data.gapminder().query(f"continent == '{filter_value}'")
    return px.scatter(df, x="gdpPercap", y="lifeExp", size="pop")

app.run()
\`\`\``,
    files: {
      "dashboard.py": `import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd

def create_dashboard(data_path):
    app = dash.Dash(__name__)
    df = pd.read_csv(data_path)

    app.layout = html.Div([
        html.H1("Data Dashboard"),
        dcc.Dropdown(
            options=[{"label": c, "value": c} for c in df.columns],
            value=df.columns[0],
            id="column-select"
        ),
        dcc.Graph(id="chart")
    ])

    @app.callback(Output("chart", "figure"), Input("column-select", "value"))
    def update(col):
        return px.histogram(df, x=col)

    return app`,
      "README.md": "# Plotly Dash Dashboard\n\nInteractive data dashboards with Plotly Dash.",
    },
    demoInput: "Create an interactive sales dashboard",
    demoOutput: `Dashboard created:
- Filters: Date range, Region, Product category
- Charts: Revenue trend (line), Top products (bar),
  Geographic distribution (choropleth),
  Category breakdown (pie)
- KPIs: Total revenue, Orders, Avg order value

Running at: http://localhost:8050`,
    triggers: ["dash", "plotly", "data visualization", "dashboard", "数据可视化", "图表", "interactive chart"],
    tags: ["dashboards", "data-visualization", "python", "plotly", "web-app"],
    featured: false,
    trending: false,
    difficulty: "intermediate",
  },
  {
    id: "letta",
    name: "letta",
    title: "Letta — Stateful AI Agent Platform",
    description: "Platform for building stateful agents with advanced memory that can learn and self-improve over time",
    avatar: "🧬",
    author: "@letta-ai",
    developer: "letta-ai",
    downloads: 22500,
    stars: 22566,
    rating: 4.3,
    lastUpdated: "2026-04-22",
    collection: "AI Frameworks",
    category: "Productivity",
    categorySlug: "productivity",
    installCommand: "pip install letta",
    license: "Apache-2.0",
    version: "0.6.12",
    readme: `# Letta — Stateful AI Agent Platform

Letta (formerly MemGPT) enables building stateful LLM agents that can manage their own memory and self-improve.

## Key Features

- **Self-Editing Memory** — Agents manage their own memory
- **Stateful Conversations** — Persistent across sessions
- **Tool Use** — Agents can call external tools
- **Multi-Agent** — Create agent networks
- **Governance** — Role-based access and audit logs

## Quick Start

\`\`\`python
from letta import create_client
from letta.schemas.memory import ChatMemory

client = create_client()

agent = client.create_agent(
    name="research-assistant",
    memory=ChatMemory(
        human="I'm a researcher studying AI safety.",
        persona="I'm a helpful research assistant with deep knowledge of AI."
    ),
    tools=["web_search", "arxiv_search"]
)

response = client.send_message(agent.id, "Find recent papers on AI alignment")
print(response)
\`\`\``,
    files: {
      "agent_manager.py": `from letta import create_client
from letta.schemas.memory import ChatMemory

class AgentManager:
    def __init__(self):
        self.client = create_client()

    def create_agent(self, name, persona, tools=None):
        return self.client.create_agent(
            name=name,
            memory=ChatMemory(persona=persona),
            tools=tools or []
        )

    def chat(self, agent_id, message):
        return self.client.send_message(agent_id, message)

    def get_memory(self, agent_id):
        agent = self.client.get_agent(agent_id)
        return agent.memory`,
      "README.md": "# Letta Stateful Agent\n\nBuild self-improving agents with persistent memory.",
    },
    demoInput: "Create a research agent that remembers context",
    demoOutput: `Agent created: "research-ai"
├── Memory: Self-editing core memory
├── Tools: web_search, arxiv_search, memory_search
└── State: Active

Conversation:
User: "Find papers on AI alignment"
Agent: "Found 5 relevant papers..." [stores key findings in memory]

User (next session): "What did we discuss about alignment?"
Agent: "Previously we found that..." [retrieves from memory]

Memory entries: 12`,
    triggers: ["letta", "memgpt", "stateful agent", "self-improving", "有状态agent", "自动记忆", "agent memory"],
    tags: ["agents", "memory", "stateful", "self-improving", "llm"],
    featured: false,
    trending: false,
    difficulty: "advanced",
  },
  {
    id: "jina-reader",
    name: "jina-reader",
    title: "Jina Reader — URL to LLM-Ready Content",
    description: "Convert any URL to an LLM-friendly input with a simple prefix — clean, structured web content extraction",
    avatar: "📖",
    author: "@jina-ai",
    developer: "jina-ai",
    downloads: 10700,
    stars: 10774,
    rating: 4.1,
    lastUpdated: "2026-04-15",
    collection: "Content Tools",
    category: "Content Creation",
    categorySlug: "content-creation",
    installCommand: "pip install docarray",
    license: "Apache-2.0",
    version: "0.40.0",
    readme: `# Jina Reader — URL to LLM-Ready Content

Jina Reader converts any webpage into clean, structured text optimized for LLM consumption.

## Key Features

- **Simple API** — Just prepend r.jina.ai to any URL
- **Clean Output** — Removes ads, navigation, boilerplate
- **Markdown** — Returns clean markdown
- **Images** — Extracts and describes images
- **PDF Support** — Reads and extracts PDF content

## How to Use

Simply prepend \`https://r.jina.ai/\` to any URL:

\`\`\`
https://r.jina.ai/https://example.com/article
\`\`\`

Or use the API:

\`\`\`bash
curl https://r.jina.ai/https://example.com/article
\`\`\`

## For AI Agents

Jina Reader is perfect for giving LLMs access to web content:

\`\`\`python
import requests
def read_url(url):
    response = requests.get(f"https://r.jina.ai/{url}")
    return response.text
\`\`\``,
    files: {
      "reader.py": `import requests
from typing import Optional

class WebReader:
    BASE_URL = "https://r.jina.ai/"

    def read(self, url: str, return_format: Optional[str] = None) -> str:
        """Convert a URL to LLM-friendly text."""
        headers = {}
        if return_format:
            headers["X-Return-Format"] = return_format

        response = requests.get(
            f"{self.BASE_URL}{url}",
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        return response.text

    def read_batch(self, urls: list[str]) -> dict[str, str]:
        """Read multiple URLs."""
        return {url: self.read(url) for url in urls}`,
      "README.md": "# Jina Reader\n\nConvert any URL to LLM-ready content.",
    },
    demoInput: "Read this article and summarize it",
    demoOutput: `URL: https://example.com/ai-trends-2026

Extracted content (2,340 words, cleaned markdown):

# AI Trends 2026

## 1. Multimodal AI Goes Mainstream
...

## 2. Agent Frameworks Mature
...

## 3. Open Source Closes the Gap
...

Boilerplate removed: Navigation, footer, ads, sidebar
Images extracted: 5
Latency: 1.2s`,
    triggers: ["jina reader", "read url", "web content", "url转文本", "网页提取", "scrape url", "web reader"],
    tags: ["web-scraping", "llm", "content-extraction", "url-reader"],
    featured: false,
    trending: false,
    difficulty: "beginner",
  },
];

export function getAgentSkillById(id: string): AgentSkill | undefined {
  const found = agentSkills.find((s) => s.id === id);
  if (found) return found;
  // Check localStorage for user-published skills (client-side only)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.publishedSkills);
      if (stored) {
        const published: AgentSkill[] = JSON.parse(stored);
        return published.find((s) => s.id === id);
      }
    } catch {
      // ignore
    }
  }
  return undefined;
}

export function getPublishedSkills(): AgentSkill[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.publishedSkills);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getAllAgentSkills(): AgentSkill[] {
  return [...agentSkills, ...getPublishedSkills()];
}

export function getTrendingAgentSkills(): AgentSkill[] {
  return agentSkills.filter((s) => s.trending);
}

export function getFeaturedAgentSkills(): AgentSkill[] {
  return agentSkills.filter((s) => s.featured);
}
