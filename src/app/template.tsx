"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    // Don't scroll to top if there's a hash (anchor link)
    if (typeof window !== "undefined" && window.location.hash) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return <div className="animate-page-fade-in">{children}</div>;
}
