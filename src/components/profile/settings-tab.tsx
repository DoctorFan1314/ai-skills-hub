"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { Sun, Moon, Monitor, Download, Upload, Trash2, AlertTriangle, Camera, Bell } from "lucide-react";
import Image from "next/image";
import { AvatarCropDialog } from "./avatar-crop-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNotifications, type NotificationType } from "@/hooks/use-notifications";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function SettingsTab() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useI18n();
  const { preferences, updatePreference } = useNotifications();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Unsaved changes guard
  const isDirty = username !== (user?.username || "") || bio !== (user?.bio || "") || currentPw !== "" || newPw !== "" || confirmPw !== "";
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!user) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast(t.avatar.fileTooLarge, "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setCropImage(reader.result as string); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleCropComplete(dataUrl: string) {
    updateProfile({ avatar: dataUrl });
    setCropImage(null);
  }

  function handleSaveProfile() {
    if (!username.trim()) {
      toast(t.settings.usernameRequired, "error");
      return;
    }
    updateProfile({ username: username.trim(), bio: bio.trim() });
    toast(t.settings.profileUpdated, "success");
  }

  async function handleChangePassword() {
    setPwError("");
    if (!currentPw || !newPw) {
      setPwError(t.settings.fillAllFields);
      return;
    }
    if (newPw.length < 8) {
      setPwError(t.settings.passwordMinLength);
      return;
    }
    if (newPw !== confirmPw) {
      setPwError(t.settings.passwordMismatch);
      return;
    }
    const ok = await changePassword(currentPw, newPw);
    if (!ok) {
      setPwError(t.settings.wrongPassword);
      return;
    }
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast(t.settings.passwordChanged, "success");
  }

  function handleExportData() {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ai-skills-hub-")) {
        try { data[key] = JSON.parse(localStorage.getItem(key) || ""); } catch { data[key] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-skills-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(t.settings.dataExported, "success");
  }

  function handleClearData() {
    const keysToKeep: string[] = [STORAGE_KEYS.users, STORAGE_KEYS.session, STORAGE_KEYS.theme];
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ai-skills-hub-") && !keysToKeep.includes(key)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
    // Also clear user-scoped keys that use dynamic names
    if (user) {
      [
        STORAGE_KEYS.notificationPrefs(user.email),
        STORAGE_KEYS.follows(user.email),
        STORAGE_KEYS.collections(user.email),
        STORAGE_KEYS.notifications(user.email),
      ].forEach((k) => localStorage.removeItem(k));
    }
    setShowClearConfirm(false);
    toast(t.settings.dataCleared, "success");
  }

  function handleImportData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (typeof imported !== "object" || imported === null) {
          toast(t.settings.importError, "error");
          return;
        }
        let importCount = 0;
        for (const [key, value] of Object.entries(imported)) {
          if (key.startsWith("ai-skills-hub-")) {
            // Merge: try to append arrays, otherwise overwrite
            const existingRaw = localStorage.getItem(key);
            if (existingRaw) {
              try {
                const existingParsed = JSON.parse(existingRaw);
                const importedValue = value;
                if (Array.isArray(existingParsed) && Array.isArray(importedValue)) {
                  const existingIds = new Set(existingParsed.map((item: { id?: string }) => item.id).filter(Boolean));
                  const newItems = importedValue.filter((item: { id?: string }) => !item.id || !existingIds.has(item.id));
                  if (newItems.length > 0) {
                    localStorage.setItem(key, JSON.stringify([...newItems, ...existingParsed]));
                    importCount += newItems.length;
                  }
                } else {
                  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
                  importCount++;
                }
              } catch {
                localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
                importCount++;
              }
            } else {
              localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
              importCount++;
            }
          }
        }
        toast(`${t.settings.importSuccess} (${importCount})`, "success");
      } catch {
        toast(t.settings.importError, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDeleteAccount() {
    if (!user) return;
    // Remove user from users list
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.users);
      const users = raw ? JSON.parse(raw) : [];
      const updated = users.filter((u: { email: string }) => u.email !== user.email);
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(updated));
    } catch { /* ignore */ }
    // Clear user-scoped data
    const userEmail = user.email;
    const userKeys = [
      STORAGE_KEYS.likes(userEmail),
      STORAGE_KEYS.bookmarks(userEmail),
      STORAGE_KEYS.submissions(userEmail),
      STORAGE_KEYS.comments(userEmail),
      STORAGE_KEYS.activity(userEmail),
    ];
    userKeys.forEach((k) => localStorage.removeItem(k));
    logout();
    toast(t.settings.accountDeleted, "info");
  }

  return (
    <div className="space-y-8">
      {/* Edit Profile */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.settings.editProfile}</h3>
        <div className="space-y-4 max-w-md">
          {/* Avatar Upload */}
          <div>
            <label className="text-sm text-foreground mb-1.5 block">{t.avatar.changeAvatar}</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative h-14 w-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-xl font-bold text-primary shrink-0 group cursor-pointer overflow-hidden"
                aria-label={t.avatar.changeAvatar}
              >
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.username} fill className="rounded-full object-cover" unoptimized />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </button>
              <div>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-border text-foreground hover:bg-secondary">
                  <Camera className="h-3.5 w-3.5 mr-1.5" />{t.avatar.changeAvatar}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">{t.avatar.uploadHint}</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label htmlFor="settings-username" className="text-sm text-foreground mb-1.5 block">{t.settings.username}</label>
            <Input id="settings-username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-secondary border-border text-foreground" />
          </div>
          <div>
            <label htmlFor="settings-bio" className="text-sm text-foreground mb-1.5 block">{t.settings.bio}</label>
            <Textarea id="settings-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder={t.settings.bioPlaceholder} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50" />
          </div>
          <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">{t.settings.saveProfile}</Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.settings.changePassword}</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="settings-current-pw" className="text-sm text-foreground mb-1.5 block">{t.settings.currentPassword}</label>
            <Input id="settings-current-pw" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="bg-secondary border-border text-foreground" />
          </div>
          <div>
            <label htmlFor="settings-new-pw" className="text-sm text-foreground mb-1.5 block">{t.settings.newPassword}</label>
            <Input id="settings-new-pw" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder={t.settings.passwordPlaceholder} className="bg-secondary border-border text-foreground" />
          </div>
          <div>
            <label htmlFor="settings-confirm-pw" className="text-sm text-foreground mb-1.5 block">{t.settings.confirmPassword}</label>
            <Input id="settings-confirm-pw" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="bg-secondary border-border text-foreground" />
          </div>
          {pwError && <p className="text-sm text-red-400">{pwError}</p>}
          <Button onClick={handleChangePassword} variant="outline" className="border-border text-foreground hover:bg-secondary">{t.settings.changePassword}</Button>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.settings.themePreference}</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { key: "light" as const, label: t.settings.light, icon: Sun },
            { key: "dark" as const, label: t.settings.dark, icon: Moon },
            { key: "system" as const, label: t.settings.system, icon: Monitor },
          ].map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setTheme(opt.key)}
                aria-pressed={theme === opt.key}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                  theme === opt.key
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Bell className="h-5 w-5" />{t.notificationPrefs.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{t.notificationPrefs.description}</p>
        <div className="space-y-4 max-w-lg">
          {([
            { type: "comment_reply" as NotificationType, label: t.notificationPrefs.commentReply, desc: t.notificationPrefs.commentReplyDesc },
            { type: "skill_update" as NotificationType, label: t.notificationPrefs.skillUpdate, desc: t.notificationPrefs.skillUpdateDesc },
            { type: "submission_status" as NotificationType, label: t.notificationPrefs.submissionStatus, desc: t.notificationPrefs.submissionStatusDesc },
            { type: "like" as NotificationType, label: t.notificationPrefs.like, desc: t.notificationPrefs.likeDesc },
            { type: "follow" as NotificationType, label: t.notificationPrefs.follow, desc: t.notificationPrefs.followDesc },
            { type: "system" as NotificationType, label: t.notificationPrefs.system, desc: t.notificationPrefs.systemDesc },
          ]).map((item) => (
            <div key={item.type} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={preferences[item.type] !== false}
                onClick={() => updatePreference(item.type, !(preferences[item.type] !== false))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  preferences[item.type] !== false ? "bg-primary" : "bg-secondary border border-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences[item.type] !== false ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.settings.dataManage}</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button onClick={handleExportData} variant="outline" className="border-border text-foreground hover:bg-secondary">
            <Download className="h-4 w-4 mr-2" />{t.settings.exportData}
          </Button>
          <Button onClick={() => importInputRef.current?.click()} variant="outline" className="border-border text-foreground hover:bg-secondary">
            <Upload className="h-4 w-4 mr-2" />{t.settings.importData}
          </Button>
          <Button onClick={() => setShowClearConfirm(true)} variant="outline" className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Trash2 className="h-4 w-4 mr-2" />{t.settings.clearData}
          </Button>
          <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImportData} />
        </div>
        <p className="text-xs text-muted-foreground">{t.settings.exportDesc}</p>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />{t.settings.dangerZone}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{t.settings.dangerDesc}</p>
        {!showDeleteConfirm ? (
          <Button variant="outline" onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(""); }} className="border-destructive/30 text-destructive hover:bg-destructive/10">
            {t.settings.deleteAccount}
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={t.settings.deleteConfirmPrompt}
              className="max-w-xs bg-secondary border-destructive/30 text-foreground placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  if (deleteConfirmText !== "DELETE" && deleteConfirmText !== "删除") {
                    toast(t.settings.deleteConfirmMismatch, "error");
                    return;
                  }
                  handleDeleteAccount();
                }}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {t.settings.confirmDelete}
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="text-muted-foreground">{t.common.cancel}</Button>
            </div>
          </div>
        )}
      </div>
      {cropImage && (
        <AvatarCropDialog
          open={!!cropImage}
          onOpenChange={(open) => { if (!open) setCropImage(null); }}
          imageSrc={cropImage}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.clearDataConfirmTitle}</DialogTitle>
            <DialogDescription>{t.settings.clearDataConfirmDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t.common.cancel}
            </DialogClose>
            <Button onClick={handleClearData} className="bg-destructive text-white hover:bg-destructive/90">
              {t.common.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
