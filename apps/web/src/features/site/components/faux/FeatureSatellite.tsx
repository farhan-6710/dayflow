import { useEffect, useState, type ReactNode } from "react";
import { animate, m } from "framer-motion";
import { BellRing, CheckCircle2, Flag, NotebookPen } from "lucide-react";

import { FauxAvatar, FauxBar, FauxPill } from "@/features/site/components/faux/FauxParts";
import { FAUX_EASE } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";

/** The satellite waits for the chapter's screenshot to rise in first. */
const HOLDS = [650, 1100] as const;
const DONE_THIS_WEEK = 12;

function IconTile({ children }: { children: ReactNode }) {
  return <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-chart-1/12 text-chart-1">{children}</span>;
}

/** Whole numbers counting up to `to` once `run` turns on. */
function CountUp({ to, run }: { to: number; run: boolean }) {
  const [value, setValue] = useState(run ? to : 0);
  useEffect(() => {
    if (!run) return;
    const controls = animate(0, to, { duration: 1.1, ease: FAUX_EASE, onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [run, to]);
  return <span className="tabular-nums">{value}</span>;
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((dot) => (
        <m.span
          key={dot}
          className="size-1.5 rounded-full bg-muted-foreground/60"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
        />
      ))}
    </span>
  );
}

function SatelliteBody({ slug, step }: { slug: string; step: number }) {
  const settled = step >= 2;
  switch (slug) {
    case "insights":
      return (
        <div className="flex items-center gap-3">
          <IconTile><CheckCircle2 className="size-4" /></IconTile>
          <div>
            <div className="font-heading text-2xl leading-none text-foreground"><CountUp to={DONE_THIS_WEEK} run={step >= 1} /></div>
            <div className="mt-1 text-xs text-muted-foreground">Tasks done this week</div>
          </div>
        </div>
      );
    case "clients":
      return (
        <div className="flex items-start gap-2.5">
          <FauxAvatar initials="DK" tone="green" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Daniel · Harbor Labs</div>
            <div className="mt-1 rounded-lg rounded-tl-sm bg-background px-3 py-2 text-[13px] leading-[1.35] text-foreground">
              {settled ? "Can we move the review to Thursday?" : <TypingDots />}
            </div>
          </div>
        </div>
      );
    case "projects":
      return (
        <div className="flex items-start gap-3">
          <IconTile><NotebookPen className="size-4" /></IconTile>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-serif text-[13px] text-foreground">Launch checklist</span>
              <FauxPill className="ml-auto">Planning</FauxPill>
            </div>
            <div className="mt-2 grid gap-1.5">
              <FauxBar width="90%" />
              <FauxBar width="64%" />
            </div>
          </div>
        </div>
      );
    case "calendar":
      return (
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 flex-none rounded-full bg-chart-1" />
          <div className="min-w-0">
            <div className="truncate text-[13px] text-foreground">Wireframe review</div>
            <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">Wed · 2:00 PM</div>
          </div>
          <FauxPill tone="accent" className="ml-auto gap-1"><Flag className="size-3" />High</FauxPill>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-3">
          <IconTile><BellRing className="size-4" /></IconTile>
          <div className="min-w-0">
            <div className="truncate text-[13px] text-foreground">Send weekly report</div>
            <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">5:00 PM · Mon, Wed, Fri</div>
          </div>
        </div>
      );
  }
}

/** How each card enters: the calendar task drops in and settles like a dragged chip, the rest rise. */
function entrance(slug: string, shown: boolean) {
  if (slug === "calendar") return shown ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: -22, rotate: -4 };
  return shown ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 16, rotate: 0 };
}

/**
 * A small faux card straddling the top-right corner of a feature chapter's screenshot: the one thing that
 * part of the workspace does, arriving just after the screenshot.
 */
export function FeatureSatellite({ slug }: { slug: string }) {
  const { ref, step } = useFauxTimeline(HOLDS);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute -top-6 right-3 z-10 w-[min(17rem,calc(100%-1.5rem))] sm:right-6">
      <m.div
        initial={false}
        animate={entrance(slug, step >= 1)}
        transition={{ duration: 0.65, ease: FAUX_EASE }}
        className="rounded-xl border border-border bg-popover p-3.5 shadow-lg"
      >
        <SatelliteBody slug={slug} step={step} />
      </m.div>
    </div>
  );
}
