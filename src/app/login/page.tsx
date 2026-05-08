import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./client";

export const metadata: Metadata = {
  title: "Login — AI Skills Hub",
  description: "Sign in to your AI Skills Hub account and continue exploring high-quality LLM skill templates.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><div className="h-96 w-full max-w-md bg-secondary rounded-xl animate-pulse" /></div>}>
      <LoginClient />
    </Suspense>
  );
}
