import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordClient from "./client";

export const metadata: Metadata = {
  title: "Forgot Password — OortAPI",
  description: "Reset your OortAPI account password.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><div className="h-96 w-full max-w-md bg-secondary rounded-xl animate-pulse" /></div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
