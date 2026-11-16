import { m } from "framer-motion";
import { FolderKanban } from "lucide-react";

import { Arrive, FauxBar, FauxCheck, FauxPill, RollText } from "@/features/site/components/faux/FauxParts";
import { FAUX_EASE } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";
import { cn } from "@/shared/lib/utils";

/** Beats: settle, tick a task (progress follows), a note lands beside the work, hold. */
const HOLDS = [1000, 1400] as const;
const STEP_CHECKED = 1;
const STEP_NOTE = 2;

const SIDEBAR_FILLER = ["62%", "48%", "70%", "54%"];

function TaskRow({ title, done, due }: { title: string; done: boolean; due?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
      <FauxCheck done={done} />
      <span className={cn("truncate text-[13px] transition-colors duration-300", done ? "text-muted-foreground line-through" : "text-foreground")}>
        {title}
      </span>
      {due ? <FauxPill className="ml-auto">{due}</FauxPill> : null}
    </div>
  );
}

function NoteCard({ title, lines }: { title?: string; lines: string[] }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2.5">
      {title ? <div className="truncate font-serif text-xs text-foreground">{title}</div> : <FauxBar width="58%" className="h-2 bg-muted-foreground/30" />}
      <div className="mt-2 grid gap-1.5">
        {lines.map((width) => (
          <FauxBar key={width} width={width} />
        ))}
      </div>
    </div>
  );
}

/**
 * Bento hero: a cropped workspace window on one client project. A task ticks off, the progress bar
 * follows, and a feedback note lands in the notes column beside the tasks.
 */
export function WorkspaceTile() {
  const { ref, step } = useFauxTimeline(HOLDS);
  const checked = step >= STEP_CHECKED;
  const doneCount = checked ? 2 : 1;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 pt-1 pl-6">
      <div className="flex h-[calc(100%+1px)] flex-col overflow-hidden rounded-tl-xl border-t border-l border-border bg-card shadow-lg">
        <div className="flex flex-none items-center gap-1.5 border-b border-border px-3.5 py-2.5">
          <span className="size-2 rounded-full bg-muted-foreground/35" />
          <span className="size-2 rounded-full bg-muted-foreground/35" />
          <span className="size-2 rounded-full bg-muted-foreground/35" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
          <div className="hidden content-start gap-3.5 border-r border-border px-3.5 py-4 sm:grid">
            <span className="flex items-center gap-2 rounded-md bg-background px-2 py-1.5 text-xs text-foreground shadow-xs">
              <FolderKanban className="size-3.5 flex-none text-chart-1" aria-hidden="true" />
              Projects
            </span>
            {SIDEBAR_FILLER.map((width) => (
              <FauxBar key={width} width={width} className="ml-2" />
            ))}
          </div>
          <div className="min-w-0 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading text-base text-foreground">Brand refresh</span>
              <FauxPill>Northwind Studio</FauxPill>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted/70">
                <m.div
                  className="h-full rounded-full bg-chart-1"
                  initial={false}
                  animate={{ width: `${(doneCount / 3) * 100}%` }}
                  transition={{ duration: 0.7, ease: FAUX_EASE, delay: 0.15 }}
                />
              </div>
              <RollText value={`${doneCount} of 3 tasks`} className="text-xs text-muted-foreground" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_11rem]">
              <div className="-mx-2.5 grid content-start">
                <TaskRow title="Homepage moodboard" done />
                <TaskRow title="Typography pass" done={checked} />
                <TaskRow title="Send invoice" done={false} due="Fri" />
                {["46%", "58%"].map((width) => (
                  <div key={width} className="flex items-center gap-2.5 px-2.5 py-2.5">
                    <span className="size-4 flex-none rounded-full border border-muted-foreground/25" />
                    <FauxBar width={width} />
                  </div>
                ))}
              </div>
              <div className="hidden content-start gap-2 md:grid">
                <div className="text-[11px] tracking-wide text-muted-foreground uppercase">Notes</div>
                <Arrive show={step >= STEP_NOTE}>
                  <NoteCard title="Feedback round 2" lines={["92%", "68%"]} />
                </Arrive>
                <NoteCard lines={["84%", "60%"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
