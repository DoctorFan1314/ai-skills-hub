"use client";

import Link from "next/link";
import { BookOpen, Puzzle, LayoutGrid, TrendingUp, Tags, Send, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

const SECTIONS = [
  { href: "/skills", icon: Puzzle, zh: "Agent 技能市场", en: "Agent Skills", zhDesc: "可执行的 AI 技能，一键安装赋予 AI 行动力", enDesc: "Executable AI skills — install and give AI real action power" },
  { href: "/prompts", icon: BookOpen, zh: "Prompt 模板", en: "Prompt Templates", zhDesc: "28+ 高质量模板，覆盖编程、写作、分析等场景", enDesc: "28+ quality templates for coding, writing, analysis" },
  { href: "/categories", icon: LayoutGrid, zh: "分类浏览", en: "Categories", zhDesc: "按方向浏览 Prompt 模板", enDesc: "Browse prompts by category" },
  { href: "/trending", icon: TrendingUp, zh: "排行榜", en: "Trending", zhDesc: "热门 Prompt 模板排行", enDesc: "Trending prompt templates" },
  { href: "/tags", icon: Tags, zh: "标签云", en: "Tags", zhDesc: "通过标签发现内容", enDesc: "Discover content through tags" },
  { href: "/submit", icon: Send, zh: "提交模板", en: "Submit", zhDesc: "分享你的 Prompt 模板", enDesc: "Share your prompt templates" },
];

export default function ResourcesPage() {
  const { lang } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {lang === "zh" ? "资源中心" : "Resource Hub"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {lang === "zh"
            ? "Prompt 模板和 Agent 技能，帮助你更好地使用 AI"
            : "Prompt templates and Agent skills to help you get more from AI"
          }
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="glass-card glass-card-hover p-6 rounded-xl group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{s[lang]}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{s[`${lang}Desc` as 'zhDesc' | 'enDesc']}</p>
            <span className="text-primary text-sm flex items-center gap-1 group-hover:underline">
              {lang === "zh" ? "前往" : "Go"} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
