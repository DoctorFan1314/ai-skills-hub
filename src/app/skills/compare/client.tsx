"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAgentSkillById } from "@/lib/mock-agent-skills";
import { useI18n } from "@/contexts/i18n-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Star, Terminal, Trophy, Scale, FileCode } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { CopyButton } from "@/components/shared/copy-button";
import type { AgentSkill } from "@/lib/types";

function StatCell({ label, val1, val2, higher }: { label: string; val1: string; val2: string; higher?: "left" | "right" }) {
  const { t } = useI18n();
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4 text-muted-foreground text-sm font-medium whitespace-nowrap align-top">{label}</td>
      <td className={`py-3 px-4 text-sm text-center ${higher === "left" ? "text-primary font-semibold" : "text-foreground"}`}>
        {val1}
        {higher === "left" && (
          <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] text-primary">
            <Trophy className="h-3 w-3" /> {t.compare.higher}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-center border-l border-border">
        <div className="h-4" />
      </td>
      <td className={`py-3 pl-4 text-sm text-center ${higher === "right" ? "text-primary font-semibold" : "text-foreground"}`}>
        {val2}
        {higher === "right" && (
          <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] text-primary">
            <Trophy className="h-3 w-3" /> {t.compare.higher}
          </span>
        )}
      </td>
    </tr>
  );
}

function SkillColumn({ skill }: { skill: AgentSkill }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {skill.avatar || skill.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">{skill.name}</h3>
            <p className="text-sm text-muted-foreground">{skill.author}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">{skill.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
              {tag}
            </span>
          ))}
        </div>
        <Badge variant="secondary" className="bg-secondary text-muted-foreground border-border mb-4">
          {skill.category}
        </Badge>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{formatNumber(skill.downloads)}</span>
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{formatNumber(skill.stars)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Scale className="h-3.5 w-3.5" />
          <span>{skill.version}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <FileCode className="h-3.5 w-3.5" />
          <span>{skill.license}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1117] border border-border">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <code className="text-xs text-foreground font-mono flex-1 truncate">{skill.installCommand}</code>
          <CopyButton text={skill.installCommand} className="ml-1 text-muted-foreground hover:text-foreground transition-colors" size={12} />
        </div>
      </div>
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const ids = searchParams.get("ids")?.split(",") || [];

  if (ids.length !== 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t.compare.title}</h2>
        <p className="text-muted-foreground mb-6">{t.compare.noSkillsSelected}</p>
        <Link href="/skills">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.compare.backToSkills}
          </Button>
        </Link>
      </div>
    );
  }

  const skill1 = getAgentSkillById(ids[0]);
  const skill2 = getAgentSkillById(ids[1]);

  if (!skill1 || !skill2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t.compare.title}</h2>
        <p className="text-muted-foreground mb-6">{t.compare.noSkillsSelected}</p>
        <Link href="/skills">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.compare.backToSkills}
          </Button>
        </Link>
      </div>
    );
  }

  if (ids[0] === ids[1]) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t.compare.title}</h2>
        <p className="text-muted-foreground mb-6">{t.compare.sameSkillWarning}</p>
        <Link href="/skills">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.compare.backToSkills}
          </Button>
        </Link>
      </div>
    );
  }

  const d1Higher = skill1.downloads > skill2.downloads ? "left" as const : skill2.downloads > skill1.downloads ? "right" as const : undefined;
  const s1Higher = skill1.stars > skill2.stars ? "left" as const : skill2.stars > skill1.stars ? "right" as const : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <Link href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.compare.backToSkills}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.compare.title}</h1>
      </div>

      {/* Side by side cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SkillColumn skill={skill1} />
        <SkillColumn skill={skill2} />
      </div>

      {/* Comparison table */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.compare.title}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left text-xs text-muted-foreground font-medium uppercase tracking-wide w-32" />
              <th className="py-2 px-4 text-center text-xs text-muted-foreground font-medium uppercase tracking-wide">{skill1.name}</th>
              <th className="py-2 px-4 text-center text-xs text-muted-foreground/30 font-medium w-8" />
              <th className="py-2 pl-4 text-center text-xs text-muted-foreground font-medium uppercase tracking-wide">{skill2.name}</th>
            </tr>
          </thead>
          <tbody>
            <StatCell label={t.compare.downloads} val1={formatNumber(skill1.downloads)} val2={formatNumber(skill2.downloads)} higher={d1Higher} />
            <StatCell label={t.compare.stars} val1={formatNumber(skill1.stars)} val2={formatNumber(skill2.stars)} higher={s1Higher} />
            <StatCell label={t.compare.author} val1={skill1.author} val2={skill2.author} />
            <StatCell label={t.compare.category} val1={skill1.category} val2={skill2.category} />
            <StatCell label={t.compare.version} val1={skill1.version} val2={skill2.version} />
            <StatCell label={t.compare.license} val1={skill1.license} val2={skill2.license} />
            <StatCell label={t.compare.description} val1={skill1.description.slice(0, 80) + "..."} val2={skill2.description.slice(0, 80) + "..."} />
            <StatCell label={t.compare.tags} val1={skill1.tags.join(", ")} val2={skill2.tags.join(", ")} />
            <StatCell label={t.compare.installCommand} val1={skill1.installCommand} val2={skill2.installCommand} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CompareClient() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 animate-pulse"><div className="h-8 w-48 bg-secondary rounded mb-4" /><div className="grid md:grid-cols-2 gap-6"><div className="h-96 bg-secondary rounded-lg" /><div className="h-96 bg-secondary rounded-lg" /></div></div>}>
      <CompareContent />
    </Suspense>
  );
}
