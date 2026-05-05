"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from "lucide-react";
import { skills } from "@/lib/mock-data";
import { useI18n } from "@/contexts/i18n-context";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{skills.length}+ {t.home.heroBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            <span className="glow-text">{t.home.heroTitle}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            {t.home.heroSubtitle}
            <br />
            <span className="text-foreground/80">{t.home.heroTrust}</span>
          </p>
          <p className="text-sm text-muted-foreground/60 mb-10">
            {t.home.heroPlatforms}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/prompts">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 h-12 text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                {t.home.heroCta}
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary px-8 h-12 text-base">
                <BookOpen className="h-4 w-4 mr-2" />
                {t.home.heroCtaGuide}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
