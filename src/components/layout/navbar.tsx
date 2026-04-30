"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/skills", label: "技能市场" },
  { href: "/categories", label: "分类浏览" },
  { href: "/guide", label: "新手指南" },
  { href: "/submit", label: "提交模板" },
];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30">
            <span className="text-sm font-bold text-[#00d4ff]">AI</span>
          </div>
          <span className="text-lg font-semibold text-white hidden sm:inline">AI Skills Hub</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-[#8b949e] hover:text-white transition-colors rounded-md hover:bg-white/5"
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
                className="h-8 w-40 md:w-56 bg-white/5 border-white/10 text-white placeholder:text-[#8b949e] text-sm"
                autoFocus
              />
              <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen(false)} className="text-[#8b949e] hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen(true)} className="text-[#8b949e] hover:text-white">
              <Search className="h-4 w-4" />
            </Button>
          )}

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white">登录</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium">免费开始</Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden text-[#8b949e] hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-[#0a0e1a] border-white/10 w-72">
              <SheetTitle className="text-white sr-only">导航菜单</SheetTitle>
              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="px-4 py-3 text-[#8b949e] hover:text-white transition-colors rounded-md hover:bg-white/5">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 my-4" />
                <Link href="/login" className="px-4 py-3 text-[#8b949e] hover:text-white">登录</Link>
                <Link href="/register" className="px-4 py-3">
                  <Button className="w-full bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-medium">免费开始</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
