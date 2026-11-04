import { CalendarClock, FolderKanban, Hourglass } from "lucide-react";

import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { Phantom } from "@/shared/components/Phantom";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

type AccountStatsProps = {
  pendingTasks: number;
  projects: number;
  reminders: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function AccountStats({
  pendingTasks,
  projects,
  reminders,
  loading,
  error,
  onRetry,
}: AccountStatsProps) {
  const items = [
    { id: "pending", label: "Pending tasks", value: pendingTasks, hint: "Still open", icon: Hourglass },
    { id: "projects", label: "Projects", value: projects, hint: "In your workspace", icon: FolderKanban },
    { id: "reminders", label: "Reminders", value: reminders, hint: "Recurring nudges", icon: CalendarClock },
  ];

  const grid = (
    <div className="grid min-w-0 gap-3 sm:grid-cols-3">
      {items.map(({ id, label, value, hint, icon: Icon }) => (
        <Reveal key={id} className={cn(panelClassName, "p-4")}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <span data-shimmer-no-children className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-2 flex min-w-0 items-baseline gap-2">
            <p className="min-w-10 shrink-0 text-2xl tabular-nums">{value}</p>
            <p className="min-w-0 text-xs leading-snug text-muted-foreground">{hint}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );

  return (
    <div className="grid min-w-0 gap-3">
      {error ? <ErrorBanner message={error} onRetry={onRetry} /> : null}
      {loading ? <Phantom>{grid}</Phantom> : grid}
    </div>
  );
}
