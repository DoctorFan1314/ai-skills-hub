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
