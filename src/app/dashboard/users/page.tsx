"use client";

import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { Users, Search, Shield, Loader2, Pencil, Trash2, Wallet } from "lucide-react";

interface UserItem {
  id: number;
  email: string;
  username: string;
  balance: number;
  role: "user" | "admin";
  enabled: number;
  created_at: string;
}

const LABELS = {
  zh: {
    title: "用户管理", search: "搜索邮箱或用户名", all: "全部", admin: "管理员", user: "普通用户",
    email: "邮箱", username: "用户名", role: "角色", balance: "余额", status: "状态", registered: "注册时间", actions: "操作",
    edit: "编辑", delete: "删除", topup: "充值", enabled: "正常", disabled: "已禁用",
    editUser: "编辑用户", changeRole: "角色", addBalance: "充值金额", deductBalance: "扣费金额",
    save: "保存", cancel: "取消", confirm: "确定", deleteUser: "删除用户",
    deleteConfirm: "确定要删除用户 {email} 吗？此操作不可撤销，将删除该用户的所有数据（API Keys、用量记录、账单记录）。",
    noUsers: "暂无用户", selfDisable: "不能禁用自己", selfDemote: "不能降级自己", selfDelete: "不能删除自己",
    balanceTopup: "用户充值", balanceDeduct: "用户扣费",
  },
  en: {
    title: "User Management", search: "Search email or username", all: "All", admin: "Admin", user: "User",
    email: "Email", username: "Username", role: "Role", balance: "Balance", status: "Status", registered: "Registered", actions: "Actions",
    edit: "Edit", delete: "Delete", topup: "Top Up", enabled: "Active", disabled: "Disabled",
    editUser: "Edit User", changeRole: "Role", addBalance: "Top Up Amount", deductBalance: "Deduct Amount",
    save: "Save", cancel: "Cancel", confirm: "Confirm", deleteUser: "Delete User",
    deleteConfirm: "Are you sure you want to delete {email}? This cannot be undone and will delete all their data (API Keys, usage logs, billing records).",
    noUsers: "No users found", selfDisable: "Cannot disable yourself", selfDemote: "Cannot demote yourself", selfDelete: "Cannot delete yourself",
    balanceTopup: "Top Up Balance", balanceDeduct: "Deduct Balance",
  },
};

export default function UsersPage() {
  const { lang } = useI18n();
  const { user: currentUser } = useAuth();
  const t = LABELS[lang];
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Edit dialog
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editAdd, setEditAdd] = useState("");
  const [editDeduct, setEditDeduct] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Delete dialog
  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    try {
      const res = await fetch(`/api/dashboard/users?${params}`, { credentials: "include" });
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setHasMore(data.has_more || false);
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function openEdit(u: UserItem) {
    setEditUser(u);
    setEditRole(u.role);
    setEditAdd("");
    setEditDeduct("");
  }

  async function handleSave() {
    if (!editUser) return;
    setEditSaving(true);
    const body: Record<string, unknown> = { id: editUser.id };
    if (editRole !== editUser.role) body.role = editRole;
    const addAmt = parseFloat(editAdd);
    const deductAmt = parseFloat(editDeduct);
    if (addAmt > 0) body.addBalance = addAmt;
    if (deductAmt > 0) body.deductBalance = deductAmt;
    await fetch("/api/dashboard/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    setEditSaving(false);
    setEditUser(null);
    fetchUsers();
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setDeleteLoading(true);
    await fetch("/api/dashboard/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: deleteUser.id }),
    });
    setDeleteLoading(false);
    setDeleteUser(null);
    fetchUsers();
  }

  const roleFilters = [
    { key: "all" as const, label: t.all },
    { key: "admin" as const, label: t.admin },
    { key: "user" as const, label: t.user },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6" />{t.title}</h1>
        <Badge variant="secondary">{total}</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-1">
          {roleFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setRoleFilter(f.key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                roleFilter === f.key ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="h-48 animate-pulse bg-muted rounded-lg m-6" />
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">{t.noUsers}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t.email}</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t.username}</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">{t.role}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.balance}</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">{t.status}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.registered}</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/20 hover:bg-muted/30">
                      <td className="py-3 px-4 font-mono text-xs">{u.email}</td>
                      <td className="py-3 px-4">{u.username}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className={u.role === "admin" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}>
                          {u.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">${u.balance.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {u.enabled ? t.enabled : t.disabled}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(u)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={t.edit}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteUser(u)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title={t.delete}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</Button>
          <span className="text-sm text-muted-foreground py-1.5">Page {page}</span>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage(p => p + 1)}>→</Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.editUser}</DialogTitle>
            <DialogDescription>{editUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm text-foreground mb-1.5 block">{t.changeRole}</label>
              <div className="flex gap-2">
                <button onClick={() => setEditRole("user")} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${editRole === "user" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border"}`}>User</button>
                <button onClick={() => setEditRole("admin")} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${editRole === "admin" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" : "bg-secondary text-muted-foreground border-border"}`}>Admin</button>
              </div>
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{t.balanceTopup}</label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={editAdd} onChange={(e) => setEditAdd(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">{t.balanceDeduct}</label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={editDeduct} onChange={(e) => setEditDeduct(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditUser(null)}>{t.cancel}</Button>
              <Button onClick={handleSave} disabled={editSaving}>{editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.save}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.deleteUser}</DialogTitle>
            <DialogDescription>{deleteUser ? t.deleteConfirm.replace("{email}", deleteUser.email) : ""}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteUser(null)}>{t.cancel}</Button>
            <Button onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 text-white hover:bg-red-700">
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
