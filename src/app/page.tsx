import { HomeContent } from "@/components/home/home-content";
import { LazyParticleBackground } from "@/components/shared/lazy-particle-bg";
import { JsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/components/shared/json-ld";
import { OnboardingTooltip } from "@/components/shared/onboarding-tooltip";

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateOrganizationJsonLd()} />
      <JsonLd data={generateWebSiteJsonLd()} />
      <LazyParticleBackground />
      <OnboardingTooltip />
      <div className="relative z-10">
        <HomeContent />
      </div>
    </>
  );
}
