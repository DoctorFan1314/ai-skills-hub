"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkillCard } from "@/components/skill/skill-card";
import type { Skill } from "@/lib/types";
import { useI18n } from "@/contexts/i18n-context";

export function SkillSection({ title, subtitle, skills, viewAllHref }: { title: string; subtitle?: string; skills: Skill[]; viewAllHref?: string }) {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <Link href={viewAllHref || "/prompts"} className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0">
          {t.common.viewAll} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
