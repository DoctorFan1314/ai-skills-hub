"use client";

import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/contexts/toast-context";

const LABELS = {
  zh: { title: "账户设置", username: "用户名", email: "邮箱", save: "保存修改", saved: "已保存", bio: "个人简介", apiEndpoint: "API 端点", copyEndpoint: "复制" },
  en: { title: "Account Settings", username: "Username", email: "Email", save: "Save Changes", saved: "Saved", bio: "Bio", apiEndpoint: "API Endpoint", copyEndpoint: "Copy" },
};

export default function SettingsPage() {
  const { lang } = useI18n();
  const { user, updateProfile } = useAuth();
  const { toast: showToast } = useToast();
  const t = LABELS[lang];
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateProfile({ username, bio });
    showToast(t.saved, "success");
    setSaving(false);
  };

  const endpoint = typeof window !== "undefined" ? `${window.location.origin}/api/v1` : "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t.apiEndpoint}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/50 rounded px-3 py-2 text-sm font-mono">{endpoint}</code>
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(endpoint); showToast(t.copyEndpoint, "success"); }}>
              {t.copyEndpoint}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">{t.email}</label>
            <Input value={user?.email || ""} disabled className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t.username}</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t.bio}</label>
            <Input value={bio} onChange={e => setBio(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={save} disabled={saving}>{t.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
