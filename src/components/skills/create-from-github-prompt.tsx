"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitFork, CheckCircle, Loader2, ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { useToast } from "@/contexts/toast-context";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { categories } from "@/lib/categories";
import type { Skill } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function mockParsePrompts(url: string): { title: string; subtitle: string; description: string; category: string; categorySlug: string; difficulty: "新手友好" | "进阶" | "高级"; promptOnline: string; promptLocal: string }[] {
  const parts = url.replace(/\/$/, "").split("/");
  const repo = parts[parts.length - 1] || "my-prompts";
  const cat = categories[0];
  return [
    { title: `${repo} — Prompt 模板`, subtitle: `从 ${repo} 导入的核心 Prompt 模板`, description: `自动解析自 ${repo} 仓库的高质量 Prompt 模板`, category: cat.name, categorySlug: cat.slug, difficulty: "新手友好", promptOnline: `请根据以下要求完成任务：\n\n{{输入内容}}\n\n请按照专业标准输出结果。`, promptLocal: `[系统指令]\n你是一个专业的助手。\n\n[输入]\n{input}\n\n[约束]\n- 输出结构化内容` },
    { title: `${repo} 高级版`, subtitle: `${repo} 的进阶 Prompt 变体`, description: `适用于高级用户的增强版 Prompt，支持更多变量和更精细的控制`, category: cat.name, categorySlug: cat.slug, difficulty: "进阶", promptOnline: `你是一位资深专家。请根据以下信息进行深度分析：\n\n【主题】：{{主题}}\n【要求】：{{具体要求}}\n\n请输出结构化的专业分析报告。`, promptLocal: `[系统指令]\n你是资深专家。对用户输入进行深度分析。\n\n[输入参数]\n- 主题：{topic}\n- 要求：{requirement}\n\n[约束]\n- 结构化输出\n- 包含关键结论` },
  ];
}

export function CreateFromGithubPrompt({ open, onClose, onCreated }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [githubUrl, setGithubUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsedPrompts, setParsedPrompts] = useState<ReturnType<typeof mockParsePrompts>>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  if (!open) return null;

  function handleParse() {
    if (!githubUrl.trim()) {
      setUrlError(t.create.githubUrlRequired);
      return;
    }
    if (!githubUrl.includes("github.com")) {
      setUrlError(t.create.githubUrlRequired);
      return;
    }
    setUrlError("");
    setParsing(true);
    setTimeout(() => {
      const results = mockParsePrompts(githubUrl);
      setParsedPrompts(results);
      setSelected(new Set([0]));
      setParsing(false);
      setStep(2);
    }, 1500);
  }

  function handleConfirm() {
    if (selected.size === 0) {
      toast(t.create.selectAtLeastOne, "error");
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEYS.publishedPrompts);
    const published: Skill[] = stored ? JSON.parse(stored) : [];
    const parts = githubUrl.replace(/\/$/, "").split("/");
    const owner = parts[parts.length - 2] || "user";

    for (const idx of selected) {
      const s = parsedPrompts[idx];
      published.push({
        id: `gh-prompt-${Date.now()}-${idx}`,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        category: s.category,
        categorySlug: s.categorySlug,
        difficulty: s.difficulty,
        rating: 0,
        usageCount: 0,
        lastUpdated: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        version: "v1.0",
        tags: ["imported", "github"],
        featured: false,
        trending: false,
        beginner: s.difficulty === "新手友好",
        promptOnline: s.promptOnline,
        promptLocal: s.promptLocal,
        variables: [],
        beforeAfter: { input: "", outputs: [] },
        recommendedModels: [],
        usageStepsOnline: [],
        usageStepsLocal: [],
        likes: 0,
      });
    }

    localStorage.setItem(STORAGE_KEYS.publishedPrompts, JSON.stringify(published));
    setDone(true);
    toast(t.create.importSuccess, "success");
    onCreated();
  }

  function reset() {
    setStep(1);
    setGithubUrl("");
    setUrlError("");
    setParsedPrompts([]);
    setSelected(new Set());
    setDone(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={reset}>
      <div className="w-full max-w-lg mx-4 rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <GitFork className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">{t.create.importGithub}</h2>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Step 1: Enter URL */}
        {step === 1 && !done && !parsing && (
          <div className="px-6 py-6 space-y-4">
            <p className="text-sm text-muted-foreground">{t.create.githubUrlPlaceholder}</p>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">{t.create.githubUrl} <span className="text-red-400">*</span></label>
              <Input
                value={githubUrl}
                onChange={(e) => { setGithubUrl(e.target.value); setUrlError(""); }}
                placeholder="https://github.com/user/repo"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 font-mono text-sm"
              />
              {urlError && <p className="text-xs text-red-400 mt-1">{urlError}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={reset} className="text-muted-foreground">{t.common.cancel}</Button>
              <Button onClick={handleParse} disabled={parsing} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {parsing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t.create.parsing}</> : <>{t.create.parse} <ArrowRight className="h-4 w-4 ml-1" /></>}
              </Button>
            </div>
          </div>
        )}

        {/* Parsing state */}
        {step === 1 && parsing && (
          <div className="px-6 py-12 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />
            <p className="text-sm text-foreground">{t.create.parsing}</p>
            <p className="text-xs text-muted-foreground">{t.create.parsingDesc}</p>
          </div>
        )}

        {/* Step 2: Select prompts */}
        {step === 2 && !done && (
          <div className="px-6 py-6 space-y-4">
            <p className="text-sm text-muted-foreground">{t.create.selectPromptsDesc}</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {parsedPrompts.map((p, i) => (
                <label key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(i); else next.delete(i);
                      setSelected(next);
                    }}
                    className="mt-1 h-4 w-4 rounded border-border accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{p.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground"><ArrowLeft className="h-4 w-4 mr-1" />{t.create.back}</Button>
              <Button onClick={handleConfirm} disabled={selected.size === 0} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t.create.confirmCreate}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {done && (
          <div className="px-6 py-10 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">{t.create.successTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.create.successDesc}</p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={reset} className="border-border text-foreground">{t.common.confirm}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
