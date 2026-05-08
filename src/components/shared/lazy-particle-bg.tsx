"use client";

import dynamic from "next/dynamic";

const ParticleBackgroundInner = dynamic(
  () => import("@/components/shared/particle-bg").then(m => ({ default: m.ParticleBackground })),
  { ssr: false }
);

export function LazyParticleBackground() {
  return <ParticleBackgroundInner />;
}
