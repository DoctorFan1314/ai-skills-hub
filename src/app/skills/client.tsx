"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { skills } from "@/lib/mock-data";
import { SkillCard } from "@/components/skill/skill-card";
import { categories } from "@/lib/categories";

const difficulties = ["全部", "新手友好", "进阶", "高级"];
const PAGE_SIZE = 12;

export default function SkillsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("cat") || "全部");
  const [difficulty, setDifficulty] = useState(searchParams.get("diff") || "全部");
  const [sortBy, setSortBy] = useState<"trending" | "rating" | "newest">(
    (["trending", "rating", "newest"].includes(searchParams.get("sort") || "")
      ? searchParams.get("sort")
      : "trending") as "trending" | "rating" | "newest",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateURL = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const q = overrides.q ?? query;
      const cat = overrides.cat ?? category;
      const diff = overrides.diff ?? difficulty;
      const sort = overrides.sort ?? sortBy;

      if (q) params.set("q", q);
      if (cat && cat !== "全部") params.set("cat", cat);
      if (diff && diff !== "全部") params.set("diff", diff);
      if (sort && sort !== "trending") params.set("sort", sort);

      const url = params.toString() ? `/skills?${params.toString()}` : "/skills";
      router.replace(url, { scroll: false });
    },
    [query, category, difficulty, sortBy, router],
  );

  const handleQueryChange = useCallback(
    (val: string) => {
      setQuery(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateURL({ q: val }), 300);
    },
    [updateURL],
  );

  useEffect(() => () => clearTimeout(debounceRef.current), []);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [category, difficulty, sortBy]);

  const filtered = (() => {
    let result = [...skills];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (category !== "全部") result = result.filter((s) => s.categorySlug === category);
    if (difficulty !== "全部") result = result.filter((s) => s.difficulty === difficulty);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    else result.sort((a, b) => b.usageCount - a.usageCount);
    return result;
  })();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">技能市场</h1>
        <p className="text-muted-foreground">探索 {skills.length}+ 个精选实测LLM技能模板</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索技能模板..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-4 md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground" id="category-label">分类：</span>
            <button onClick={() => { setCategory("全部"); updateURL({ cat: "全部" }); }} role="radio" aria-checked={category === "全部"} aria-labelledby="category-label" className={`px-3 py-1 text-sm rounded-md transition-colors ${category === "全部" ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              全部
            </button>
            {categories.map((c) => (
              <button key={c.slug} onClick={() => { setCategory(c.slug); updateURL({ cat: c.slug }); }} role="radio" aria-checked={category === c.slug} className={`px-3 py-1 text-sm rounded-md transition-colors ${category === c.slug ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground" id="difficulty-label">难度：</span>
            {difficulties.map((d) => (
              <button key={d} onClick={() => { setDifficulty(d); updateURL({ diff: d }); }} role="radio" aria-checked={difficulty === d} aria-labelledby="difficulty-label" className={`px-3 py-1 text-sm rounded-md transition-colors ${difficulty === d ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <span className="text-sm text-muted-foreground" id="sort-label">排序：</span>
            {([{ key: "trending" as const, label: "最热" }, { key: "rating" as const, label: "评分" }, { key: "newest" as const, label: "最新" }]).map((s) => (
              <button key={s.key} onClick={() => { setSortBy(s.key); updateURL({ sort: s.key }); }} role="radio" aria-checked={sortBy === s.key} aria-labelledby="sort-label" className={`px-3 py-1 text-sm rounded-md transition-colors ${sortBy === s.key ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-2">未找到匹配的技能模板</p>
          <p className="text-muted-foreground/60 text-sm">尝试调整搜索词或筛选条件</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.slice(0, visibleCount).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
          {filtered.length > visibleCount && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-6 py-2.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/30 transition-colors"
              >
                加载更多（还剩 {filtered.length - visibleCount} 个）
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
