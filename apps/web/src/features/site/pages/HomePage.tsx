import { CtaSection } from "@/features/site/components/home/CtaSection";
import { FaqSection } from "@/features/site/components/home/FaqSection";
import { FeaturesSection } from "@/features/site/components/home/FeaturesSection";
import { Hero } from "@/features/site/components/home/Hero";
import { IntroStrip } from "@/features/site/components/home/IntroStrip";
import { Marquee } from "@/features/site/components/home/Marquee";
import { ProcessSection } from "@/features/site/components/home/ProcessSection";
import { SpotlightSection } from "@/features/site/components/home/SpotlightSection";
import { UseCasesSection } from "@/features/site/components/home/UseCasesSection";
import { WhyChooseSection } from "@/features/site/components/home/WhyChooseSection";
import { useSiteTitle } from "@/features/site/hooks/useSiteTitle";

/** Same section order as eatrrite.com's home page, with DayFlow's own hero. */
export function HomePage() {
  useSiteTitle();
  return (
    <>
      <Hero />
      <IntroStrip />
      <SpotlightSection />
      <Marquee />
      <FeaturesSection />
      <WhyChooseSection />
      <ProcessSection />
      <FaqSection />
      <UseCasesSection />
      <CtaSection />
    </>
  );
}
