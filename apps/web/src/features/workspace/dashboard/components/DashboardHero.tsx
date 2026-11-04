import type { DashboardHeroProps } from "@/features/workspace/dashboard/types/components";
import { DayflowImage } from "@/shared/components/DayflowImage";

export function DashboardHero({ heading, today }: DashboardHeroProps) {
  return (
    <div className="mb-6 flex min-w-0 items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
        <p className="mt-2 text-muted-foreground">{today}</p>
      </div>
      <DayflowImage name="illo-dashboard-hero" className="hidden h-20 w-auto shrink-0 sm:block" />
    </div>
  );
}
