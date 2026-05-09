import type { Metadata } from "next";
import { Suspense } from "react";
import TrendingClient from "./client";
import { JsonLd } from "@/components/shared/json-ld";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Trending — AI Skills Hub",
  description: "Discover the hottest, newest, and editor-picked AI skill templates in the community",
};

export default function TrendingPage() {
  const siteUrl = getSiteUrl();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending Skills",
    description: "The hottest, newest, and editor-picked AI skill templates",
    url: `${siteUrl}/trending`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trending Skills", url: `${siteUrl}/trending` },
    ],
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 animate-pulse"><div className="h-10 w-48 bg-secondary rounded mb-4" /><div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-secondary rounded-lg" />)}</div></div>}>
        <TrendingClient />
      </Suspense>
    </>
  );
}
