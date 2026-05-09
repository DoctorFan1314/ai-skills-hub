import type { Metadata } from "next";
import { Suspense } from "react";
import TagsClient from "./client";

export const metadata: Metadata = {
  title: "Tag Cloud — AI Skills Hub",
  description: "Browse all AI skill templates by tags",
};

export default function TagsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 animate-pulse"><div className="h-10 w-48 bg-secondary rounded mb-4" /><div className="h-64 bg-secondary rounded-lg" /></div>}>
      <TagsClient />
    </Suspense>
  );
}
