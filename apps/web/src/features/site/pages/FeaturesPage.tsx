import { PageBanner } from "@/features/site/components/layout/PageBanner";
import { CtaSection } from "@/features/site/components/home/CtaSection";
import { FeaturesSection } from "@/features/site/components/home/FeaturesSection";
import { PortalsSection } from "@/features/site/components/home/PortalsSection";
import { WhyChooseSection } from "@/features/site/components/home/WhyChooseSection";
import { useSiteTitle } from "@/features/site/hooks/useSiteTitle";

export function FeaturesPage() {
  useSiteTitle("Features");
  return (
    <>
      <PageBanner title="Features" />
      <FeaturesSection showCta={false} />
      <WhyChooseSection />
      <PortalsSection tone="paper" />
      <CtaSection />
    </>
  );
}
