import { Suspense } from "react";
import type { Metadata } from "next";
import PromptsClient from "./client";

export const metadata: Metadata = {
  title: "Prompt 模板市场 — AI Skills Hub",
  description: "探索高质量 LLM Prompt 模板，覆盖内容创作、编程开发、职场工作等核心场景",
};

export default function PromptsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8"><div className="h-8 w-40 bg-white/5 rounded animate-pulse mb-8" /></div>}>
      <PromptsClient />
    </Suspense>
  );
}
