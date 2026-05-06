import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgentSkillById } from "@/lib/mock-agent-skills";
import AgentSkillDetailClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const skill = getAgentSkillById(id);
  if (!skill) return { title: "技能未找到 — AI Skills Hub" };
  return {
    title: `${skill.name} — AI Skills Hub`,
    description: skill.description.split("\n").find(l => l && !l.startsWith("#") && !l.startsWith("-"))?.slice(0, 160) || "",
    openGraph: {
      title: `${skill.name} — AI Skills Hub`,
      description: skill.description.split("\n").find(l => l && !l.startsWith("#") && !l.startsWith("-"))?.slice(0, 300) || "",
      url: `https://ai-skills-hub.vercel.app/skills/${id}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${skill.name} — AI Skills Hub` },
    alternates: { canonical: `https://ai-skills-hub.vercel.app/skills/${id}` },
  };
}

export default async function AgentSkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getAgentSkillById(id);
  if (!skill) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: skill.name,
    headline: skill.title || skill.name,
    description: skill.description.split("\n").find(l => l && !l.startsWith("#") && !l.startsWith("-"))?.slice(0, 300) || "",
    author: { "@type": "Organization", name: skill.author || "AI Skills Hub" },
    datePublished: skill.lastUpdated,
    dateModified: skill.lastUpdated,
    version: skill.version,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentSkillDetailClient id={id} />
    </>
  );
}
