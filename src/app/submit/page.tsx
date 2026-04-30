"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle } from "lucide-react";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle className="h-16 w-16 text-[#00d4ff] mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">提交成功！</h1>
        <p className="text-[#8b949e] mb-6">感谢你的贡献！我们的团队将在 3-5 个工作日内审核你的模板。</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="border-white/10 text-white hover:bg-white/5">继续提交</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">提交模板</h1>
        <p className="text-[#8b949e]">分享你的优质 Prompt 模板，帮助更多人高效使用 AI</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">基本信息</h2>
          <div>
            <label className="text-sm text-white mb-1.5 block">模板名称 <span className="text-red-400">*</span></label>
            <Input required placeholder="例如：小红书爆款笔记生成器 v2.0" className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50" />
          </div>
          <div>
            <label className="text-sm text-white mb-1.5 block">一句话描述 <span className="text-red-400">*</span></label>
            <Input required placeholder="简要说明这个模板能做什么" className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50" />
          </div>
          <div>
            <label className="text-sm text-white mb-1.5 block">分类 <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {["语言与内容生产", "编程与技术任务", "思考与工作流"].map((cat) => (
                <Badge key={cat} variant="secondary" className="cursor-pointer bg-white/5 border border-white/10 text-[#8b949e] hover:border-[#00d4ff]/30 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors px-4 py-1.5">{cat}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Prompt 内容</h2>
          <div>
            <label className="text-sm text-white mb-1.5 block">在线版 Prompt <span className="text-red-400">*</span></label>
            <Textarea required rows={8} placeholder="粘贴你的在线版 Prompt..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 font-mono text-sm" />
          </div>
          <div>
            <label className="text-sm text-white mb-1.5 block">本地版 Prompt</label>
            <Textarea rows={6} placeholder="粘贴本地版 Prompt（可选）..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 font-mono text-sm" />
          </div>
          <div>
            <label className="text-sm text-white mb-1.5 block">使用说明 <span className="text-red-400">*</span></label>
            <Textarea required rows={4} placeholder="详细说明如何使用这个模板..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 text-sm" />
          </div>
        </div>
        <Button type="submit" className="w-full bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium h-12 text-base">
          <Send className="h-4 w-4 mr-2" />提交模板
        </Button>
      </form>
    </div>
  );
}
