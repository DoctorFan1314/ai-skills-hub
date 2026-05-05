"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SkillCard } from "@/components/skill/skill-card";
import type { Skill } from "@/lib/types";

export default function TagDetailClient({ tag, skills }: { tag: string; skills: Skill[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Link href="/tags" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />返回标签云
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">#{tag}</h1>
        <p className="text-muted-foreground">共 {skills.length} 个相关技能模板</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </div>
  );
}
