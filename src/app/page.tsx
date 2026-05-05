"use client";

import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryCards } from "@/components/home/category-cards";
import { SkillSection } from "@/components/home/skill-section";
import { AgentSkillSection } from "@/components/home/agent-skill-section";
import { Testimonials } from "@/components/home/testimonials";
import { getTrendingSkills, getBeginnerSkills } from "@/lib/mock-data";
import { agentSkills } from "@/lib/mock-agent-skills";
import { useI18n } from "@/contexts/i18n-context";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <Hero />
      <TrustBar />
      <AgentSkillSection title={t.agentSkills.sectionHot} subtitle={t.agentSkills.sectionHotSub} skills={agentSkills.filter((s) => s.trending)} />
      <div className="border-t border-white/[0.04]" />
      <CategoryCards />
      <div className="border-t border-white/[0.04]" />
      <SkillSection title={t.home.sectionNew} subtitle={t.home.sectionNewSub} skills={getTrendingSkills().slice(0, 4)} viewAllHref="/prompts" />
      <div className="border-t border-white/[0.04]" />
      <SkillSection title={t.home.sectionBeginner} subtitle={t.home.sectionBeginnerSub} skills={getBeginnerSkills().slice(0, 4)} viewAllHref="/prompts" />
      <Testimonials />
    </>
  );
}
