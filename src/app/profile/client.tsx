"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ProfileHeader } from "@/components/profile/profile-header";
import { StatsDashboard } from "@/components/profile/stats-dashboard";
import { ActivityTimeline } from "@/components/profile/activity-timeline";
import { MyFavoritesTab } from "@/components/profile/my-favorites-tab";
import { MyLikesTab } from "@/components/profile/my-likes-tab";
import { MySubmissionsTab } from "@/components/profile/my-submissions-tab";
import { MyCommentsTab } from "@/components/profile/my-comments-tab";
import { UsageHistoryTab } from "@/components/profile/usage-history-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { User, Heart, Bookmark, FileText, MessageSquare, Clock, Settings } from "lucide-react";

const tabs = [
  { id: "overview", label: "概览", icon: User },
  { id: "favorites", label: "我的收藏", icon: Bookmark },
  { id: "likes", label: "我的点赞", icon: Heart },
  { id: "submissions", label: "我的提交", icon: FileText },
  { id: "comments", label: "我的评论", icon: MessageSquare },
  { id: "history", label: "使用历史", icon: Clock },
  { id: "settings", label: "设置", icon: Settings },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <AuthGuard>
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <ProfileHeader />

        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-8 border-b border-border pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === "overview" && (
            <div className="space-y-8">
              <StatsDashboard />
              <ActivityTimeline />
            </div>
          )}
          {activeTab === "favorites" && <MyFavoritesTab />}
          {activeTab === "likes" && <MyLikesTab />}
          {activeTab === "submissions" && <MySubmissionsTab />}
          {activeTab === "comments" && <MyCommentsTab />}
          {activeTab === "history" && <UsageHistoryTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </AuthGuard>
  );
}
