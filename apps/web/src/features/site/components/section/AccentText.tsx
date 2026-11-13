import { m } from "framer-motion";

/** Draws once, when the word first scrolls into view. */
const DRAW_VIEWPORT = { once: true, margin: "0px 0px -10% 0px" };

/**
 * A word or phrase in the accent colour with a hand-drawn underline that draws itself in. The site's
 * one recurring accent gesture: the hero tagline and every section title use it on a few words only.
 */
export function AccentText({ children, delay = 0.35 }: { children: string; delay?: number }) {
  return (
    <span className="relative inline-block whitespace-nowrap text-chart-1">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.14em] left-0 h-[0.28em] w-[96%] overflow-visible"
      >
        <m.path
          d="M3 14 C 48 5, 120 3, 197 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={DRAW_VIEWPORT}
          transition={{ delay, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}

/** `text` with the `accent` part (an exact substring) set in AccentText; plain text when there is no accent. */
export function AccentTitle({ text, accent }: { text: string; accent?: string }) {
  const start = accent ? text.indexOf(accent) : -1;
  if (!accent || start < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, start)}
      <AccentText>{accent}</AccentText>
      {text.slice(start + accent.length)}
    </>
  );
}
