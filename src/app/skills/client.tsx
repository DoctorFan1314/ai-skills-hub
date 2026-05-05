"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Zap } from "lucide-react";
import { agentSkills } from "@/lib/mock-agent-skills";
import { AgentSkillCard } from "@/components/agent-skill/agent-skill-card";
import { useI18n } from "@/contexts/i18n-context";

export default function SkillsClient() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? agentSkills.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()) ||
          s.triggers.some((tr) => tr.toLowerCase().includes(query.toLowerCase()))
      )
    : agentSkills;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-foreground">{t.agentSkills.title}</h1>
        </div>
        <p className="text-muted-foreground">{t.agentSkills.subtitle}</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.agentSkills.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-2">{t.agentSkills.emptySearch}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <AgentSkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
