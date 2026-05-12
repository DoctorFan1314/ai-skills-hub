import Link from "next/link";
import type { Metadata } from "next";
import { Code, Zap, Shield, BookOpen, Terminal, CreditCard, Cpu, ArrowRight, Copy } from "lucide-react";

export const metadata: Metadata = {
  title: "文档 — OortAPI",
  description: "OortAPI 统一 AI API 中继平台使用文档",
};

const methodBadge: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${methodBadge[method] || "bg-muted text-muted-foreground"}`}>
      {method}
    </span>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="relative group">
      <pre className="bg-zinc-950 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-zinc-800">
        <code className="text-zinc-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Zap className="h-3 w-3" />
            OpenAI 兼容格式 · 一个 Key 聚合所有 AI 服务
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">OortAPI 文档</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            一个 API Key 访问 OpenAI、Anthropic、Google、DeepSeek 等 30+ AI 服务。
            完全兼容 OpenAI SDK，无需修改代码即可切换。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/docs/api-reference"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Code className="h-4 w-4" />
              在线调试
            </Link>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              <Cpu className="h-4 w-4" />
              查看模型市场
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-16">

        {/* ===== Quick Start ===== */}
        <section id="quickstart">
          <h2 className="text-2xl font-bold mb-2">快速开始</h2>
          <p className="text-muted-foreground mb-6">3 步接入 OortAPI，耗时不超过 2 分钟。</p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-2">获取 API Key</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  注册账户后，进入 <Link href="/dashboard/keys" className="text-primary hover:underline">控制台 → API Keys</Link>，点击创建。你的 Key 以 <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">sk-oort-</code> 开头。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-2">发送请求</h3>
                <p className="text-sm text-muted-foreground mb-3">将 OpenAI 的 base URL 替换为你的 OortAPI 地址即可：</p>
                <CodeBlock code={`curl https://your-domain.com/api/v1/chat/completions \\
  -H "Authorization: Bearer sk-oort-YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-2">使用 SDK（推荐）</h3>
                <p className="text-sm text-muted-foreground mb-3">直接使用 OpenAI 官方 SDK，只需修改 <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">base_url</code>：</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Python</div>
                    <CodeBlock lang="python" code={`from openai import OpenAI

client = OpenAI(
    api_key="sk-oort-YOUR_API_KEY",
    base_url="https://your-domain.com/api/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Node.js</div>
                    <CodeBlock lang="javascript" code={`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-oort-YOUR_API_KEY",
  baseURL: "https://your-domain.com/api/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.choices[0].message.content)`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Authentication ===== */}
        <section id="auth">
          <h2 className="text-2xl font-bold mb-2">认证方式</h2>
          <p className="text-muted-foreground mb-6">OortAPI 使用两种认证方式，分别用于不同场景。</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">API Key 认证</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">用于所有 AI 模型接口（<code className="text-xs bg-muted px-1 rounded">/api/v1/*</code>）。</p>
              <CodeBlock code={`Authorization: Bearer sk-oort-YOUR_API_KEY`} />
            </div>
            <div className="rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-amber-400" />
                <h3 className="font-semibold text-sm">Cookie 认证</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">用于控制台管理接口（<code className="text-xs bg-muted px-1 rounded">/api/dashboard/*</code>）。登录后自动设置。</p>
              <CodeBlock code={`# 浏览器自动携带 cookie，无需手动设置`} />
            </div>
          </div>
        </section>

        {/* ===== SDK Integration ===== */}
        <section id="sdk">
          <h2 className="text-2xl font-bold mb-2">SDK 集成</h2>
          <p className="text-muted-foreground mb-6">OortAPI 完全兼容 OpenAI API 格式，支持所有 OpenAI SDK 和兼容客户端。</p>

          <div className="rounded-xl border border-border/50 divide-y divide-border/30">
            {[
              { name: "OpenAI Python SDK", pkg: "pip install openai", change: 'base_url="https://your-domain.com/api/v1"' },
              { name: "OpenAI Node.js SDK", pkg: "npm install openai", change: 'baseURL: "https://your-domain.com/api/v1"' },
              { name: "ChatBox / Open WebUI", pkg: "桌面客户端或 Web UI", change: 'API Base URL → 你的域名/api/v1' },
              { name: "LangChain", pkg: "pip install langchain-openai", change: 'openai_api_base="https://your-domain.com/api/v1"' },
              { name: "Vercel AI SDK", pkg: "npm install ai", change: 'baseURL: "https://your-domain.com/api/v1"' },
            ].map((sdk) => (
              <div key={sdk.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5">
                <div className="font-medium text-sm w-48 shrink-0">{sdk.name}</div>
                <code className="text-xs text-muted-foreground font-mono flex-1">{sdk.change}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ===== API Endpoints ===== */}
        <section id="endpoints">
          <h2 className="text-2xl font-bold mb-2">API 端点</h2>
          <p className="text-muted-foreground mb-6">所有 AI 接口均以 <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/api/v1</code> 为前缀，完全兼容 OpenAI 格式。</p>

          <div className="space-y-6">
            {/* AI Endpoints */}
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/30 border-b border-border/50 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">AI 模型接口</h3>
              </div>
              <div className="divide-y divide-border/20">
                {[
                  { method: "POST", path: "/api/v1/chat/completions", desc: "聊天补全（支持流式响应）" },
                  { method: "POST", path: "/api/v1/completions", desc: "文本补全" },
                  { method: "POST", path: "/api/v1/embeddings", desc: "文本嵌入" },
                  { method: "POST", path: "/api/v1/images/generations", desc: "图像生成" },
                  { method: "GET", path: "/api/v1/models", desc: "获取可用模型列表" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <MethodBadge method={ep.method} />
                    <code className="text-sm font-mono flex-1">{ep.path}</code>
                    <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing */}
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/30 border-b border-border/50 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">计费接口</h3>
              </div>
              <div className="divide-y divide-border/20">
                {[
                  { method: "GET", path: "/api/v1/billing/balance", desc: "查询账户余额" },
                  { method: "GET", path: "/api/v1/billing/usage", desc: "查询用量记录" },
                  { method: "POST", path: "/api/v1/billing/redeem", desc: "兑换充值码" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <MethodBadge method={ep.method} />
                    <code className="text-sm font-mono flex-1">{ep.path}</code>
                    <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth */}
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/30 border-b border-border/50 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">用户接口</h3>
              </div>
              <div className="divide-y divide-border/20">
                {[
                  { method: "POST", path: "/api/auth/login", desc: "用户登录" },
                  { method: "POST", path: "/api/auth/register", desc: "用户注册" },
                  { method: "GET", path: "/api/auth/me", desc: "获取当前用户信息" },
                  { method: "PATCH", path: "/api/auth/profile", desc: "更新个人资料" },
                  { method: "POST", path: "/api/auth/change-password", desc: "修改密码" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <MethodBadge method={ep.method} />
                    <code className="text-sm font-mono flex-1">{ep.path}</code>
                    <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Streaming ===== */}
        <section id="streaming">
          <h2 className="text-2xl font-bold mb-2">流式响应</h2>
          <p className="text-muted-foreground mb-6">OortAPI 完全支持 SSE 流式响应，客户端会收到标准的 OpenAI 格式流。</p>

          <CodeBlock code={`curl https://your-domain.com/api/v1/chat/completions \\
  -H "Authorization: Bearer sk-oort-YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'

# 响应格式：
# data: {"id":"...","choices":[{"delta":{"content":"Hello"}}]}
# data: {"id":"...","choices":[{"delta":{"content":"!"}}]}
# data: [DONE]`} />

          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50 text-sm">
            <p className="font-medium mb-1">注意</p>
            <p className="text-muted-foreground">流式响应中的 usage 统计通过 <code className="text-xs bg-muted px-1 rounded">stream_options.include_usage</code> 获取，OortAPI 会自动注入此参数。客户端无需额外配置。</p>
          </div>
        </section>

        {/* ===== Pricing ===== */}
        <section id="pricing">
          <h2 className="text-2xl font-bold mb-2">计费说明</h2>
          <p className="text-muted-foreground mb-6">OortAPI 采用三级缓存感知定价，按实际 Token 用量计费。</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "输入 Token", desc: "普通输入请求", color: "text-blue-400" },
              { label: "补全 Token", desc: "模型生成输出", color: "text-green-400" },
              { label: "缓存读取", desc: "命中缓存的输入（更便宜）", color: "text-emerald-400" },
              { label: "缓存创建", desc: "首次写入缓存的输入", color: "text-amber-400" },
            ].map((tier) => (
              <div key={tier.label} className="rounded-lg border border-border/50 p-4">
                <div className={`text-sm font-semibold ${tier.color} mb-1`}>{tier.label}</div>
                <div className="text-xs text-muted-foreground">{tier.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p>• 每次 API 调用后自动从余额扣除，费率取决于所用模型</p>
            <p>• 管理员可在 <Link href="/models" className="text-primary hover:underline">模型市场</Link> 设置每个模型的四档价格</p>
            <p>• 支持 USD/CNY 双货币显示，汇率由管理员配置</p>
            <p>• 余额不足时 API 返回 402，需通过兑换码或管理员充值</p>
          </div>
        </section>

        {/* ===== Error Codes ===== */}
        <section id="errors">
          <h2 className="text-2xl font-bold mb-2">错误码</h2>
          <p className="text-muted-foreground mb-6">OortAPI 遵循标准 HTTP 状态码，错误响应格式与 OpenAI 一致。</p>

          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="divide-y divide-border/20">
              {[
                { code: "400", desc: "请求参数错误（缺少 model、messages 等）" },
                { code: "401", desc: "认证失败（API Key 无效或缺失）" },
                { code: "402", desc: "余额不足，请充值后重试" },
                { code: "429", desc: "请求频率超限，请稍后重试" },
                { code: "500", desc: "服务器内部错误" },
                { code: "502", desc: "上游服务商返回错误" },
                { code: "503", desc: "无可用渠道（模型未配置或全部离线）" },
              ].map((err) => (
                <div key={err.code} className="flex items-center gap-3 px-5 py-3">
                  <code className="text-sm font-mono font-bold text-red-400 w-10">{err.code}</code>
                  <span className="text-sm text-muted-foreground">{err.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <CodeBlock code={`// 错误响应格式
{
  "error": {
    "message": "Insufficient balance. Please recharge.",
    type: "gateway_error"
  }
}`} />
          </div>
        </section>

        {/* ===== Resources ===== */}
        <section id="resources">
          <h2 className="text-2xl font-bold mb-2">更多资源</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Cpu, title: "模型市场", desc: "浏览可用模型与定价", href: "/models" },
              { icon: Terminal, title: "在线调试", desc: "Swagger UI 交互式文档", href: "/docs/api-reference" },
              { icon: BookOpen, title: "OpenAPI 规范", desc: "下载 JSON 格式 API 规范", href: "/api/docs/openapi.json" },
            ].map((r) => (
              <Link key={r.title} href={r.href} className="rounded-xl border border-border/50 p-5 hover:border-foreground/20 hover:bg-muted/30 transition-all group">
                <r.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                <ArrowRight className="h-3.5 w-3.5 mt-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
