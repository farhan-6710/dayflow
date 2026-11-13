import { FaqPicker } from "@/features/site/components/home/FaqPicker";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FAQ, FAQ_ITEMS } from "@/features/site/constants/faqContent";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { DayflowImage } from "@/shared/components/DayflowImage";

/** Illustration, heading with count, then the question picker. */
export function FaqSection() {
  return (
    <PageSection id="faqs" tone="card" icons={FLOATING_ICONS.faq} defer>
      <div className="grid items-end gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <BlurIn className="mx-auto w-40 sm:w-48 lg:mx-0">
          <DayflowImage name="icon-empty-search" className="h-auto w-full" />
        </BlurIn>
        <SectionIntro eyebrow={FAQ.pill} title={FAQ.title} accent={FAQ.accent} count={FAQ_ITEMS.length} />
      </div>
      <BlurIn delay={0.12} className="mt-10">
        <FaqPicker items={FAQ_ITEMS} />
      </BlurIn>
    </PageSection>
  );
}
