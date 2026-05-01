import type { Metadata } from "next";
import { getSkillById } from "@/lib/mock-data";
import SkillDetailClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) return { title: "技能未找到 — AI Skills Hub" };
  return {
    title: `${skill.title} — AI Skills Hub`,
    description: skill.subtitle,
    openGraph: { title: `${skill.title} — AI Skills Hub`, description: skill.subtitle },
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SkillDetailClient id={id} />;
}
