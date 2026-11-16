import type { ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check } from "lucide-react";

import { FAUX_EASE, FAUX_SPRING } from "@/features/site/constants/fauxMotion";
import { cn } from "@/shared/lib/utils";


/** Text that changes by rolling: the old value leaves upward while the new one rises in, in the same cell. */
export function RollText({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <AnimatePresence initial={false}>
        <m.span
          key={value}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: FAUX_EASE }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/** A row that opens its own height as it arrives, carrying the rows below it down. */
export function Arrive({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <m.div
      initial={false}
      animate={show ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
      transition={{ height: { duration: 0.5, ease: FAUX_EASE }, opacity: { duration: 0.35, delay: show ? 0.12 : 0 } }}
      className={cn("overflow-hidden", className)}
      aria-hidden={!show}
    >
      {children}
    </m.div>
  );
}

/** A round task check that fills with the accent when done. */
export function FauxCheck({ done, className }: { done: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-4 flex-none items-center justify-center rounded-full border transition-colors duration-300",
        done ? "border-chart-1 bg-chart-1 text-card" : "border-muted-foreground/45 bg-transparent",
        className,
      )}
    >
      <m.span initial={false} animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={FAUX_SPRING} className="flex">
        <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />
      </m.span>
    </span>
  );
}

/** Placeholder line standing in for text the story is not about. */
export function FauxBar({ width, className }: { width: string; className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-muted-foreground/20", className)} style={{ width }} />;
}

const AVATAR_TONES = {
  coral: "bg-chart-1/15 text-chart-1",
  green: "bg-success/15 text-success-text",
  stone: "bg-chart-4/30 text-foreground",
} as const;

/** Initials in a tinted disc; each named person keeps one tone. */
export function FauxAvatar({
  initials,
  tone,
  className,
}: {
  initials: string;
  tone: keyof typeof AVATAR_TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-7 flex-none items-center justify-center rounded-full text-[11px] font-semibold tracking-wide",
        AVATAR_TONES[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Small status pill; `tone` colours it. */
export function FauxPill({ children, tone = "muted", className }: { children: ReactNode; tone?: "muted" | "accent" | "success"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center rounded-full px-2 py-0.5 text-[11px] leading-[1.3] font-medium transition-colors duration-300",
        tone === "accent" && "bg-chart-1/12 text-chart-1",
        tone === "success" && "bg-success/12 text-success-text",
        tone === "muted" && "bg-muted/60 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
