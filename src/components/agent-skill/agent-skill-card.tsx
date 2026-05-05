"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";
import type { AgentSkill } from "@/lib/types";

export function AgentSkillCard({ skill }: { skill: AgentSkill }) {
  return (
    <Link href={`/skills/${skill.id}`}>
      <div className="glass-card glass-card-hover p-5 h-full cursor-pointer group flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="text-xs bg-purple-400/10 text-purple-400 border-purple-400/20 border">
            Agent 技能
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-purple-400" />
            <span>{skill.triggers.length} 触发词</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {skill.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {skill.description.split("\n").find(l => l && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("```"))?.slice(0, 80) || ""}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.triggers.slice(0, 4).map((trigger) => (
            <span
              key={trigger}
              className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground/80 border border-border"
            >
              {trigger}
            </span>
          ))}
          {skill.triggers.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 text-muted-foreground/60">
              +{skill.triggers.length - 4}
            </span>
          )}
        </div>
        <div className="flex items-center justify-end">
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
