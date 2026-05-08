"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Star, Copy, Check, Terminal, CheckCircle } from "lucide-react";
import type { AgentSkill } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/contexts/i18n-context";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { TagChip } from "@/components/ui/tag-chip";

export function AgentSkillCard({ skill, compareMode, selected, onToggleSelect }: { skill: AgentSkill; compareMode?: boolean; selected?: boolean; onToggleSelect?: (id: string) => void }) {
  const { copied, copy } = useCopyToClipboard();
  const { t } = useI18n();

  const preventLinkNav = compareMode ? (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(skill.id); } : undefined;

  return (
    <div
      className={`glass-card glass-card-hover p-5 h-full group flex flex-col relative ${selected ? "ring-2 ring-primary" : ""} ${compareMode ? "cursor-pointer" : ""}`}
      onClick={compareMode ? (e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(skill.id); } : undefined}
      role={compareMode ? "checkbox" : undefined}
      aria-checked={compareMode ? selected : undefined}
      aria-label={compareMode ? `${skill.name} - ${selected ? "Selected" : "Not selected"} for comparison` : undefined}
      tabIndex={compareMode ? 0 : undefined}
      onKeyDown={compareMode ? (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggleSelect?.(skill.id); } } : undefined}
    >
      {compareMode && (
        <div
          className={`absolute top-3 left-3 z-10 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors pointer-events-none ${
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-secondary/80 border-border text-muted-foreground"
          }`}
          aria-hidden="true"
        >
          {selected && <CheckCircle className="h-4 w-4" />}
        </div>
      )}
      {skill.trending && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {t.agentSkills.trending}
          </span>
        </div>
      )}
      {skill.difficulty && (
        <div className={`absolute z-10 ${skill.trending ? "top-10 right-3" : "top-3 right-3"}`}>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            skill.difficulty === "beginner" ? "bg-green-500/10 text-green-400 border-green-500/20" :
            skill.difficulty === "intermediate" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
            "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {skill.difficulty === "beginner" ? t.prompts.difficultyEasy : skill.difficulty === "intermediate" ? t.prompts.difficultyMedium : t.prompts.difficultyHard}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <Link href={`/skills/${skill.id}`} className="shrink-0" aria-label={skill.title} onClick={preventLinkNav}>
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg hover:border-primary/40 transition-colors">
            {skill.avatar || skill.name.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-0.5 pr-20">
            <Link href={`/skills/${skill.id}`} className="min-w-0" onClick={preventLinkNav}>
              <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {skill.name}
              </h3>
            </Link>
            {skill.authorBadge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-400 border-blue-500/20 border shrink-0">
                {skill.authorBadge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{skill.author}</p>
        </div>
      </div>

      <Link href={`/skills/${skill.id}`} className="block" onClick={preventLinkNav}>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {skill.description}
        </p>
      </Link>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skill.tags.slice(0, 3).map((tag) => (
          <TagChip key={tag} tag={tag} className="text-[10px] border border-border" />
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {formatNumber(skill.downloads)}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {formatNumber(skill.stars)}
        </span>
        <span className="text-muted-foreground/60">{skill.lastUpdated}</span>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={copied ? "Copied" : `Copy install command for ${skill.name}`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 border border-border group/install cursor-pointer hover:border-primary/30 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          copy(skill.installCommand, t.agentSkills.installCopied);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            copy(skill.installCommand, t.agentSkills.installCopied);
          }
        }}
      >
        <Terminal className="h-3 w-3 text-muted-foreground shrink-0" />
        <code className="text-xs text-muted-foreground truncate flex-1 font-mono">{skill.installCommand}</code>
        {copied ? <Check className="h-3 w-3 text-green-400 shrink-0" /> : <Copy className="h-3 w-3 text-muted-foreground/60 group-hover/install:text-muted-foreground shrink-0" />}
      </div>
    </div>
  );
}
