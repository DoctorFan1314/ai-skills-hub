import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import CategoryDetailClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "分类未找到 — AI Skills Hub" };
  return {
    title: `${category.name} — AI Skills Hub`,
    description: category.description,
    openGraph: { title: `${category.name} — AI Skills Hub`, description: category.description },
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryDetailClient slug={slug} />;
}
