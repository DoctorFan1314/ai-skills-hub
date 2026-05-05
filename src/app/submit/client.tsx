"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";

const categoryOptions = ["语言与内容生产", "编程与技术任务", "思考与工作流"];

interface Submission {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  promptOnline: string;
  promptLocal: string;
  usage: string;
  submittedAt: string;
  author: string;
}

export default function SubmitClient() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>("ai-skills-hub-submissions", []);
  const { toast } = useToast();
  const { user } = useAuth();

  function validate(fd: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    const name = (fd.get("name") as string)?.trim();
    const shortDesc = (fd.get("short-desc") as string)?.trim();
    const prompt = (fd.get("prompt-online") as string)?.trim();
    const usage = (fd.get("usage") as string)?.trim();

    if (!name) errs.name = "请输入模板名称";
    else if (name.length < 2) errs.name = "模板名称至少 2 个字符";
    if (!shortDesc) errs.shortDesc = "请输入一句话描述";
    if (!selectedCategory) errs.category = "请选择分类";
    if (!prompt) errs.promptOnline = "请输入在线版 Prompt";
    else if (prompt.length < 20) errs.promptOnline = "Prompt 内容至少 20 个字符";
    if (!usage) errs.usage = "请输入使用说明";
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const submission: Submission = {
      id: Date.now().toString(36),
      name: (fd.get("name") as string).trim(),
      shortDesc: (fd.get("short-desc") as string).trim(),
      category: selectedCategory!,
      promptOnline: (fd.get("prompt-online") as string).trim(),
      promptLocal: (fd.get("prompt-local") as string)?.trim() || "",
      usage: (fd.get("usage") as string).trim(),
      submittedAt: new Date().toISOString(),
      author: user?.username || "匿名用户",
    };

    setSubmissions((prev) => [...prev, submission]);
    setSubmitted(true);
    toast("模板已保存到本地！", "success");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle className="h-16 w-16 text-[#00d4ff] mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">提交成功！</h1>
        <p className="text-[#8b949e] mb-6">感谢你的贡献！我们的团队将在 3-5 个工作日内审核你的模板。</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="border-white/10 text-white hover:bg-white/5">继续提交</Button>

        {submissions.length > 0 && (
          <div className="mt-10 text-left">
            <h2 className="text-lg font-semibold text-white mb-4">我的提交 ({submissions.length})</h2>
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="glass-card p-4 text-left">
                  <p className="text-white font-medium">{s.name}</p>
                  <p className="text-sm text-[#8b949e]">{s.category} · {new Date(s.submittedAt).toLocaleDateString("zh-CN")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">提交模板</h1>
        <p className="text-[#8b949e]">分享你的优质 Prompt 模板，帮助更多人高效使用 AI</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">基本信息</h2>
          <div>
            <label htmlFor="name" className="text-sm text-white mb-1.5 block">模板名称 <span className="text-red-400">*</span></label>
            <Input id="name" name="name" required placeholder="例如：小红书爆款笔记生成器 v2.0" className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="short-desc" className="text-sm text-white mb-1.5 block">一句话描述 <span className="text-red-400">*</span></label>
            <Input id="short-desc" name="short-desc" required placeholder="简要说明这个模板能做什么" className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50" />
            {errors.shortDesc && <p className="text-xs text-red-400 mt-1">{errors.shortDesc}</p>}
          </div>
          <div>
            <span className="text-sm text-white mb-2 block">分类 <span className="text-red-400">*</span></span>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30"
                      : "bg-white/5 text-[#8b949e] border-white/10 hover:border-[#00d4ff]/30 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
          </div>
        </div>
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Prompt 内容</h2>
          <div>
            <label htmlFor="prompt-online" className="text-sm text-white mb-1.5 block">在线版 Prompt <span className="text-red-400">*</span></label>
            <Textarea id="prompt-online" name="prompt-online" required rows={8} placeholder="粘贴你的在线版 Prompt..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 font-mono text-sm" />
            {errors.promptOnline && <p className="text-xs text-red-400 mt-1">{errors.promptOnline}</p>}
          </div>
          <div>
            <label htmlFor="prompt-local" className="text-sm text-white mb-1.5 block">本地版 Prompt</label>
            <Textarea id="prompt-local" name="prompt-local" rows={6} placeholder="粘贴本地版 Prompt（可选）..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 font-mono text-sm" />
          </div>
          <div>
            <label htmlFor="usage" className="text-sm text-white mb-1.5 block">使用说明 <span className="text-red-400">*</span></label>
            <Textarea id="usage" name="usage" required rows={4} placeholder="详细说明如何使用这个模板..." className="bg-white/5 border-white/10 text-white placeholder:text-[#8b949e]/50 text-sm" />
            {errors.usage && <p className="text-xs text-red-400 mt-1">{errors.usage}</p>}
          </div>
        </div>
        <Button type="submit" className="w-full bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium h-12 text-base">
          <Send className="h-4 w-4 mr-2" />提交模板
        </Button>
      </form>
    </div>
  );
}
