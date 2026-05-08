"use client";

import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { getSkillById } from "@/lib/mock-data";
import { getAgentSkillById } from "@/lib/mock-agent-skills";
import { SkillCard } from "@/components/skill/skill-card";
import { AgentSkillCard } from "@/components/agent-skill/agent-skill-card";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MyFavoritesTab() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [visibleCount, setVisibleCount] = useState(10);
  const key = user ? STORAGE_KEYS.bookmarks(user.email) : "ai-skills-hub-guest";
  const [bookmarkedIds] = useLocalStorage<string[]>(key, []);
  const promptSkills = bookmarkedIds.map((id) => getSkillById(id)).filter(Boolean);
  const agentSkills = bookmarkedIds.map((id) => getAgentSkillById(id)).filter(Boolean);
  const allItems = [
    ...agentSkills.map((s) => ({ type: "agent" as const, skill: s })),
    ...promptSkills.map((s) => ({ type: "prompt" as const, skill: s })),
  ];

  if (promptSkills.length === 0 && agentSkills.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-foreground font-medium mb-1">{t.profile.noFavorites}</p>
        <p className="text-sm text-muted-foreground">{t.profile.noFavoritesDesc}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allItems.slice(0, visibleCount).map((item) =>
          item.type === "agent" ? (
            <AgentSkillCard key={item.skill!.id} skill={item.skill!} />
          ) : (
            <SkillCard key={item.skill!.id} skill={item.skill!} />
          )
        )}
      </div>
      {allItems.length > visibleCount && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + 10)} className="border-border text-muted-foreground hover:bg-secondary">
            {t.common.loadMore} <span className="ml-1 text-xs text-muted-foreground/60">({allItems.length - visibleCount} {t.common.remaining})</span>
          </Button>
        </div>
      )}
    </div>
  );
}
