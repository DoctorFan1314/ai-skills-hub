"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, Plus, Trash2, FileCode, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { useToast } from "@/contexts/toast-context";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { AgentSkill } from "@/lib/types";

const CATEGORIES = [
  "Web 开发",
  "代码执行",
  "文件处理",
  "数据分析",
  "多平台交互",
  "通讯协作",
  "其他",
];

const LICENSES = ["MIT", "Apache-2.0", "BSD-3-Clause", "Other"];

interface SkillFile {
  name: string;
  content: string;
  showContent: boolean;
}

export default function PublishClient() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [publishedSkill, setPublishedSkill] = useState<AgentSkill | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<SkillFile[]>([{ name: "index.ts", content: "", showContent: true }]);

  function addFile() {
    setFiles((prev) => [...prev, { name: `file-${prev.length + 1}.ts`, content: "", showContent: true }]);
  }

  function removeFile(index: number) {
    if (files.length <= 1) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFileName(index: number, name: string) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, name } : f)));
  }

  function updateFileContent(index: number, content: string) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, content } : f)));
  }

  function toggleFileContent(index: number) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, showContent: !f.showContent } : f)));
  }

  function validate(fd: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(fd.get("name") as string)?.trim()) errs.name = t.publish.nameRequired;
    if (!(fd.get("title") as string)?.trim()) errs.title = t.publish.titleRequired;
    if (!(fd.get("description") as string)?.trim()) errs.description = t.publish.descRequired;
    if (!(fd.get("developer") as string)?.trim()) errs.developer = t.publish.developerRequired;
    if (!(fd.get("installCommand") as string)?.trim()) errs.installCommand = t.publish.installRequired;
    if (!(fd.get("version") as string)?.trim()) errs.version = t.publish.versionRequired;
    if (!(fd.get("readme") as string)?.trim()) errs.readme = t.publish.readmeRequired;
    const validFiles = files.filter((f) => f.name.trim() && f.content.trim());
    if (validFiles.length === 0) errs.files = t.publish.filesRequired;
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const filesRecord: Record<string, string> = {};
    for (const f of files) {
      if (f.name.trim() && f.content.trim()) {
        filesRecord[f.name.trim()] = f.content.trim();
      }
    }

    const tagsStr = (fd.get("tags") as string)?.trim() || "";
    const tags = tagsStr ? tagsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const skill: AgentSkill = {
      id: `published-${Date.now()}`,
      name: (fd.get("name") as string).trim(),
      title: (fd.get("title") as string).trim(),
      description: (fd.get("description") as string).trim(),
      avatar: "📦",
      author: `@${(fd.get("developer") as string).trim()}`,
      developer: (fd.get("developer") as string).trim(),
      downloads: 0,
      stars: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
      collection: "Community",
      category: (fd.get("category") as string) || CATEGORIES[0],
      categorySlug: ((fd.get("category") as string) || CATEGORIES[0]).toLowerCase().replace(/\s+/g, "-"),
      installCommand: (fd.get("installCommand") as string).trim(),
      readme: (fd.get("readme") as string).trim(),
      license: (fd.get("license") as string) || "MIT",
      version: (fd.get("version") as string).trim(),
      files: filesRecord,
      demoInput: (fd.get("demoInput") as string)?.trim() || "",
      demoOutput: (fd.get("demoOutput") as string)?.trim() || "",
      triggers: [],
      tags,
      featured: false,
      trending: false,
    };

    // Save to localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.publishedSkills);
    const published: AgentSkill[] = stored ? JSON.parse(stored) : [];
    published.push(skill);
    localStorage.setItem(STORAGE_KEYS.publishedSkills, JSON.stringify(published));

    setPublishedSkill(skill);
    setSubmitted(true);
    toast(t.publish.successTitle, "success");
  }

  if (submitted && publishedSkill) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-3">{t.publish.successTitle}</h1>
        <p className="text-muted-foreground mb-8">{t.publish.successDesc}</p>
        <div className="flex items-center justify-center gap-3">
          <Link href={`/skills/${publishedSkill.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t.publish.viewSkill}
            </Button>
          </Link>
          <Button onClick={() => { setSubmitted(false); setPublishedSkill(null); setFiles([{ name: "index.ts", content: "", showContent: true }]); }} variant="outline" className="border-border text-foreground hover:bg-secondary">
            {t.publish.publishAnother}
          </Button>
        </div>

        {/* Show published skills list */}
        {(() => {
          const stored = localStorage.getItem(STORAGE_KEYS.publishedSkills);
          const published: AgentSkill[] = stored ? JSON.parse(stored) : [];
          if (published.length === 0) return null;
          return (
            <div className="mt-10 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.publish.mySkills} ({published.length})</h2>
              <div className="space-y-3">
                {published.map((s) => (
                  <Link key={s.id} href={`/skills/${s.id}`} className="glass-card p-4 block hover:border-primary/30 transition-colors">
                    <p className="text-foreground font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.category} · v{s.version} · {s.lastUpdated}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.publish.title}</h1>
        <p className="text-muted-foreground">{t.publish.subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">{t.publish.basicInfo}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm text-foreground mb-1.5 block">{t.publish.skillName} <span className="text-red-400">*</span></label>
              <Input id="name" name="name" required placeholder={t.publish.skillNamePlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="title" className="text-sm text-foreground mb-1.5 block">{t.publish.displayName} <span className="text-red-400">*</span></label>
              <Input id="title" name="title" required placeholder={t.publish.displayNamePlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="description" className="text-sm text-foreground mb-1.5 block">{t.publish.description} <span className="text-red-400">*</span></label>
            <Textarea id="description" name="description" required rows={2} placeholder={t.publish.descriptionPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 text-sm" />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="text-sm text-foreground mb-1.5 block">{t.publish.category} <span className="text-red-400">*</span></label>
              <select id="category" name="category" defaultValue={CATEGORIES[0]} className="w-full h-9 rounded-md border border-border bg-secondary px-3 text-sm text-foreground">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="developer" className="text-sm text-foreground mb-1.5 block">{t.publish.developer} <span className="text-red-400">*</span></label>
              <Input id="developer" name="developer" required placeholder={t.publish.developerPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
              {errors.developer && <p className="text-xs text-red-400 mt-1">{errors.developer}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="installCommand" className="text-sm text-foreground mb-1.5 block">{t.publish.installCommand} <span className="text-red-400">*</span></label>
              <Input id="installCommand" name="installCommand" required placeholder={t.publish.installCommandPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 font-mono text-sm" />
              {errors.installCommand && <p className="text-xs text-red-400 mt-1">{errors.installCommand}</p>}
            </div>
            <div>
              <label htmlFor="version" className="text-sm text-foreground mb-1.5 block">{t.publish.version} <span className="text-red-400">*</span></label>
              <Input id="version" name="version" required placeholder="1.0.0" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
              {errors.version && <p className="text-xs text-red-400 mt-1">{errors.version}</p>}
            </div>
            <div>
              <label htmlFor="license" className="text-sm text-foreground mb-1.5 block">{t.publish.license}</label>
              <select id="license" name="license" defaultValue="MIT" className="w-full h-9 rounded-md border border-border bg-secondary px-3 text-sm text-foreground">
                {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="tags" className="text-sm text-foreground mb-1.5 block">{t.publish.tags}</label>
            <Input id="tags" name="tags" placeholder={t.publish.tagsPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
          </div>
        </div>

        {/* README */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">{t.publish.content}</h2>
          <div>
            <label htmlFor="readme" className="text-sm text-foreground mb-1.5 block">{t.publish.readme} <span className="text-red-400">*</span></label>
            <Textarea id="readme" name="readme" required rows={12} placeholder={t.publish.readmePlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 font-mono text-sm" />
            {errors.readme && <p className="text-xs text-red-400 mt-1">{errors.readme}</p>}
          </div>
        </div>

        {/* Files */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t.publish.files} <span className="text-red-400">*</span></h2>
            <Button type="button" size="sm" variant="outline" onClick={addFile} className="border-border text-foreground hover:bg-secondary">
              <Plus className="h-3.5 w-3.5 mr-1" />{t.publish.addFile}
            </Button>
          </div>
          {errors.files && <p className="text-xs text-red-400">{errors.files}</p>}
          <div className="space-y-4">
            {files.map((file, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50">
                  <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Input
                    value={file.name}
                    onChange={(e) => updateFileName(i, e.target.value)}
                    placeholder={t.publish.fileName}
                    className="h-7 bg-transparent border-0 p-0 text-sm font-mono text-foreground focus-visible:ring-0"
                  />
                  <div className="flex items-center gap-1 ml-auto">
                    <button type="button" onClick={() => toggleFileContent(i)} className="text-muted-foreground hover:text-foreground p-1">
                      {file.showContent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    {files.length > 1 && (
                      <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-red-400 p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {file.showContent && (
                  <Textarea
                    value={file.content}
                    onChange={(e) => updateFileContent(i, e.target.value)}
                    placeholder={t.publish.fileContent}
                    rows={8}
                    className="border-0 rounded-none bg-[#0d1117] text-foreground placeholder:text-muted-foreground/40 font-mono text-sm focus-visible:ring-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">{t.publish.examples}</h2>
          <div>
            <label htmlFor="demoInput" className="text-sm text-foreground mb-1.5 block">{t.publish.demoInput}</label>
            <Input id="demoInput" name="demoInput" placeholder={t.publish.demoInputPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
          </div>
          <div>
            <label htmlFor="demoOutput" className="text-sm text-foreground mb-1.5 block">{t.publish.demoOutput}</label>
            <Textarea id="demoOutput" name="demoOutput" rows={4} placeholder={t.publish.demoOutputPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 text-sm" />
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-12 text-base">
          <Send className="h-4 w-4 mr-2" />{t.publish.submitBtn}
        </Button>
      </form>
    </div>
  );
}
