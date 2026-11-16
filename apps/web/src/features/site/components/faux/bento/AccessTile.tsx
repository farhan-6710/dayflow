import type { ReactNode } from "react";
import { m } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

import { FauxBar, FauxPill } from "@/features/site/components/faux/FauxParts";
import { FAUX_EASE } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";
import { cn } from "@/shared/lib/utils";

/** Beats: your projects, then the client's portal resolves to only what is shared with them. */
const HOLDS = [700] as const;
const ROW_STAGGER = 0.12;

const PROJECTS = [
  { name: "Atlas rebrand", owner: "Atlas Coffee", shared: true },
  { name: "Orbit launch", owner: "Orbit", shared: false },
  { name: "Portfolio", owner: "Personal", shared: false },
] as const;

const LOCKED_WIDTHS = ["58%", "44%"];

function Pane({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm", className)}>
      <div className="px-1 pb-2 text-[11px] tracking-wide text-muted-foreground uppercase">{title}</div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

/**
 * Row-level security as a diagram: every project in your workspace on the left, and the same list as the
 * Atlas Coffee portal sees it on the right, where only the shared project shows and the rest stay locked.
 */
export function AccessTile() {
  const { ref, step } = useFauxTimeline(HOLDS);
  const resolved = step >= 1;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 px-6 pt-1">
      <Pane title="Your workspace">
        {PROJECTS.map((project) => (
          <div key={project.name} className="flex items-center gap-2 rounded-md bg-background px-2.5 py-2">
            <span className="truncate text-[13px] text-foreground">{project.name}</span>
            <FauxPill className="ml-auto hidden sm:inline-flex">{project.owner}</FauxPill>
          </div>
        ))}
      </Pane>
      <ArrowRight className="mt-16 size-4 text-muted-foreground" />
      <Pane title="Atlas Coffee portal">
        {PROJECTS.map((project, index) => {
          const delay = index * ROW_STAGGER;
          if (project.shared) {
            return (
              <m.div
                key={project.name}
                initial={false}
                animate={resolved ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: 0.55, ease: FAUX_EASE, delay }}
                className="flex items-center gap-2 rounded-md bg-background px-2.5 py-2"
              >
                <span className="truncate text-[13px] text-foreground">{project.name}</span>
                <FauxPill tone="success" className="ml-auto">Shared</FauxPill>
              </m.div>
            );
          }
          const width = LOCKED_WIDTHS[index % LOCKED_WIDTHS.length];
          return (
            <m.div
              key={project.name}
              initial={false}
              animate={{ opacity: resolved ? 1 : 0 }}
              transition={{ duration: 0.5, delay }}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-[0.6875rem]"
            >
              <Lock className="size-3.5 flex-none text-muted-foreground/70" />
              <FauxBar width={width} />
            </m.div>
          );
        })}
      </Pane>
    </div>
  );
}
