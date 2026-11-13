import { CalendarDays, Check, MessagesSquare } from "lucide-react";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { HERO } from "@/features/site/constants/homeContent";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/shared/brand/brandManifest";
import { DayflowImage } from "@/shared/components/DayflowImage";
import { cn } from "@/shared/lib/utils";

function HeroChip({ icon: Icon, label, className }: { icon: typeof Check; label: string; className: string }) {
  return (
    <div className={cn("absolute flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-md", className)}>
      <span className="flex size-7 items-center justify-center rounded-full bg-chart-1/15">
        <Icon className="size-4 text-chart-1" aria-hidden="true" />
      </span>
      {label}
    </div>
  );
}

/** DayFlow's own hero: tagline, description, both portals, and the workspace illustration. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card py-16 lg:py-24">
      <div aria-hidden="true" className="absolute top-1/2 -right-32 size-[28rem] -translate-y-1/2 rounded-full bg-background blur-3xl" />
      <div className="site-container relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <BlurIn immediate>
            <p className="m-0 font-serif text-lg text-muted-foreground italic">{HERO.eyebrow}</p>
          </BlurIn>
          <BlurIn immediate delay={0.1}>
            <h1 className="mt-3 mb-0 font-heading text-[clamp(40px,6vw,68px)] leading-[1.08] tracking-tight text-balance">
              {BRAND_TAGLINE}
            </h1>
            <span aria-hidden="true" className="mt-5 block h-[3px] w-14 rounded-full bg-chart-1" />
          </BlurIn>
          <BlurIn immediate delay={0.2}>
            <p className="mt-5 mb-0 max-w-xl text-lg text-muted-foreground text-pretty">{BRAND_DESCRIPTION}</p>
          </BlurIn>
          <BlurIn immediate delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} size="xl">Open Workspace</SiteLinkButton>
            <SiteLinkButton to={CLIENT_PORTAL_DASHBOARD_PATH} variant="outline" size="xl">Client Portal</SiteLinkButton>
          </BlurIn>
          <BlurIn immediate delay={0.4}>
            <ul className="mt-8 mb-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-muted-foreground">
              {HERO.points.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check className="size-4 text-chart-1" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </BlurIn>
        </div>
        <BlurIn immediate delay={0.2} y={40} duration={0.95} className="relative mx-auto w-full max-w-lg">
          <div className="relative rounded-xl border border-border bg-background p-6 shadow-lg sm:p-10">
            <DayflowImage name="illo-dashboard-hero" className="mx-auto h-auto w-full max-w-sm" />
          </div>
          <HeroChip icon={CalendarDays} label="Tasks calendar" className="-top-4 -left-3 sm:-left-6" />
          <HeroChip icon={MessagesSquare} label="Client portal" className="-right-3 -bottom-4 sm:-right-6" />
        </BlurIn>
      </div>
    </section>
  );
}
