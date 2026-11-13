import { useContext, useEffect, useRef, type ComponentProps, type ElementType } from "react";
import { m, useAnimationControls, useInView, useReducedMotion } from "framer-motion";

import { entranceDelay, entrancesReleased, type EntranceKind } from "@/shared/lib/entranceMotion";
import { SkeletonContext } from "@/shared/lib/skeletonContext";

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

const ENTRANCES = {
  hero: { hidden: { opacity: 0, y: 12, filter: "blur(6px)" }, duration: 0.7 },
  enter: { hidden: { opacity: 0, y: 24, filter: "blur(6px)" }, duration: 0.75 },
  "shell-left": { hidden: { opacity: 0, x: -20 }, duration: 0.45 },
  "shell-down": { hidden: { opacity: 0, y: -14 }, duration: 0.45 },
};

type RevealTag = "div" | "section" | "article" | "header" | "li";

type RevealProps = ComponentProps<typeof m.div> & {
  /** `enter` plays once it scrolls into view; the others play on mount. */
  kind?: EntranceKind;
  as?: RevealTag;
};

export function Reveal({ kind = "enter", as = "div", ...props }: RevealProps) {
  const isSkeleton = useContext(SkeletonContext);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = isSkeleton || Boolean(reducedMotion);
  const ready = kind !== "enter" || inView;

  useEffect(() => {
    if (still || !ready || !ref.current) {
      return;
    }
    let cancelled = false;
    // Waits while a shutter transition covers the screen, so the entrance is seen.
    void entrancesReleased().then(() => {
      if (cancelled || !ref.current) {
        return;
      }
      const { hidden, duration } = ENTRANCES[kind];
      const blurs = "filter" in hidden;
      void controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        ...(blurs ? { filter: "blur(0px)" } : {}),
        transition: { delay: entranceDelay(kind, ref.current.parentElement), duration, ease: EASE_OUT_SOFT },
        // A leftover filter would trap fixed children and blur text rendering.
        ...(blurs ? { transitionEnd: { filter: "none" } } : {}),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [controls, kind, ready, still]);

  if (still) {
    const Tag = as as ElementType;
    return <Tag {...props} />;
  }
  const Component = m[as] as typeof m.div;
  return <Component ref={ref} initial={ENTRANCES[kind].hidden} animate={controls} {...props} />;
}
