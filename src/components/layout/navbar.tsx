"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { useTheme } from "@/contexts/theme-context";
import { useI18n } from "@/contexts/i18n-context";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/skills", label: "技能市场" },
  { href: "/categories", label: "分类浏览" },
  { href: "/trending", label: "排行榜" },
  { href: "/tags", label: "标签云" },
  { href: "/guide", label: "新手指南" },
  { href: "/submit", label: "提交模板" },
];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const { user, loaded, logout } = useAuth();
  const { toast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();

  function handleSearch(e?: React.KeyboardEvent<HTMLInputElement>) {
    if (e && e.key !== "Enter") return;
    const q = searchQuery.trim();
    if (q) {
      router.push(`/skills?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function handleLogout() {
    logout();
    toast("已退出登录");
    setSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
            <span className="text-sm font-bold text-primary">AI</span>
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">AI Skills Hub</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                placeholder="搜索技能模板..."
                className="h-8 w-40 md:w-56 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Button variant="ghost" size="icon-sm" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground" aria-label="关闭搜索">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground" aria-label="搜索">
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="切换主题"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
            aria-label="Switch language"
          >
            <Languages className="h-4 w-4" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {!loaded ? null : user ? (
              <Link href="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">登录</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">免费开始</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden text-muted-foreground hover:text-foreground" aria-label="打开导航菜单">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-card border-border w-72">
              <SheetTitle className="text-foreground sr-only">导航菜单</SheetTitle>
              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSheetOpen(false)} className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border my-4" />
                {!loaded ? null : user ? (
                  <>
                    <Link href="/profile" onClick={() => setSheetOpen(false)} className="px-4 py-3 text-muted-foreground hover:text-foreground">
                      个人中心
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-3 text-left text-muted-foreground hover:text-foreground">退出</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setSheetOpen(false)} className="px-4 py-3 text-muted-foreground hover:text-foreground">登录</Link>
                    <Link href="/register" onClick={() => setSheetOpen(false)} className="px-4 py-3">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">免费开始</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
