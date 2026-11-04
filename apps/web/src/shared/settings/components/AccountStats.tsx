import { CalendarClock, FolderKanban, Hourglass } from "lucide-react";

import { ErrorBanner } from "@/shared/components/ErrorBanner";
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

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-3">
      {error ? (
        <div className="sm:col-span-3">
          <ErrorBanner message={error} onRetry={onRetry} />
        </div>
      ) : null}
      {items.map(({ id, label, value, hint, icon: Icon }) => (
        <Reveal key={id} className={cn(panelClassName, "p-4")}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl tabular-nums">{loading ? "—" : value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </Reveal>
      ))}
    </div>
  );
}
