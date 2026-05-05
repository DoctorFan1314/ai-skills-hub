"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from "lucide-react";
import { skills } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00d4ff]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{skills.length}+ 精选实测模板 · 每日更新</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            <span className="glow-text">AI Skills Hub</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#8b949e] mb-4 max-w-2xl mx-auto leading-relaxed">
            高质量LLM技能模板 · 复制即用，去AI味
            <br />
            <span className="text-white/80">把AI真正变成你的生产力武器</span>
          </p>
          <p className="text-sm text-[#8b949e]/60 mb-10">
            完美适配 ChatGPT · Claude · Grok · DeepSeek · Qwen · LM Studio · Ollama
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/skills">
              <Button size="lg" className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium px-8 h-12 text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                浏览热门技能
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 px-8 h-12 text-base">
                <BookOpen className="h-4 w-4 mr-2" />
                我是新手，从这里开始
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
