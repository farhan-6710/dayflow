import type { ActivitySnapshotCardProps } from "@/features/workspace/dashboard/types/components";
import { Skeleton } from "@/shared/ui/skeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ActivitySnapshotCard({ counts, error }: ActivitySnapshotCardProps) {
  const rows = [
    { label: "Open client tasks", value: counts?.tasks },
    { label: "Open meetings", value: counts?.meetings },
    { label: "Open calls", value: counts?.calls },
  ];

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Activity snapshot</h2>
      {error ? (
        <p className="mt-3 text-sm text-muted-foreground">Couldn't load client activity right now.</p>
      ) : (
        <dl className="mt-3 divide-y divide-border text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 py-2">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="tabular-nums">{row.value ?? <Skeleton className="h-4 w-6" />}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
