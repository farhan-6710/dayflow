import { UseCasesCarousel } from "@/features/site/components/home/UseCasesCarousel";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { USE_CASE_ITEMS, USE_CASES } from "@/features/site/constants/homeContent";

/** Eatrrite's testimonials layout, showing how different freelancers use DayFlow. */
export function UseCasesSection() {
  return (
    <PageSection id="use-cases" tone="paper" icons={FLOATING_ICONS.useCases} defer>
      <SectionIntro eyebrow={USE_CASES.pill} title={USE_CASES.title} accent={USE_CASES.accent} lead={USE_CASES.lead} count={USE_CASE_ITEMS.length} />
      <BlurIn delay={0.12} className="mt-4">
        <UseCasesCarousel />
      </BlurIn>
    </PageSection>
  );
}
