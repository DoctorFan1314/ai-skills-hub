"use client";

import { useState } from "react";
import Link from "next/link";
import { skills } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Clock, Award, ThumbsUp } from "lucide-react";

type TabKey = "hot" | "new" | "featured" | "liked";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "hot", label: "本周热门", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "new", label: "最新技能", icon: <Clock className="h-4 w-4" /> },
  { key: "featured", label: "编辑精选", icon: <Award className="h-4 w-4" /> },
  { key: "liked", label: "最多点赞", icon: <ThumbsUp className="h-4 w-4" /> },
];

function getRankColor(rank: number) {
  if (rank === 1) return "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30";
  if (rank === 2) return "from-gray-400/20 to-gray-500/5 border-gray-400/30";
  if (rank === 3) return "from-orange-700/20 to-orange-800/5 border-orange-700/30";
  return "";
}

function getRankBadge(rank: number) {
  if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/30";
  if (rank === 3) return "bg-orange-700/20 text-orange-400 border-orange-700/30";
  return "";
}

export default function TrendingClient() {
  const [tab, setTab] = useState<TabKey>("hot");

  const sorted = [...skills].sort((a, b) => {
    if (tab === "hot") return b.usageCount - a.usageCount;
    if (tab === "new") return b.lastUpdated.localeCompare(a.lastUpdated);
    if (tab === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
    return b.likes - a.likes;
  });

  const list = tab === "featured" ? sorted.filter((s) => s.featured) : sorted;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">排行榜</h1>
        <p className="text-muted-foreground">发现社区中最受欢迎的 AI 技能</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              tab === t.key
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.map((skill, i) => {
          const rank = i + 1;
          return (
            <Link
              key={skill.id}
              href={`/prompts/${skill.id}`}
              className={`block glass-card p-5 transition-all hover:scale-[1.01] ${rank <= 3 ? `bg-gradient-to-r ${getRankColor(rank)} border` : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${rank <= 3 ? getRankBadge(rank) + " border" : "bg-secondary text-muted-foreground border border-border"}`}>
                  {rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-foreground font-semibold truncate">{skill.title}</h3>
                    {rank <= 3 && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {rank === 1 ? "金牌" : rank === 2 ? "银牌" : "铜牌"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{skill.subtitle}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />{skill.rating}</span>
                  <span>{skill.usageCount}+</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
