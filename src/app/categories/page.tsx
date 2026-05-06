import Link from "next/link";
import { categories } from "@/lib/categories";
import { getSkillsByCategory } from "@/lib/mock-data";
import { agentSkills } from "@/lib/mock-agent-skills";
import { SkillCard } from "@/components/skill/skill-card";
import { AgentSkillCard } from "@/components/agent-skill/agent-skill-card";
import { ArrowRight } from "lucide-react";

const categoryToAgentCategory: Record<string, string[]> = {
  content: ["通讯协作", "文件处理"],
  coding: ["Web 开发", "代码执行"],
  thinking: ["Skills 管理"],
  data: ["数据分析"],
  productivity: ["Web 搜索", "多平台交互"],
  creative: ["文件处理"],
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
        <p className="text-muted-foreground">Explore Agent Skills and Prompt Templates by domain</p>
      </div>
      <div className="space-y-12">
        {categories.map((cat) => {
          const catSkills = getSkillsByCategory(cat.slug);
          const agentCats = categoryToAgentCategory[cat.slug] || [];
          const catAgentSkills = agentSkills.filter((s) => agentCats.includes(s.category));
          const total = catSkills.length + catAgentSkills.length;
          return (
            <section key={cat.slug}>
              <Link href={`/categories/${cat.slug}`} className="group flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {cat.name}
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
              </Link>
              {catAgentSkills.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                  {catAgentSkills.slice(0, 2).map((skill) => (
                    <AgentSkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catSkills.slice(0, catAgentSkills.length > 0 ? 2 : 4).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
              {total > 4 && (
                <Link href={`/categories/${cat.slug}`} className="inline-flex items-center gap-1.5 text-sm text-primary mt-4 hover:underline">
                  View all {total} items <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
