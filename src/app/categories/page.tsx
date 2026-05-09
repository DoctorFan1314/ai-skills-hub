import type { Metadata } from "next";
import { Suspense } from "react";
import CategoriesClient from "./client";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Categories — AI Skills Hub",
  description: "Browse AI templates and skills by category. Find the best tools for content, coding, data, and more.",
  openGraph: {
    title: "Categories — AI Skills Hub",
    description: "Browse AI templates and skills by category.",
    url: `${siteUrl}/categories`,
    type: "website",
  },
  twitter: { card: "summary", title: "Categories — AI Skills Hub" },
  alternates: { canonical: `${siteUrl}/categories` },
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 animate-pulse"><div className="h-10 w-48 bg-secondary rounded mb-4" /><div className="space-y-12">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-secondary rounded-lg" />)}</div></div>}>
      <CategoriesClient />
    </Suspense>
  );
}
