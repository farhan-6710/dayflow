import { PageBanner } from "@/features/site/components/layout/PageBanner";
import { CtaSection } from "@/features/site/components/home/CtaSection";
import { FaqSection } from "@/features/site/components/home/FaqSection";
import { PortalsSection } from "@/features/site/components/home/PortalsSection";
import { ProcessSection } from "@/features/site/components/home/ProcessSection";
import { UseCasesSection } from "@/features/site/components/home/UseCasesSection";
import { useSiteTitle } from "@/features/site/hooks/useSiteTitle";

export function HowItWorksPage() {
  useSiteTitle("How it works");
  return (
    <>
      <PageBanner title="How it works" />
      <ProcessSection />
      <PortalsSection />
      <UseCasesSection />
      <FaqSection />
      <CtaSection tone="paper" />
    </>
  );
}
