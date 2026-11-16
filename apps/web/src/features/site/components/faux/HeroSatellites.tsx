import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BellRing, CheckCircle2, Pause, Phone } from "lucide-react";

import { FAUX_EASE } from "@/features/site/constants/fauxMotion";

/** The satellites arrive after the window has risen in. */
const ENTER_DELAY = 1.1;
const TICK_MS = 1000;
const TIMER_START_SECONDS = 42 * 60 + 10;
const NOTIFY_EVERY_MS = 3400;
const VISIBLE_NOTIFICATIONS = 2;

type Notice = { icon: LucideIcon; title: string; meta: string };

const NOTICES: Notice[] = [
  { icon: BellRing, title: "Send weekly invoice", meta: "Reminder · 10:00 AM" },
  { icon: CheckCircle2, title: "Homepage copy is done", meta: "Task · Brand refresh" },
  { icon: Phone, title: "Atlas Coffee raised a call", meta: "Client portal · Fri" },
];

function formatClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

/** Ticks while on screen and motion is allowed; held still otherwise. */
function useLiveCounter(stepMs: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setCount((value) => value + 1), stepMs);
    return () => window.clearInterval(id);
  }, [active, stepMs]);
  return count;
}

function Satellite({ children, className, delay }: { children: ReactNode; className: string; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: FAUX_EASE, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function TimeTracker({ seconds }: { seconds: number }) {
  return (
    <div className="w-60 rounded-xl border border-border bg-popover p-4 text-left shadow-xl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <m.span
          className="size-2 rounded-full bg-chart-1"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        Tracking · Brand refresh
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="font-heading text-3xl leading-none text-foreground tabular-nums">{formatClock(seconds)}</span>
        <span className="flex size-9 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Pause className="size-4" fill="currentColor" />
        </span>
      </div>
    </div>
  );
}

function NotificationRow({ notice }: { notice: Notice }) {
  const Icon = notice.icon;
  return (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ height: { duration: 0.5, ease: FAUX_EASE }, opacity: { duration: 0.3 } }}
      className="overflow-hidden"
    >
      <div className="pb-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-popover p-3 text-left shadow-lg">
          <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-chart-1/12 text-chart-1">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] leading-[1.3] text-foreground">{notice.title}</div>
            <div className="truncate text-xs leading-[1.3] text-muted-foreground">{notice.meta}</div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

/**
 * Two faux cards straddling the hero window's edges on wide screens: a time tracker ticking on the left
 * and notifications arriving on the right, newest on top, the oldest leaving as each new one lands.
 */
export function HeroSatellites() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const live = inView && !reduced;
  const elapsed = useLiveCounter(TICK_MS, live);
  const arrivals = useLiveCounter(NOTIFY_EVERY_MS, live);

  // The newest notice is the one after the last to arrive; ids keep each row's exit animation.
  const visible = Array.from({ length: VISIBLE_NOTIFICATIONS }, (_, offset) => {
    const id = arrivals + VISIBLE_NOTIFICATIONS - 1 - offset;
    return { id, notice: NOTICES[id % NOTICES.length] };
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      <Satellite delay={ENTER_DELAY} className="absolute top-[38%] left-4 xl:-left-8">
        <TimeTracker seconds={TIMER_START_SECONDS + elapsed} />
      </Satellite>
      <Satellite delay={ENTER_DELAY + 0.25} className="absolute top-[12%] right-4 w-72 xl:-right-8">
        <AnimatePresence initial={false}>
          {visible.map(({ id, notice }) => (
            <NotificationRow key={id} notice={notice} />
          ))}
        </AnimatePresence>
      </Satellite>
    </div>
  );
}
