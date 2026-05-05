import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";

const descriptions: Record<string, string> = {
  content: "30秒生成自然流畅、高转化内容，让你的文字更像真人写作",
  coding: "让开发效率提升2-5倍，适合开发者、学习者和独立创作者",
  thinking: "把复杂思考转化为清晰结构化输出，大幅提升职场与学习效率",
  data: "SQL优化、数据清洗、可视化推荐，让数据讲故事",
  productivity: "会议纪要、任务分解、日程规划，把重复劳动交给AI",
  creative: "故事大纲、角色塑造、世界观搭建，释放你的创作灵感",
};

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">选择你的AI技能方向</h2>
        <p className="text-[#8b949e] max-w-xl mx-auto">六大核心领域，覆盖主流AI应用场景</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((card) => (
          <Link key={card.slug} href={`/categories/${card.slug}`}>
            <div className="glass-card glass-card-hover p-5 lg:p-6 h-full cursor-pointer group">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 transition-transform group-hover:scale-110">{card.icon}</div>
              <h3 className="text-base lg:text-lg font-semibold text-white mb-1.5 lg:mb-2">{card.name}</h3>
              <p className="text-xs lg:text-sm text-[#8b949e] mb-1 line-clamp-1">{card.description}</p>
              <p className="text-xs lg:text-sm text-[#8b949e]/70 mb-4 lg:mb-5 line-clamp-2">{descriptions[card.slug] || ""}</p>
              <div className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-colors group-hover:gap-2.5" style={{ color: card.color }}>
                探索{card.name.slice(0, 2)}技能
                <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
