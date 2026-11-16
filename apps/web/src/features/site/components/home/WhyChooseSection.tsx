import { WhyBento } from "@/features/site/components/home/WhyBento";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { WHY } from "@/features/site/constants/homeContent";

/** Why DayFlow: the heading over a bento of faux product pictures, one tile per reason. */
export function WhyChooseSection() {
  return (
    <PageSection id="why-dayflow" tone="card" icons={FLOATING_ICONS.why} defer>
      <SectionIntro eyebrow={WHY.pill} title={WHY.title} accent={WHY.accent} />
      <WhyBento />
    </PageSection>
  );
}
