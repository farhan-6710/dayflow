import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { CTA } from "@/features/site/constants/homeContent";

/** Start your journey: closing call to action in a framed panel. */
export function CtaSection({ tone = "card" }: { tone?: "card" | "paper" }) {
  return (
    <PageSection tone={tone} icons={FLOATING_ICONS.cta} defer>
      <div className="flex flex-col items-center gap-8 rounded-xl border border-foreground/15 bg-background px-6 py-12 text-center sm:px-12">
        <SectionIntro eyebrow={CTA.pill} title={CTA.title} lead={CTA.text} center />
        <BlurIn delay={0.2}>
          <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} size="xl">Open Workspace</SiteLinkButton>
        </BlurIn>
      </div>
    </PageSection>
  );
}
