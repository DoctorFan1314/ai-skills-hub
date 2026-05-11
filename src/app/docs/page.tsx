import Link from "next/link";
import { BookOpen, Code, Zap, Shield, Database, BarChart3 } from "lucide-react";

const sections = [
  {
    icon: Zap,
    title: "AI 模型接口",
    titleEn: "AI Model Endpoints",
    description: "完全兼容 OpenAI API 格式的统一接口",
    items: [
      { name: "聊天补全", nameEn: "Chat Completions", path: "/v1/chat/completions", method: "POST" },
      { name: "文本补全", nameEn: "Text Completions", path: "/v1/completions", method: "POST" },
      { name: "文本嵌入", nameEn: "Embeddings", path: "/v1/embeddings", method: "POST" },
      { name: "图像生成", nameEn: "Image Generation", path: "/v1/images/generations", method: "POST" },
      { name: "模型列表", nameEn: "List Models", path: "/v1/models", method: "GET" },
    ],
  },
  {
    icon: Database,
    title: "计费接口",
    titleEn: "Billing Endpoints",
    description: "余额查询与用量追踪",
    items: [
      { name: "查询余额", nameEn: "Balance", path: "/v1/billing/balance", method: "GET" },
      { name: "用量记录", nameEn: "Usage", path: "/v1/billing/usage", method: "GET" },
    ],
  },
  {
    icon: Shield,
    title: "认证接口",
    titleEn: "Auth Endpoints",
    description: "用户登录、注册与资料管理",
    items: [
      { name: "登录", nameEn: "Login", path: "/api/auth/login", method: "POST" },
      { name: "注册", nameEn: "Register", path: "/api/auth/register", method: "POST" },
      { name: "当前用户", nameEn: "Me", path: "/api/auth/me", method: "GET" },
      { name: "更新资料", nameEn: "Update Profile", path: "/api/auth/profile", method: "PATCH" },
      { name: "修改密码", nameEn: "Change Password", path: "/api/auth/change-password", method: "POST" },
    ],
  },
  {
    icon: BarChart3,
    title: "管理接口",
    titleEn: "Dashboard Endpoints",
    description: "API Key、渠道、统计数据管理",
    items: [
      { name: "统计数据", nameEn: "Stats", path: "/api/dashboard/stats", method: "GET" },
      { name: "API Key", nameEn: "API Keys", path: "/api/dashboard/keys", method: "CRUD" },
      { name: "渠道管理", nameEn: "Channels", path: "/api/dashboard/channels", method: "CRUD" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-500/10 text-green-500",
  POST: "bg-blue-500/10 text-blue-500",
  PATCH: "bg-yellow-500/10 text-yellow-500",
  DELETE: "bg-red-500/10 text-red-500",
  CRUD: "bg-purple-500/10 text-purple-500",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">OortAPI 文档</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            统一 AI API 中继平台 — 一个 API Key 聚合 OpenAI、Anthropic、Google、DeepSeek 等多个上游服务
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/docs/api-reference"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Code className="h-4 w-4" />
              在线调试
            </Link>
            <a
              href="/api/docs/openapi.json"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              OpenAPI JSON
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-12 p-6 rounded-xl border border-border/50 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">快速开始</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">1. 获取 API Key：</span>
              <span>注册账户后在 <Link href="/dashboard/keys" className="text-primary hover:underline">控制台</Link> 创建</span>
            </div>
            <div>
              <span className="text-muted-foreground">2. 调用接口：</span>
              <code className="ml-2 px-2 py-0.5 rounded bg-muted text-xs font-mono">
                curl -H &quot;Authorization: Bearer sk-oort-xxx&quot; /v1/chat/completions
              </code>
            </div>
            <div>
              <span className="text-muted-foreground">3. 支持的模型：</span>
              <span>GPT-4o、Claude 3.5、DeepSeek、Gemini、Qwen 等</span>
            </div>
          </div>
        </div>

        {/* API Sections */}
        <div className="grid gap-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-border/50 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border/50">
                <section.icon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {section.items.map((item) => (
                  <div key={item.path} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/20 transition-colors">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${methodColors[item.method]}`}>
                      {item.method}
                    </span>
                    <code className="text-sm font-mono flex-1">{item.path}</code>
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Auth Info */}
        <div className="mt-8 p-6 rounded-xl border border-border/50">
          <h3 className="font-semibold mb-3">认证方式</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">API Key（AI 接口）</h4>
              <p className="text-muted-foreground">在请求头中添加：<code className="text-xs bg-muted px-1.5 py-0.5 rounded">Authorization: Bearer sk-oort-xxx</code></p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cookie（管理接口）</h4>
              <p className="text-muted-foreground">登录后自动设置 httpOnly cookie，管理接口自动认证</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
