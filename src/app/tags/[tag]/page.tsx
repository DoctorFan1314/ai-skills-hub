import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkillsByTag, getAllTags } from "@/lib/tag-utils";
import TagDetailClient from "./client";
import { getSiteUrl } from "@/lib/site-url";

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const siteUrl = getSiteUrl();
  return {
    title: `#${decoded} — AI Skills Hub`,
    description: `Browse all Agent Skills and Prompt Templates related to "${decoded}"`,
    openGraph: {
      title: `#${decoded} — AI Skills Hub`,
      description: `Browse all Agent Skills and Prompt Templates related to "${decoded}"`,
      url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
      type: "website",
    },
    twitter: { card: "summary", title: `#${decoded} — AI Skills Hub`, description: `Browse all Agent Skills and Prompt Templates related to "${decoded}"` },
    alternates: { canonical: `${siteUrl}/tags/${encodeURIComponent(tag)}` },
  };
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const { prompts, agents } = getSkillsByTag(decoded);
  if (prompts.length === 0 && agents.length === 0) notFound();

  return <TagDetailClient tag={decoded} prompts={prompts} agents={agents} />;
}
