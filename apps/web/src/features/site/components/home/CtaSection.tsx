import { ArrowRight } from "lucide-react";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { GridBackground } from "@/features/site/components/section/GridBackground";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { CTA } from "@/features/site/constants/homeContent";

/** Start your journey: closing call to action in a framed panel that echoes the hero (shine and grid). */
export function CtaSection({ tone = "card" }: { tone?: "card" | "paper" }) {
  return (
    <PageSection tone={tone} icons={FLOATING_ICONS.cta} defer>
      <div className="relative isolate flex flex-col items-center gap-8 overflow-hidden rounded-xl border border-foreground/15 bg-background px-6 py-12 text-center sm:px-12">
        <div aria-hidden="true" className="hero-shine pointer-events-none absolute inset-0 -z-10" />
        <GridBackground cellSize={48} focus="center" className="-z-10" />
        <SectionIntro eyebrow={CTA.pill} title={CTA.title} accent={CTA.accent} lead={CTA.text} center />
        <BlurIn delay={0.2}>
          <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} size="xl" className="group">
            Open Workspace
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </SiteLinkButton>
        </BlurIn>
      </div>
    </PageSection>
  );
}
