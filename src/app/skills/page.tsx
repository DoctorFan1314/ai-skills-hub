import type { Metadata } from "next";
import { Suspense } from "react";
import SkillsClient from "./client";

export const metadata: Metadata = {
  title: "Agent Skills — AI Skills Hub",
  description: "Discover executable AI Agent skills with one-click install. Connect to 13+ platforms.",
};

export default function SkillsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8 animate-pulse"><div className="h-8 w-64 bg-secondary rounded mb-4" /><div className="h-4 w-96 bg-secondary rounded mb-8" /><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 bg-secondary rounded-lg" />)}</div></div>}>
      <SkillsClient />
    </Suspense>
  );
}
