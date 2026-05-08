import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterClient from "./client";

export const metadata: Metadata = {
  title: "Register — AI Skills Hub",
  description: "Create an AI Skills Hub account to unlock all high-quality LLM skill templates.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><div className="h-96 w-full max-w-md bg-secondary rounded-xl animate-pulse" /></div>}>
      <RegisterClient />
    </Suspense>
  );
}
