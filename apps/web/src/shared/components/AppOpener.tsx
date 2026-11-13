import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

import { TransitionLogoMark } from "@/shared/components/TransitionLogoMark";
import { APP_OPENER_ANIMATION as ANIM } from "@/shared/constants/routeTransition";
import type { AppOpenerProps } from "@/shared/types/components";

/** First load (ShopNow's WindowOpener): closed shutters with the logo mark, then they open on the app. */
export function AppOpener({ children }: AppOpenerProps) {
  const reducedMotion = useReducedMotion();
  const [mountContent, setMountContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMountContent(true), ANIM.MOUNT_CONTENT_DELAY_MS);
    const cleanupTimer = window.setTimeout(() => setAnimationFinished(true), ANIM.CLEANUP_DELAY_MS);
    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, []);

  if (reducedMotion) {
    return children;
  }

  const shutterTransition = {
    duration: ANIM.SHUTTER.DURATION,
    delay: ANIM.SHUTTER.DELAY,
    ease: ANIM.SHUTTER.EASE,
  };

  return (
    <>
      {mountContent ? children : null}

      {animationFinished ? null : (
        <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col" aria-hidden="true">
          <m.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={shutterTransition}
            className="relative w-full flex-1 border-b border-border bg-background"
          >
            <m.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: ANIM.SHUTTER.DELAY, duration: 0.2 }}
              className="absolute right-0 bottom-0 left-0 h-px bg-background/20"
            />
          </m.div>

          <m.div
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={shutterTransition}
            className="relative w-full flex-1 border-t border-border bg-background"
          />

          <TransitionLogoMark timing={ANIM.MARK} />
        </div>
      )}
    </>
  );
}
