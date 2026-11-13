import { FeaturesScroll } from "@/features/site/components/home/FeaturesScroll";
import { PageSection } from "@/features/site/components/section/PageSection";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";

/** Our Features: sticky editorial rail and scroll-revealed chapters (eatrrite's "Our Programs"). */
export function FeaturesSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <PageSection tone="paper" icons={FLOATING_ICONS.features} className="py-16 lg:py-24">
      <FeaturesScroll showCta={showCta} />
    </PageSection>
  );
}
