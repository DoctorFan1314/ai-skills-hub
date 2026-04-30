import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryCards } from "@/components/home/category-cards";
import { SkillSection } from "@/components/home/skill-section";
import { Testimonials } from "@/components/home/testimonials";
import { getTrendingSkills, getBeginnerSkills, getNewestSkills } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryCards />
      <SkillSection title="🔥 正在爆火的技能" subtitle="社区用户最爱用的高人气模板" skills={getTrendingSkills()} />
      <div className="border-t border-white/[0.04]" />
      <SkillSection title="🆕 最新上线模板" subtitle="刚刚发布的全新技能模板" skills={getNewestSkills()} />
      <div className="border-t border-white/[0.04]" />
      <SkillSection title="🌱 适合AI新手的起步技能" subtitle="零基础也能轻松上手的入门模板" skills={getBeginnerSkills()} />
      <Testimonials />
    </>
  );
}
