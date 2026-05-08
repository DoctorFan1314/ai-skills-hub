"use client";

import { Badge } from "@/components/ui/badge";

interface VersionEntry {
  version: string;
  date: string;
  changelog: string;
  author: string;
}

interface VersionTimelineProps {
  versions: VersionEntry[];
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="glass-card p-6">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-6">
          {versions.map((v, i) => (
            <div key={`${v.version}-${i}`} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className={`relative z-10 mt-1 h-[22px] w-[22px] rounded-full border-2 shrink-0 ${
                i === 0
                  ? "bg-primary border-primary"
                  : "bg-background border-border"
              }`}>
                {i === 0 && (
                  <div className="absolute inset-1 rounded-full bg-primary-foreground" />
                )}
              </div>

              {/* Version content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                    v{v.version}
                  </span>
                  {i === 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                      Latest
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{v.date}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.changelog}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">by {v.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
