"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SkillCard } from "@/components/skill/skill-card";
import { AgentSkillCard } from "@/components/agent-skill/agent-skill-card";
import { useI18n } from "@/contexts/i18n-context";
import type { Skill, AgentSkill } from "@/lib/types";

const PAGE_SIZE = 12;

export default function TagDetailClient({ tag, prompts, agents }: { tag: string; prompts: Skill[]; agents: AgentSkill[] }) {
  const { t } = useI18n();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const total = prompts.length + agents.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Breadcrumb items={[{ label: "Tags", href: "/tags" }, { label: `#${tag}` }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">#{tag}</h1>
        <p className="text-muted-foreground">{t.tags.relatedSkills.replace("{count}", String(total))}</p>
      </div>

      {agents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t.home.tabAgent}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((s) => (
              <AgentSkillCard key={s.id} skill={s} />
            ))}
          </div>
        </div>
      )}

      {prompts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t.home.tabPrompt}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prompts.slice(0, visibleCount).map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
          {prompts.length > visibleCount && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-6 py-2.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/30 transition-colors"
              >
                {t.common.more}（{prompts.length - visibleCount}）
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
