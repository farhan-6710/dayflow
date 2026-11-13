import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { HeroBadge, HeroHeadline } from "@/features/site/components/home/HeroHeadline";
import { HeroScreenTabs, HeroScreenWindow } from "@/features/site/components/home/HeroScreens";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { GridBackground } from "@/features/site/components/section/GridBackground";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { SITE_SCREEN_ORDER } from "@/features/site/constants/siteScreens";
import type { SiteScreenId } from "@/features/site/types/components";
import { BRAND_DESCRIPTION } from "@/shared/brand/brandManifest";
import { Tabs } from "@/shared/ui/tabs";

/** Grid lines in the accent, shown only in a soft circle around the pointer (position set on pointer move). */
const ACCENT_LINE = "color-mix(in oklab, var(--chart-1) 45%, transparent)";
const POINTER_MASK = "radial-gradient(220px circle at var(--hero-x, -999px) var(--hero-y, -999px), black, transparent)";

function isScreenId(value: string): value is SiteScreenId {
  return (SITE_SCREEN_ORDER as string[]).includes(value);
}

/**
 * Centered hero: a badge, the tagline with an accent word, both portals, then tabs that switch the
 * workspace window. A warm light falls from the top-left, and the grid lights up around the pointer.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState<SiteScreenId>(SITE_SCREEN_ORDER[0]);

  // Writes CSS variables straight to the section so following the pointer never re-renders React.
  function trackPointer(event: PointerEvent<HTMLElement>) {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
    section.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={trackPointer}
      className="group/hero relative overflow-hidden border-b border-border bg-background pt-14 lg:pt-20"
    >
      <div aria-hidden="true" className="hero-shine pointer-events-none absolute inset-0" />
      <GridBackground />
      <GridBackground
        lineColor={ACCENT_LINE}
        mask={POINTER_MASK}
        className="opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
      />

      <Tabs value={screen} onValueChange={(value) => isScreenId(value) && setScreen(value)} className="relative block">
        <div className="site-container relative flex flex-col items-center text-center">
          <BlurIn immediate>
            <HeroBadge />
          </BlurIn>
          <BlurIn immediate delay={0.05} className="mt-7">
            <HeroHeadline />
          </BlurIn>
          <BlurIn immediate delay={0.15}>
            <p className="mx-auto mt-7 mb-0 max-w-2xl text-lg text-muted-foreground text-pretty">{BRAND_DESCRIPTION}</p>
          </BlurIn>
          <BlurIn immediate delay={0.25} className="mt-9 flex flex-wrap justify-center gap-3">
            <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} size="xl" className="group">
              Open Workspace
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </SiteLinkButton>
            <SiteLinkButton to={CLIENT_PORTAL_DASHBOARD_PATH} variant="outline" size="xl">Client Portal</SiteLinkButton>
          </BlurIn>
          <BlurIn immediate delay={0.35} className="mt-12 flex max-w-full justify-center">
            <HeroScreenTabs active={screen} />
          </BlurIn>
        </div>
        <BlurIn immediate delay={0.45} y={40} duration={0.95} className="site-container relative mt-10">
          <HeroScreenWindow />
        </BlurIn>
      </Tabs>
    </section>
  );
}
