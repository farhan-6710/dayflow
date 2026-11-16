import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** How much of a faux UI must be on screen before its story starts. */
const START_AMOUNT = 0.45;

/**
 * Drives a faux UI story that plays once when it scrolls into view. `holds[i]` is how long step `i`
 * stays on screen before step `i + 1`, so the story ends on step `holds.length` and holds there.
 * Reduced motion jumps straight to that last step: the finished state is the poster.
 */
export function useFauxTimeline<T extends Element = HTMLDivElement>(holds: readonly number[]) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: START_AMOUNT });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const last = holds.length;

  useEffect(() => {
    if (!inView || reduced || step >= last) return;
    const id = window.setTimeout(() => setStep(step + 1), holds[step]);
    return () => window.clearTimeout(id);
  }, [inView, reduced, step, last, holds]);

  return { ref, step: reduced ? last : step };
}
