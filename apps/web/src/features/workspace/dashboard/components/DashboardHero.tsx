import type { DashboardHeroProps } from "@/features/workspace/dashboard/types/components";
import { DayflowImage } from "@/shared/components/DayflowImage";

export function DashboardHero({ heading, today }: DashboardHeroProps) {
  return (
    <div className="mb-6 flex min-w-0 items-center justify-between gap-4 lg:mb-8">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="mt-1 text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
      </div>
      <DayflowImage name="illo-dashboard-hero" className="hidden h-24 w-auto shrink-0 sm:block" />
    </div>
  );
}
