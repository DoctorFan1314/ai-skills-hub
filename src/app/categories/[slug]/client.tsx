"use client";

import Link from "next/link";
import { categories } from "@/lib/categories";
import { getSkillsByCategory } from "@/lib/mock-data";
import { SkillCard } from "@/components/skill/skill-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function CategoryDetailClient({ slug }: { slug: string }) {
  const category = categories.find((c) => c.slug === slug);
  const catSkills = getSkillsByCategory(slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">分类未找到</p>
        <Link href="/categories" className="text-primary mt-4 inline-block hover:underline">返回分类浏览</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground/60">共 {catSkills.length} 个技能模板</p>
      </div>
      {catSkills.length === 0 ? (
        <div className="text-center py-20"><p className="text-muted-foreground">该分类暂无技能模板</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {catSkills.map((skill) => (<SkillCard key={skill.id} skill={skill} />))}
        </div>
      )}
    </div>
  );
}
