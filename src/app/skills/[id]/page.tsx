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
  };
}

export default async function AgentSkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getAgentSkillById(id);
  if (!skill) notFound();
  return <AgentSkillDetailClient id={id} />;
}
