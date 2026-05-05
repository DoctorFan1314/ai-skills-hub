"use client";

import Link from "next/link";
import { getTagCloud } from "@/lib/tag-utils";

export default function TagsClient() {
  const tags = getTagCloud();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">标签云</h1>
        <p className="text-muted-foreground">按标签快速发现相关技能模板</p>
      </div>
      <div className="glass-card p-8 flex flex-wrap items-center justify-center gap-3">
        {tags.map((t) => (
          <Link
            key={t.tag}
            href={`/tags/${encodeURIComponent(t.tag)}`}
            className="inline-block px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            style={{ fontSize: `${Math.round(0.75 + t.weight * 1.2)}rem` }}
          >
            {t.tag}
            <span className="ml-1 text-xs text-muted-foreground/50">{t.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
