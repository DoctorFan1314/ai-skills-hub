import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Copy, Zap, Globe, Laptop, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "新手指南 — AI Skills Hub",
  description: "即使你从未写过 Prompt，也能在 3 分钟内上手使用我们的高质量技能模板",
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-sm mb-6">
          <BookOpen className="h-3.5 w-3.5" />新手指南
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">欢迎来到 AI Skills Hub</h1>
        <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">即使你从未写过 Prompt，也能在 3 分钟内上手使用我们的高质量技能模板</p>
      </div>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#00d4ff]" />AI Skills Hub 是什么？
        </h2>
        <div className="text-[#8b949e] space-y-3 leading-relaxed">
          <p>AI Skills Hub 是一个专注于<strong className="text-white">大语言模型（LLM）</strong>的高质量技能模板市场。我们精心设计并实测了上千个 Prompt 模板，覆盖内容创作、编程开发、职场工作等核心场景。</p>
          <p>你<strong className="text-white">不需要精通 Prompt 工程</strong>，只需找到合适的模板，复制粘贴，替换变量，就能获得高质量的 AI 输出。</p>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Copy className="h-5 w-5 text-[#00d4ff]" />什么是 Prompt？
        </h2>
        <div className="text-[#8b949e] space-y-3 leading-relaxed">
          <p><strong className="text-white">Prompt</strong>（提示词）是你给 AI 的指令。就像你给助手布置任务时，说得越清楚，助手完成得越好。</p>
          <p>一个好的 Prompt 通常包含：任务描述、输出格式、风格要求、约束条件等。我们的模板已经帮你写好了这一切。</p>
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 mt-4">
            <p className="text-xs text-[#8b949e]/60 mb-2">示例：</p>
            <p className="text-sm text-white">&ldquo;你是一位小红书内容创作者。请根据以下主题生成一篇高质量笔记：<strong className="text-[#00d4ff]">春季穿搭心得</strong>&rdquo;</p>
            <p className="text-xs text-[#8b949e]/60 mt-2">↑ 蓝色部分就是你需要替换的变量</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#00d4ff]" />在线版 vs 本地版：如何选择？
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><Globe className="h-5 w-5 text-[#00d4ff]" /><h3 className="font-semibold text-white">在线版</h3></div>
            <p className="text-sm text-[#8b949e] mb-3">直接在 ChatGPT、Claude 等网站上使用。</p>
            <ul className="text-sm text-[#8b949e] space-y-1.5">
              <li className="flex gap-2"><span className="text-green-400">+</span> 无需安装软件</li>
              <li className="flex gap-2"><span className="text-green-400">+</span> 通常效果最好</li>
              <li className="flex gap-2"><span className="text-yellow-400">-</span> 需要网络和付费账号</li>
            </ul>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><Laptop className="h-5 w-5 text-[#7c3aed]" /><h3 className="font-semibold text-white">本地版</h3></div>
            <p className="text-sm text-[#8b949e] mb-3">在 LM Studio、Ollama 中运行开源模型。</p>
            <ul className="text-sm text-[#8b949e] space-y-1.5">
              <li className="flex gap-2"><span className="text-green-400">+</span> 完全免费、隐私安全</li>
              <li className="flex gap-2"><span className="text-yellow-400">-</span> 需要技术基础和好配置</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">3 分钟快速上手</h2>
        <div className="space-y-6">
          {[
            { step: 1, title: "选择技能模板", desc: "浏览技能市场，找到你需要的模板。" },
            { step: 2, title: "复制 Prompt", desc: "点击「复制完整 Prompt」按钮，填写变量后复制。" },
            { step: 3, title: "粘贴到 AI 平台", desc: "打开 ChatGPT、Claude 等平台，粘贴 Prompt。" },
            { step: 4, title: "获取高质量输出", desc: "AI 会根据模板生成专业、自然的内容。" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] font-bold">{item.step}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-[#8b949e]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <p className="text-[#8b949e] mb-4">准备好了吗？开始探索吧！</p>
        <Link href="/skills">
          <Button className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium px-8 h-12 text-base">
            浏览技能市场 <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
