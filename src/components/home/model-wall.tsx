"use client";

const PROVIDERS = [
  { name: "OpenAI", models: "GPT-4o, GPT-4 Turbo, GPT-3.5" },
  { name: "Anthropic", models: "Claude 3.5 Sonnet, Claude 3 Opus" },
  { name: "Google", models: "Gemini 2.0 Flash, Gemini 1.5 Pro" },
  { name: "DeepSeek", models: "DeepSeek Chat, DeepSeek Reasoner" },
  { name: "Alibaba", models: "Qwen Max, Qwen Plus" },
  { name: "Midjourney", models: "MJ v6, Niji v6" },
  { name: "Suno", models: "Music generation" },
  { name: "Cohere", models: "Command R+, Embed" },
];

export function ModelWall({ lang = "zh" }: { lang?: "zh" | "en" }) {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {lang === "zh" ? "支持的 AI 服务" : "Supported AI Services"}
          </h2>
          <p className="text-muted-foreground">
            {lang === "zh"
              ? "一个端点接入 30+ 主流 AI 模型服务"
              : "Access 30+ mainstream AI model services through one endpoint"
            }
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="glass-card p-4 rounded-xl text-center hover:border-primary/30 transition-colors">
              <div className="text-lg font-bold mb-1">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.models}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
