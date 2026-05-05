"use client";

import { useAuth } from "@/contexts/auth-context";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { UserActivity } from "@/lib/types";
import { ThumbsUp, Bookmark, MessageSquare, Send, Eye, Copy } from "lucide-react";

const typeConfig = {
  like: { icon: ThumbsUp, color: "text-red-400", bg: "bg-red-400/10", label: "点赞了" },
  bookmark: { icon: Bookmark, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "收藏了" },
  comment: { icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-400/10", label: "评论了" },
  submit: { icon: Send, color: "text-primary", bg: "bg-primary/10", label: "提交了模板" },
  view: { icon: Eye, color: "text-muted-foreground", bg: "bg-secondary", label: "浏览了" },
  copy: { icon: Copy, color: "text-green-400", bg: "bg-green-400/10", label: "复制了 Prompt" },
} as const;

export function ActivityTimeline() {
  const { user } = useAuth();
  if (!user) return null;

  let activities: UserActivity[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activity(user.email));
    activities = raw ? JSON.parse(raw) : [];
  } catch { /* ignore */ }

  if (activities.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Eye className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">暂无活动记录</p>
        <p className="text-sm text-muted-foreground/60">浏览技能、点赞、收藏等操作会自动记录在这里</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">最近活动</h2>
      <div className="space-y-3">
        {activities.slice(0, 20).map((activity) => {
          const config = typeConfig[activity.type] || typeConfig.view;
          const Icon = config.icon;
          return (
            <div key={activity.id} className="glass-card p-3 flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {config.label}
                  {activity.targetTitle && <span className="text-muted-foreground"> — {activity.targetTitle}</span>}
                </p>
              </div>
              <time className="text-xs text-muted-foreground shrink-0">
                {new Date(activity.timestamp).toLocaleDateString("zh-CN")}
              </time>
            </div>
          );
        })}
      </div>
    </div>
  );
}
