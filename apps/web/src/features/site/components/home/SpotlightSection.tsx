import { SITE_FEATURES_PATH } from "@/app/constants/siteRoutes";
import { BrandSeal } from "@/features/site/components/home/BrandSeal";
import { SpotlightBadge } from "@/features/site/components/home/SpotlightBadge";
import { SpotlightStats } from "@/features/site/components/home/SpotlightStats";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { AccentText } from "@/features/site/components/section/AccentText";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { SPOTLIGHT, TAGLINE } from "@/features/site/constants/homeContent";
import { DayflowImage } from "@/shared/components/DayflowImage";

/** Eatrrite's founder spotlight layout (3fr story, 2fr quote and facts), telling why DayFlow exists. */
export function SpotlightSection() {
  return (
    <PageSection tone="card" icons={FLOATING_ICONS.spotlight}>
      <div className="grid items-start gap-12 lg:grid-cols-[3fr_2fr] lg:gap-14">
        <div className="min-w-0">
          <SectionIntro eyebrow={SPOTLIGHT.pill} title={SPOTLIGHT.title} accent={SPOTLIGHT.accent} lead={SPOTLIGHT.lead} />
          <BlurIn delay={0.2}>
            <p className="mt-3 mb-0 max-w-xl text-muted-foreground">{SPOTLIGHT.text}</p>
          </BlurIn>
          <BlurIn delay={0.25} className="relative mt-8 mb-6 max-w-md">
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-border bg-background p-6">
              <DayflowImage name="illo-auth-workspace" className="h-full w-auto" />
            </div>
            <BrandSeal className="absolute -top-5 -right-5 hidden size-24 sm:inline-flex" />
            <SpotlightBadge className="absolute -bottom-5 left-3 sm:left-4" />
          </BlurIn>
        </div>
        <div className="min-w-0">
          <BlurIn delay={0.12}>
            <div className="rounded-lg border border-foreground/15 bg-background p-5 sm:p-6">
              <p className="m-0 font-serif text-2xl text-foreground italic sm:text-3xl">
                “{TAGLINE.lead} <AccentText>{TAGLINE.accent}</AccentText>”
              </p>
              <p className="mt-3 mb-0 text-sm text-muted-foreground">{SPOTLIGHT.citation}</p>
            </div>
          </BlurIn>
          <BlurIn delay={0.18}>
            <SpotlightStats />
          </BlurIn>
          <BlurIn delay={0.24} className="mt-8">
            <SiteLinkButton to={SITE_FEATURES_PATH} size="xl">{SPOTLIGHT.cta}</SiteLinkButton>
          </BlurIn>
        </div>
      </div>
    </PageSection>
  );
}
