import { useEffect, useState } from "react";
import { m } from "framer-motion";

import { TransitionLogoMark } from "@/shared/components/TransitionLogoMark";
import { ROUTE_TRANSITION_ANIMATION as ANIM } from "@/shared/constants/routeTransition";
import { holdEntrances, releaseEntrances } from "@/shared/lib/entranceMotion";
import type { RouteTransitionWindowProps } from "@/shared/types/components";

/** Two shutters close over the page, then open around the logo mark and a line once the route has changed. */
export function RouteTransitionWindow({ isNavigating }: RouteTransitionWindowProps) {
  const [openShutters, setOpenShutters] = useState(false);
  const [isFinished, setIsFinished] = useState(true);

  useEffect(() => {
    if (isNavigating) {
      // The next page mounts behind the shutters; its entrances wait until they open.
      holdEntrances();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restart the sequence
      setIsFinished(false);
      setOpenShutters(false);
      return;
    }
    if (isFinished) {
      return;
    }
    const shutterTimer = window.setTimeout(() => setOpenShutters(true), ANIM.SHUTTER_OPEN_DELAY_MS);
    const releaseTimer = window.setTimeout(releaseEntrances, ANIM.RELEASE_ENTRANCES_DELAY_MS);
    const cleanupTimer = window.setTimeout(() => setIsFinished(true), ANIM.CLEANUP_DELAY_MS);
    return () => {
      window.clearTimeout(shutterTimer);
      window.clearTimeout(releaseTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [isNavigating, isFinished]);

  // Never leave entrances held if the shell unmounts mid-transition.
  useEffect(() => releaseEntrances, []);

  if (isFinished && !isNavigating) {
    return null;
  }

  const shutterTransition = { duration: ANIM.SHUTTER.DURATION, ease: ANIM.SHUTTER.EASE };

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col" aria-hidden="true">
      {/* Upper shutter slides down from the top. */}
      <m.div
        initial={{ y: "-100%" }}
        animate={{ y: openShutters ? "-100%" : "0%" }}
        transition={shutterTransition}
        className="relative w-full flex-1 border-b border-border bg-background"
      >
        <m.div
          initial={{ opacity: 1 }}
          animate={{ opacity: openShutters ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 bottom-0 left-0 h-px bg-background/20"
        />
      </m.div>

      {/* Lower shutter slides up from the bottom. */}
      <m.div
        initial={{ y: "100%" }}
        animate={{ y: openShutters ? "100%" : "0%" }}
        transition={shutterTransition}
        className="relative w-full flex-1 border-t border-border bg-background"
      />

      {/* Once the new route is in: the line spreads out and the mark spins in, then both leave. */}
      {!isFinished && !isNavigating ? <TransitionLogoMark timing={ANIM.MARK} /> : null}
    </div>
  );
}
