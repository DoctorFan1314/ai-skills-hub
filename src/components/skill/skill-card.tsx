import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, Users, ArrowRight } from "lucide-react";
import type { Skill } from "@/lib/types";

export function SkillCard({ skill }: { skill: Skill }) {
  const categoryColors: Record<string, string> = {
    content: "#00d4ff",
    coding: "#7c3aed",
    thinking: "#10b981",
  };
  const color = categoryColors[skill.categorySlug] || "#00d4ff";

  return (
    <Link href={`/skills/${skill.id}`}>
      <div className="glass-card glass-card-hover p-5 h-full cursor-pointer group flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="secondary"
            className="text-xs border"
            style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}
          >
            {skill.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-[#8b949e]">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{skill.rating}</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#00d4ff] transition-colors">
          {skill.title}
        </h3>
        <p className="text-sm text-[#8b949e] mb-4 line-clamp-2 flex-1">{skill.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#8b949e]">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {skill.usageCount}+
            </span>
            <span>{skill.difficulty}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-[#8b949e] group-hover:text-[#00d4ff] transition-all group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
