"use client";

import { useAuth } from "@/contexts/auth-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { Submission, Comment, UserActivity } from "@/lib/types";
import { FileText, Heart, Bookmark, MessageSquare } from "lucide-react";

export function StatsDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const submissionsKey = STORAGE_KEYS.submissions(user.email);
  const likesKey = STORAGE_KEYS.likes(user.email);
  const bookmarksKey = STORAGE_KEYS.bookmarks(user.email);
  const commentsKey = STORAGE_KEYS.comments(user.email);

  // Read directly from localStorage to avoid extra hooks
  const getLen = (key: string): number => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  };

  const stats = [
    { label: "我的提交", value: getLen(submissionsKey), icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "我的点赞", value: getLen(likesKey), icon: Heart, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "我的收藏", value: getLen(bookmarksKey), icon: Bookmark, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "我的评论", value: getLen(commentsKey), icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${stat.bg} mb-2`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
