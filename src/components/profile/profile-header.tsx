"use client";

import { useAuth } from "@/contexts/auth-context";
import { Calendar, Mail, User } from "lucide-react";

export function ProfileHeader() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="h-full w-full rounded-full object-cover" />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground mb-1">{user.username}</h1>
          {user.bio && <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{user.email}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />加入于 {new Date(user.joinDate).toLocaleDateString("zh-CN")}</span>
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{user.role === "admin" ? "管理员" : "用户"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
