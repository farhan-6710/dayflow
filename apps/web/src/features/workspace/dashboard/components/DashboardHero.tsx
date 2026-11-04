import type { DashboardHeroProps } from "@/features/workspace/dashboard/types/components";
import { ResponsiveGreeting } from "@/shared/components/ResponsiveGreeting";
import { Reveal } from "@/shared/components/Reveal";

export function DashboardHero({ name, today, filters }: DashboardHeroProps) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <Reveal kind="hero">
          <h1 className="text-3xl leading-tight text-balance sm:text-4xl">
            <ResponsiveGreeting name={<span className="text-chart-1">{name}</span>} />
          </h1>
        </Reveal>
        <Reveal kind="hero" className="text-muted-foreground">
          {today}
        </Reveal>
      </div>
      <div className="min-w-0 shrink-0">{filters}</div>
    </div>
  );
}
