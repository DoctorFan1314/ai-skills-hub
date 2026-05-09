import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkillById } from "@/lib/mock-data";
import SkillDetailClient from "./client";
import { JsonLd, generatePromptJsonLd, generateBreadcrumbJsonLd } from "@/components/shared/json-ld";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) return { title: "Prompt Not Found — AI Skills Hub" };
  const siteUrl = getSiteUrl();
  return {
    title: `${skill.title} — AI Skills Hub`,
    description: skill.subtitle,
    openGraph: {
      title: `${skill.title} — AI Skills Hub`,
      description: skill.subtitle,
      url: `${siteUrl}/prompts/${id}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${skill.title} — AI Skills Hub` },
    alternates: { canonical: `${siteUrl}/prompts/${id}` },
  };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) notFound();

  const siteUrl = getSiteUrl();

  const promptJsonLd = generatePromptJsonLd({
    id: skill.id,
    title: skill.title,
    subtitle: skill.subtitle,
    category: skill.category,
    rating: skill.rating,
    usageCount: skill.usageCount,
    difficulty: skill.difficulty,
    tags: skill.tags,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Prompts", url: `${siteUrl}/prompts` },
    { name: skill.title },
  ]);

  return (
    <>
      <JsonLd data={promptJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SkillDetailClient id={id} />
    </>
  );
}
