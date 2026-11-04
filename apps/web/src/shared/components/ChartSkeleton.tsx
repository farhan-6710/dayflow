import { Phantom } from "@/shared/components/Phantom";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { ChartSkeletonProps } from "@/shared/types/components";

/** A chart panel while its data loads. The empty box measures as one block the chart's size. */
export function ChartSkeleton({ title, chartClassName }: ChartSkeletonProps) {
  return (
    <Phantom>
      <section className={cn(panelClassName, "min-w-0 p-5")}>
        <h2 className="text-xl">{title}</h2>
        <div className={cn("mt-3 rounded-lg", chartClassName)} />
      </section>
    </Phantom>
  );
}
