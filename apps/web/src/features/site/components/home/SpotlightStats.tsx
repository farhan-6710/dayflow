import { SPOTLIGHT_STATS } from "@/features/site/constants/homeContent";

/** Timeline of facts with numbered rows (eatrrite's founder stats). */
export function SpotlightStats() {
  return (
    <ol className="mt-8 mb-0 grid list-none gap-1 border-l border-border pl-5">
      {SPOTLIGHT_STATS.map((stat, index) => (
        <li key={stat.value} className="group relative">
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[1.53rem] size-2.5 -translate-y-1/2 rounded-full border-2 border-card bg-chart-1 transition-all duration-300 group-hover:scale-125"
          />
          <div className="flex items-baseline justify-between gap-4 rounded-md px-3 py-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-background">
            <div>
              <p className="m-0 font-heading text-2xl text-foreground sm:text-3xl">{stat.value}</p>
              <p className="m-0 mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
            </div>
            <span className="text-xs text-muted-foreground/70 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
