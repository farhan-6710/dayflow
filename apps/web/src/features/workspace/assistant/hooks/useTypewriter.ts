import { useEffect, useState } from "react";

/** Characters revealed per frame never drop below this, so short replies still type visibly. */
const MIN_STEP = 1;
/** Each frame reveals this fraction of what is still hidden, so a big chunk catches up smoothly. */
const CATCH_UP_FRAMES = 30;

/**
 * Reveals `target` a few characters per animation frame, so text that arrives in large chunks
 * still reads as live typing. Text that is already complete when it mounts (`live` false) shows in
 * full; once typing starts it finishes even if the stream ends first.
 */
export function useTypewriter(target: string, live: boolean): { text: string; isTyping: boolean } {
  const [shown, setShown] = useState(() => (live ? 0 : target.length));

  useEffect(() => {
    if (shown >= target.length) return;
    const frame = requestAnimationFrame(() => {
      const hidden = target.length - shown;
      setShown(Math.min(target.length, shown + Math.max(MIN_STEP, Math.ceil(hidden / CATCH_UP_FRAMES))));
    });
    return () => cancelAnimationFrame(frame);
  }, [shown, target.length]);

  return { text: target.slice(0, shown), isTyping: shown < target.length };
}
