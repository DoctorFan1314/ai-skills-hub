import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordClient from "./client";

export const metadata: Metadata = {
  title: "Reset Password — OortAPI",
  description: "Set a new password for your OortAPI account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><div className="h-96 w-full max-w-md bg-secondary rounded-xl animate-pulse" /></div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
