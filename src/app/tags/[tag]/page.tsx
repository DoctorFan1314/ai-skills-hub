import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkillsByTag, getAllTags } from "@/lib/tag-utils";
import TagDetailClient from "./client";

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} — AI Skills Hub`,
    description: `浏览所有与「${decoded}」相关的 Agent 技能和 Prompt 模板`,
  };
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const { prompts, agents } = getSkillsByTag(decoded);
  if (prompts.length === 0 && agents.length === 0) notFound();

  return <TagDetailClient tag={decoded} prompts={prompts} agents={agents} />;
}
