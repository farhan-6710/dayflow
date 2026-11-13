import { PortalTabs } from "@/features/site/components/home/PortalTabs";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";

/** Two portals, centred heading over the tabs (eatrrite's programs section). */
export function PortalsSection({ tone = "card" }: { tone?: "card" | "paper" }) {
  return (
    <PageSection id="portals" tone={tone} icons={FLOATING_ICONS.portals}>
      <SectionIntro
        eyebrow="Two portals"
        title="One for you, one for every client"
        accent="every client"
        lead="Run the work from your workspace while each client follows along in a portal of their own."
        center
      />
      <PortalTabs />
    </PageSection>
  );
}
