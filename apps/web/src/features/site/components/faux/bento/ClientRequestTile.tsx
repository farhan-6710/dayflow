import { m } from "framer-motion";
import { CalendarClock } from "lucide-react";

import { FauxAvatar, FauxBar, FauxPill, RollText } from "@/features/site/components/faux/FauxParts";
import { FAUX_EASE } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";

/** Beats: the request arrives from the portal, then you accept it on the card. */
const HOLDS = [400, 1700] as const;
const STEP_ARRIVED = 1;
const STEP_ACCEPTED = 2;

/** A meeting a client raised from their portal, landing in your workspace and turning accepted. */
export function ClientRequestTile() {
  const { ref, step } = useFauxTimeline(HOLDS);
  const accepted = step >= STEP_ACCEPTED;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 flex flex-col items-start gap-3 overflow-hidden px-6 pt-1">
      <m.div
        initial={false}
        animate={step >= STEP_ARRIVED ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.6, ease: FAUX_EASE }}
        className="w-full max-w-[19rem] rounded-xl border border-border bg-card p-4 shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <FauxAvatar initials="MC" tone="coral" />
          <div className="min-w-0">
            <div className="truncate text-sm leading-[1.3] text-foreground">Maya Chen</div>
            <div className="truncate text-xs leading-[1.3] text-muted-foreground">Fernleaf · raised a meeting</div>
          </div>
          <FauxPill tone="accent" className="ml-auto">Client</FauxPill>
        </div>
        <div className="mt-4 rounded-lg bg-background px-3 py-2.5">
          <div className="text-sm text-foreground">Kickoff review</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            Thu · 10:00 AM
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Status</span>
          <FauxPill tone={accepted ? "success" : "muted"}>
            <RollText value={accepted ? "Accepted" : "Pending"} />
          </FauxPill>
        </div>
      </m.div>
      {/* An earlier request under it, quieter and cut by the tile, so the card sits in a list. */}
      <div className="w-full max-w-[19rem] rounded-xl border border-border bg-card/70 p-4">
        <div className="flex items-center gap-2.5">
          <span className="size-7 flex-none rounded-full bg-muted-foreground/15" />
          <div className="grid flex-1 gap-1.5">
            <FauxBar width="52%" />
            <FauxBar width="74%" />
          </div>
        </div>
        <div className="mt-4 h-14 rounded-lg bg-background" />
      </div>
    </div>
  );
}
