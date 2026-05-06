import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Copy, Zap, Globe, Laptop, ArrowRight, Sparkles, Bot, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "新手指南 — AI Skills Hub",
  description: "3 分钟上手 Agent 技能与 Prompt 模板，让 AI 真正为你工作",
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
          <BookOpen className="h-3.5 w-3.5" />新手指南
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">欢迎来到 AI Skills Hub</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">3 分钟上手 Agent 技能与 Prompt 模板，让 AI 真正为你工作</p>
      </div>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />AI Skills Hub 是什么？
        </h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          <p>AI Skills Hub 是一个专注于<strong className="text-foreground">大语言模型（LLM）</strong>的双轨技能市场，提供两大核心内容：</p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><Bot className="h-4 w-4 text-primary" /><h3 className="font-semibold text-foreground">Agent 技能</h3></div>
              <p className="text-sm">可执行的 AI 能力组件，一键安装即可让 Agent 搜索网页、编写代码、管理文件、发送邮件等。</p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><Copy className="h-4 w-4 text-purple-400" /><h3 className="font-semibold text-foreground">Prompt 模板</h3></div>
              <p className="text-sm">高质量提示词模板，覆盖内容创作、编程开发、职场工作等场景。复制粘贴、替换变量即可使用。</p>
            </div>
          </div>
          <p>你<strong className="text-foreground">不需要精通 Prompt 工程</strong>，只需找到合适的技能或模板，就能获得高质量的 AI 输出。</p>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Copy className="h-5 w-5 text-primary" />什么是 Prompt？
        </h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          <p><strong className="text-foreground">Prompt</strong>（提示词）是你给 AI 的指令。就像你给助手布置任务时，说得越清楚，助手完成得越好。</p>
          <p>一个好的 Prompt 通常包含：任务描述、输出格式、风格要求、约束条件等。我们的模板已经帮你写好了这一切。</p>
          <div className="bg-secondary border border-border rounded-lg p-4 mt-4">
            <p className="text-xs text-muted-foreground/60 mb-2">示例：</p>
            <p className="text-sm text-foreground">&ldquo;你是一位小红书内容创作者。请根据以下主题生成一篇高质量笔记：<strong className="text-primary">春季穿搭心得</strong>&rdquo;</p>
            <p className="text-xs text-muted-foreground/60 mt-2">↑ 蓝色部分就是你需要替换的变量</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />什么是 Agent 技能？
        </h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          <p><strong className="text-foreground">Agent 技能</strong>是可安装、可执行的 AI 能力模块。与 Prompt 模板不同，Agent 技能让 AI 能够<strong className="text-foreground">真正行动</strong>——不只是生成文本，而是搜索互联网、执行代码、操作文件。</p>
          <p>安装一条命令，你的 AI Agent 就多了一项新能力。</p>
          <div className="bg-secondary border border-border rounded-lg p-4 mt-4">
            <p className="text-xs text-muted-foreground/60 mb-2">示例安装命令：</p>
            <p className="text-sm text-foreground font-mono">npx skills install web-scraper</p>
            <p className="text-xs text-muted-foreground/60 mt-2">↑ 安装后 Agent 即可自动抓取网页内容</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />在线版 vs 本地版：如何选择？
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><Globe className="h-5 w-5 text-primary" /><h3 className="font-semibold text-foreground">在线版</h3></div>
            <p className="text-sm text-muted-foreground mb-3">直接在 ChatGPT、Claude 等网站上使用。</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><span className="text-green-400">+</span> 无需安装软件</li>
              <li className="flex gap-2"><span className="text-green-400">+</span> 通常效果最好</li>
              <li className="flex gap-2"><span className="text-yellow-400">-</span> 需要网络和付费账号</li>
            </ul>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><Laptop className="h-5 w-5 text-purple-400" /><h3 className="font-semibold text-foreground">本地版</h3></div>
            <p className="text-sm text-muted-foreground mb-3">在 LM Studio、Ollama 中运行开源模型。</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><span className="text-green-400">+</span> 完全免费、隐私安全</li>
              <li className="flex gap-2"><span className="text-yellow-400">-</span> 需要技术基础和好配置</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">3 分钟快速上手</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Bot className="h-4 w-4 text-primary" />使用 Agent 技能</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "浏览技能市场", desc: "找到你需要的 Agent 技能。" },
                { step: 2, title: "一键安装", desc: "复制安装命令，在终端执行。" },
                { step: 3, title: "开始使用", desc: "在 AI 平台中直接调用新能力。" },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">{item.step}</div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Copy className="h-4 w-4 text-purple-400" />使用 Prompt 模板</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "选择模板", desc: "浏览 Prompt 市场，找到需要的模板。" },
                { step: 2, title: "填写变量", desc: "输入变量内容，点击复制。" },
                { step: 3, title: "粘贴使用", desc: "在 ChatGPT、Claude 等平台粘贴发送。" },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">{item.step}</div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Prompt 工程技巧</h2>
        <p className="text-muted-foreground mb-6">掌握这些核心技巧，让 AI 输出质量更上一层楼：</p>
        <div className="space-y-6">
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">1. 链式思考（Chain-of-Thought）</h3>
            <p className="text-sm text-muted-foreground mb-3">让 AI 逐步推理，而非直接给答案。加入 &ldquo;请一步步分析&rdquo; 或 &ldquo;让我们逐步思考&rdquo; 可以显著提升复杂问题的回答质量。</p>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground/60 mb-1">示例：</p>
              <p className="text-sm text-foreground font-mono">&ldquo;请一步步分析这个 SQL 查询的性能问题，先看执行计划，再找瓶颈，最后给出优化方案。&rdquo;</p>
            </div>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">2. 少样本学习（Few-Shot）</h3>
            <p className="text-sm text-muted-foreground mb-3">给 AI 提供 1-3 个输入→输出示例，让它理解你期望的格式和风格。适合需要统一格式的批量任务。</p>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground/60 mb-1">示例：</p>
              <p className="text-sm text-foreground font-mono">&ldquo;按以下格式输出：输入 &lsquo;React&rsquo; → 输出 &lsquo;⚛️ React — 用于构建用户界面的 JavaScript 库&rsquo;&rdquo;</p>
            </div>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">3. 角色扮演（Role Prompting）</h3>
            <p className="text-sm text-muted-foreground mb-3">给 AI 一个具体的专业角色，获得更专业、更有深度的回答。角色越具体，输出越精准。</p>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground/60 mb-1">示例：</p>
              <p className="text-sm text-foreground font-mono">&ldquo;你是一位有 10 年经验的资深前端架构师，专注于 React 性能优化...&rdquo;</p>
            </div>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">4. 结构化输出（Structured Output）</h3>
            <p className="text-sm text-muted-foreground mb-3">明确指定输出格式（Markdown、JSON、表格等），减少 AI 的 &ldquo;自由发挥&rdquo;，让结果更可控、更易用。</p>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground/60 mb-1">示例：</p>
              <p className="text-sm text-foreground font-mono">&ldquo;请用 Markdown 表格输出，包含：名称 | 优势 | 适用场景 三列&rdquo;</p>
            </div>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">5. 自我反思（Self-Critique）</h3>
            <p className="text-sm text-muted-foreground mb-3">让 AI 检查并改进自己的输出。在 Prompt 末尾加上 &ldquo;请检查你的回答是否有错误或遗漏&rdquo;，可以显著提升准确性。</p>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground/60 mb-1">示例：</p>
              <p className="text-sm text-foreground font-mono">&ldquo;请检查你刚才的代码，列出可能的 Bug 和改进点，然后给出修正版本。&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">获得更好结果的秘诀</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">具体胜过模糊</h3>
            <p className="text-xs text-muted-foreground/60 mb-2">不好：</p>
            <p className="text-sm text-muted-foreground mb-2">&ldquo;帮我写个邮件&rdquo;</p>
            <p className="text-xs text-muted-foreground/60 mb-2">更好：</p>
            <p className="text-sm text-muted-foreground">&ldquo;给客户张总写一封项目进度汇报邮件，语气专业友好，包含本周完成的3个里程碑&rdquo;</p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">指定输出格式</h3>
            <p className="text-xs text-muted-foreground/60 mb-2">不好：</p>
            <p className="text-sm text-muted-foreground mb-2">&ldquo;分析一下这个数据&rdquo;</p>
            <p className="text-xs text-muted-foreground/60 mb-2">更好：</p>
            <p className="text-sm text-muted-foreground">&ldquo;用表格对比 Q1 和 Q2 的数据变化，标注增长率超过 20% 的指标&rdquo;</p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">迭代优化</h3>
            <p className="text-sm text-muted-foreground">不要期望一次完美。先让 AI 生成初版，然后针对性地要求 &ldquo;更口语化&rdquo;、&ldquo;缩短到200字&rdquo;、&ldquo;加入数据支撑&rdquo;。</p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">提供上下文</h3>
            <p className="text-sm text-muted-foreground">背景信息越丰富，AI 越能理解你的需求。告诉它你的身份、目的、受众，输出会更贴合预期。</p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">准备好了吗？开始探索吧！</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/skills">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 h-12 text-base">
              <Zap className="h-4 w-4 mr-2" />浏览 Agent 技能 <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/prompts">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-8 h-12 text-base">
              <Copy className="h-4 w-4 mr-2" />浏览 Prompt 模板 <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
