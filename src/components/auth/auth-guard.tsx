"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !user) {
      router.push("/login");
    }
  }, [loaded, user, router]);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-secondary rounded-xl" />
          <div className="h-8 w-48 bg-secondary rounded" />
          <div className="h-64 bg-secondary rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
