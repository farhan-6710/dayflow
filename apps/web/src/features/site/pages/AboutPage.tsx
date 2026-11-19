import { PageBanner } from "@/features/site/components/layout/PageBanner";
import { CtaSection } from "@/features/site/components/home/CtaSection";
import { Marquee } from "@/features/site/components/home/Marquee";
import { SpotlightSection } from "@/features/site/components/home/SpotlightSection";
import { UseCasesSection } from "@/features/site/components/home/UseCasesSection";
import { WhyChooseSection } from "@/features/site/components/home/WhyChooseSection";
import { useSiteTitle } from "@/features/site/hooks/useSiteTitle";
import { BRAND_NAME } from "@/shared/brand/brandManifest";

export function AboutPage() {
  useSiteTitle("About");
  return (
    <>
      <PageBanner title={`About ${BRAND_NAME}`} crumb="About" />
      <SpotlightSection />
      <Marquee />
      <WhyChooseSection />
      <UseCasesSection />
      <CtaSection />
    </>
  );
}
