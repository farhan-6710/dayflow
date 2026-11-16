import type { LucideIcon } from "lucide-react";
import { ListTodo, Phone, Users } from "lucide-react";

import { Arrive, FauxBar, FauxCheck, FauxPill, RollText } from "@/features/site/components/faux/FauxParts";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";
import { cn } from "@/shared/lib/utils";

/** Beats: settle, tick the task, the client's request arrives, hold. */
const HOLDS = [900, 1300, 900] as const;
const STEP_CHECKED = 1;
const STEP_RAISED = 2;

type AgendaRowProps = {
  time: string;
  title: string;
  icon: LucideIcon;
  done?: boolean;
  isTask?: boolean;
  badge?: string;
};

function AgendaRow({ time, title, icon: Icon, done = false, isTask = false, badge }: AgendaRowProps) {
  return (
    <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-3 border-t border-border/70 px-4 py-2.5">
      <span className="text-xs text-muted-foreground tabular-nums">{time}</span>
      <div className="flex min-w-0 items-center gap-2.5">
        {isTask ? <FauxCheck done={done} /> : <Icon className="size-4 flex-none text-muted-foreground" aria-hidden="true" />}
        <span className={cn("truncate text-sm transition-colors duration-300", done ? "text-muted-foreground line-through" : "text-foreground")}>
          {title}
        </span>
        {badge ? <FauxPill tone="accent" className="ml-auto">{badge}</FauxPill> : null}
      </div>
    </div>
  );
}

/**
 * Spotlight's faux "Today" agenda: a meeting, a task and a call. The task ticks off, then a client raises a
 * review call from their portal and it slides into place, carrying the day's count with it.
 */
export function TodayAgenda() {
  const { ref, step } = useFauxTimeline(HOLDS);
  const checked = step >= STEP_CHECKED;
  const raised = step >= STEP_RAISED;
  const progress = `${checked ? 2 : 1} of ${raised ? 4 : 3} done`;

  return (
    <div ref={ref} aria-hidden="true" className="flex size-full flex-col overflow-hidden rounded-lg border border-border bg-background text-left shadow-sm">
      <div className="px-4 pt-4 pb-3">
        <div className="font-heading text-lg leading-tight text-foreground">Today</div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Thursday</span>
          <span className="size-1 rounded-full bg-muted-foreground/40" />
          <RollText value={progress} />
        </div>
      </div>
      <AgendaRow time="9:30 AM" title="Standup with Lumen" icon={Users} done />
      <AgendaRow time="11:00 AM" title="Draft the proposal" icon={ListTodo} isTask done={checked} />
      <AgendaRow time="2:00 PM" title="Call with Priya" icon={Phone} />
      <Arrive show={raised}>
        <AgendaRow time="4:30 PM" title="Review call" icon={Users} badge="Client" />
      </Arrive>
      {/* Filler under the day: the corner badge sits over it, never over a real row. */}
      <div className="grid flex-1 grid-cols-[4.25rem_minmax(0,1fr)] gap-3 border-t border-border/70 px-4 py-3.5">
        <FauxBar width="70%" />
        <FauxBar width="55%" />
      </div>
    </div>
  );
}
