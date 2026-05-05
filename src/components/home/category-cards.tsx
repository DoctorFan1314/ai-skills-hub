"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { useI18n } from "@/contexts/i18n-context";

const descriptions: Record<string, { zh: string; en: string }> = {
  content: { zh: "30秒生成自然流畅、高转化内容，让你的文字更像真人写作", en: "Generate natural, high-conversion content in 30 seconds" },
  coding: { zh: "让开发效率提升2-5倍，适合开发者、学习者和独立创作者", en: "Boost dev productivity 2-5x for developers and learners" },
  thinking: { zh: "把复杂思考转化为清晰结构化输出，大幅提升职场与学习效率", en: "Turn complex thinking into clear structured output" },
  data: { zh: "SQL优化、数据清洗、可视化推荐，让数据讲故事", en: "SQL optimization, data cleaning, visualization — let data tell stories" },
  productivity: { zh: "会议纪要、任务分解、日程规划，把重复劳动交给AI", en: "Meeting notes, task breakdown, scheduling — delegate repetitive work to AI" },
  creative: { zh: "故事大纲、角色塑造、世界观搭建，释放你的创作灵感", en: "Story outlines, character building, world-building — unleash your creativity" },
};

export function CategoryCards() {
  const { t, lang } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.home.categoryTitle}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{t.home.categorySubtitle}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((card) => (
          <Link key={card.slug} href={`/categories/${card.slug}`}>
            <div className="glass-card glass-card-hover p-5 lg:p-6 h-full cursor-pointer group">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 transition-transform group-hover:scale-110">{card.icon}</div>
              <h3 className="text-base lg:text-lg font-semibold text-foreground mb-1.5 lg:mb-2">{card.name}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-1 line-clamp-1">{card.description}</p>
              <p className="text-xs lg:text-sm text-muted-foreground/70 mb-4 lg:mb-5 line-clamp-2">{descriptions[card.slug]?.[lang] || ""}</p>
              <div className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-colors group-hover:gap-2.5" style={{ color: card.color }}>
                {t.categories.exploreSkill}{card.name.slice(0, 2)}
                <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
