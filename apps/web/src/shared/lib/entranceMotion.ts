/**
 * Start times for every entrance animation, so the shell and the page cascade as one sequence.
 *
 * Two lanes:
 * - shell: sidebar and header, staggered down each edge on mount.
 * - page: heading lines, then content, one queue in the order they appear. Groups overlap: each
 *   starts a fixed offset after the previous group's last start, never waiting for it to finish.
 */
export type EntranceKind = "hero" | "enter" | "shell-left" | "shell-down";

type PageKind = "hero" | "enter";

/** Gap between items in the same group (shell edge, heading lines, sibling cards). */
const STAGGER_MS = { shell: 35, hero: 70, enter: 70 };
/** Offset from the previous group's last start to the next group's first start. */
const GROUP_OFFSET_MS = { hero: 90, enter: 85 };
/** Page content starts this long after the shell, so the frame leads. */
const SHELL_LEAD_MS = 80;
/** Shell items further apart than this belong to a new mount (signing in again, reopening the sheet). */
const SHELL_BURST_MS = 1000;

const shellLast = new Map<string, number>();
let shellBurstStart = -Infinity;
let pageGate = 0;
let lastPage: { kind: PageKind; start: number; parent: Element | null } | null = null;

function shellStart(edge: string, now: number) {
  if (now - shellBurstStart > SHELL_BURST_MS) {
    shellBurstStart = now;
    shellLast.clear();
    pageGate = Math.max(pageGate, now + SHELL_LEAD_MS);
  }
  const previous = shellLast.get(edge);
  const start = previous === undefined ? now : Math.max(now, previous + STAGGER_MS.shell);
  shellLast.set(edge, start);
  return start;
}

function pageStart(kind: PageKind, parent: Element | null, now: number) {
  let start = Math.max(now, pageGate);
  if (lastPage) {
    const sameGroup = lastPage.kind === kind && (kind === "hero" || lastPage.parent === parent);
    const gap = sameGroup ? STAGGER_MS[kind] : GROUP_OFFSET_MS[lastPage.kind];
    start = Math.max(start, lastPage.start + gap);
  }
  lastPage = { kind, start, parent };
  return start;
}

/** Seconds this element should wait before it plays. */
export function entranceDelay(kind: EntranceKind, parent: Element | null) {
  const now = performance.now();
  const start = kind === "hero" || kind === "enter" ? pageStart(kind, parent, now) : shellStart(kind, now);
  return (start - now) / 1000;
}
