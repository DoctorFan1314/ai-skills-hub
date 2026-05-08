import { Suspense } from "react";
import type { Metadata } from "next";
import PromptsClient from "./client";

export const metadata: Metadata = {
  title: "Prompt Templates Marketplace — AI Skills Hub",
  description: "Explore high-quality LLM Prompt templates covering content creation, coding, productivity, and more",
};

export default function PromptsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 animate-pulse"><div className="h-8 w-40 bg-secondary rounded mb-4" /><div className="h-4 w-64 bg-secondary rounded mb-8" /><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 bg-secondary rounded-xl" />)}</div></div>}>
      <PromptsClient />
    </Suspense>
  );
}
