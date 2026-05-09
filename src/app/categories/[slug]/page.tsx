import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import CategoryDetailClient from "./client";
import { JsonLd, generateBreadcrumbJsonLd } from "@/components/shared/json-ld";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found — AI Skills Hub" };
  const siteUrl = getSiteUrl();
  return {
    title: `${category.name} — AI Skills Hub`,
    description: category.description,
    openGraph: {
      title: `${category.name} — AI Skills Hub`,
      description: category.description,
      url: `${siteUrl}/categories/${slug}`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${category.name} — AI Skills Hub` },
    alternates: { canonical: `${siteUrl}/categories/${slug}` },
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const siteUrl = getSiteUrl();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Categories", url: `${siteUrl}/categories` },
    { name: category.name },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <CategoryDetailClient slug={slug} />
    </>
  );
}
