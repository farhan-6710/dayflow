import { Phantom } from "@/shared/components/Phantom";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { SummaryStatsProps } from "@/shared/types/components";

/** The compact stat row at the top of list and detail pages. */
export function SummaryStats({ items, isLoading = false }: SummaryStatsProps) {
  const grid = (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map(({ id, label, value, icon: Icon, trend }) => (
        <Reveal key={id} className={cn(panelClassName, "flex min-w-0 items-center gap-3 p-3 sm:p-4")}>
          <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-muted/60 sm:flex">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl leading-tight tabular-nums">{value}</p>
          </div>
          {trend ? (
            <span className="shrink-0 self-end rounded-full bg-success/15 px-2 py-0.5 text-xs text-success-text">{trend}</span>
          ) : null}
        </Reveal>
      ))}
    </div>
  );

  return isLoading ? <Phantom>{grid}</Phantom> : grid;
}
