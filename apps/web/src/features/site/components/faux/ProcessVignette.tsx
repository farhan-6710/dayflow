import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Send } from "lucide-react";

import { Arrive, FauxAvatar, FauxBar, FauxPill } from "@/features/site/components/faux/FauxParts";
import { FAUX_EASE, FAUX_SPRING } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";
import { cn } from "@/shared/lib/utils";

/** Each step's vignette starts a little after the one before it, so the row plays left to right. */
const STEP_DELAY_MS = 450;
const TYPE_MS = 70;
const TYPED_EMAIL = "you@studio.com";
const WEEK = ["M", "T", "W", "T", "F"];
const DROP_DAY = 2;

/** Types `text` one character at a time once `run` turns on. */
function TypedText({ text, run }: { text: string; run: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!run || count >= text.length) return;
    const id = window.setTimeout(() => setCount(count + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [run, count, text]);
  return (
    <>
      {text.slice(0, count)}
      <span className={cn("ml-px inline-block h-3.5 w-px translate-y-0.5 bg-foreground", count >= text.length && "animate-pulse")} />
    </>
  );
}

function SignUpScene({ step }: { step: number }) {
  const typed = step >= 1;
  return (
    <div className="grid w-full gap-2">
      <div className="rounded-md border border-border bg-card px-2.5 py-2 text-[13px] text-foreground">
        <TypedText text={TYPED_EMAIL} run={typed} />
      </div>
      <span className="justify-self-start rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Create workspace</span>
    </div>
  );
}

function ClientsScene({ step }: { step: number }) {
  return (
    <div className="grid w-full gap-1">
      <Arrive show={step >= 1}>
        <div className="flex items-center gap-2 rounded-md bg-card px-2 py-1.5 shadow-xs">
          <FauxAvatar initials="PC" tone="green" className="size-6 text-[10px]" />
          <span className="truncate text-[13px] text-foreground">Pine &amp; Co.</span>
          <FauxPill tone="accent" className="ml-auto">New</FauxPill>
        </div>
      </Arrive>
      {["62%", "48%"].map((width) => (
        <div key={width} className="flex items-center gap-2 px-2 py-1.5">
          <span className="size-6 flex-none rounded-full bg-muted-foreground/15" />
          <FauxBar width={width} />
        </div>
      ))}
    </div>
  );
}

function PlanScene({ step }: { step: number }) {
  return (
    <div className="grid w-full grid-cols-5 gap-1">
      {WEEK.map((day, index) => (
        <div key={`${day}-${index}`} className="flex h-20 flex-col items-center gap-1.5 rounded-md bg-card pt-1.5">
          <span className="text-[11px] text-muted-foreground">{day}</span>
          {index === DROP_DAY ? (
            <m.span
              initial={false}
              animate={step >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -18, scale: 1.08 }}
              transition={FAUX_SPRING}
              className="h-7 w-[calc(100%-0.5rem)] rounded-sm border-l-2 border-chart-1 bg-chart-1/15"
            />
          ) : (
            <span className={cn("h-1.5 rounded-full bg-muted-foreground/15", index % 2 ? "w-3/5" : "w-2/5")} />
          )}
        </div>
      ))}
    </div>
  );
}

function PortalScene({ step }: { step: number }) {
  const on = step >= 1;
  return (
    <div className="grid w-full gap-2">
      <div className="flex items-center gap-2 rounded-md bg-card px-2.5 py-2">
        <span className="text-[13px] text-foreground">Portal access</span>
        <span className={cn("relative ml-auto h-5 w-9 rounded-full transition-colors duration-300", on ? "bg-chart-1" : "bg-muted")}>
          <m.span
            initial={false}
            animate={{ x: on ? 16 : 0 }}
            transition={FAUX_SPRING}
            className="absolute top-0.5 left-0.5 size-4 rounded-full bg-card shadow-sm"
          />
        </span>
      </div>
      <m.div
        initial={false}
        animate={step >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.45, ease: FAUX_EASE }}
        className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground"
      >
        <Send className="size-3.5 text-chart-1" />
        Invite sent to sam@pine.co
      </m.div>
    </div>
  );
}

const SCENES = [SignUpScene, ClientsScene, PlanScene, PortalScene];

/** Working process: a tiny faux scene for step `index`, played once as the row scrolls in. */
export function ProcessVignette({ index }: { index: number }) {
  const holds = useMemo(() => [300 + index * STEP_DELAY_MS, 900], [index]);
  const { ref, step } = useFauxTimeline(holds);
  const Scene = SCENES[index] ?? SignUpScene;

  return (
    <div ref={ref} aria-hidden="true" className="flex h-32 items-center rounded-md border border-border bg-background px-3">
      <Scene step={step} />
    </div>
  );
}
