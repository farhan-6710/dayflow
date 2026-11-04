import type { DashboardHeroProps } from "@/features/workspace/dashboard/types/components";
import { DayflowImage } from "@/shared/components/DayflowImage";
import { Reveal } from "@/shared/components/Reveal";

export function DashboardHero({ heading, today }: DashboardHeroProps) {
  return (
    <div className="mb-6 flex min-w-0 items-center justify-between gap-4">
      <div className="min-w-0">
        <Reveal kind="hero">
          <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
        </Reveal>
        <Reveal kind="hero" className="mt-2 text-muted-foreground">
          {today}
        </Reveal>
      </div>
      <Reveal kind="hero" className="hidden shrink-0 sm:block">
        <DayflowImage name="illo-dashboard-hero" className="h-20 w-auto" />
      </Reveal>
    </div>
  );
}
