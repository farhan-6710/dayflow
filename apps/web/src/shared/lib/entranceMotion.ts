/**
 * Single choreographer for every entrance animation. Each `animate-*` utility starts paused;
 * this module gives the element its start delay and marks it `data-revealed` to play.
 *
 * Two lanes:
 * - shell (`animate-shell-*`): sidebar + app header, plays on mount, staggered down each edge.
 * - page (`animate-hero`, then `animate-enter`): one queue in document order. Hero lines play
 *   on mount; content waits until ≥30% of it sits above the 80% line (reference FadeIn viewport).
 *   Groups overlap: each one starts a fixed offset after the previous group's last start, never
 *   waiting for it to finish, so sections cascade in order without stalling the page.
 *
 * Durations live in src/index.css; the offsets below are tuned to them.
 */
type PageKind = 'hero' | 'enter'

/** Gap between items in the same group (shell edge, header lines, sibling cards). */
const STAGGER_MS = { shell: 35, hero: 70, enter: 70 }
/** Offset from the previous group's last start to the next group's first start. */
const GROUP_OFFSET_MS = { hero: 90, enter: 85 }
/** Page content starts this long after the shell starts, so the frame leads. */
const SHELL_LEAD_MS = 80
/** Shell items further apart than this belong to a new mount (e.g. after logging in again). */
const SHELL_BURST_MS = 1000

const REVEALED = 'data-revealed'
const AMOUNT = 0.3
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20)
const SELECTOR = '.animate-enter, .animate-hero, .animate-shell-left, .animate-shell-down'

const shellLast = new Map<string, number>()
let shellBurstStart = -Infinity
let pageGate = 0
let lastPage: { kind: PageKind; start: number; parent: Element | null } | null = null

function play(el: HTMLElement, start: number, now: number) {
  el.style.animationDelay = `${Math.round(start - now)}ms`
  el.setAttribute(REVEALED, '')
}

function scheduleShell(el: HTMLElement, edge: string, now: number) {
  if (now - shellBurstStart > SHELL_BURST_MS) {
    shellBurstStart = now
    shellLast.clear()
    pageGate = Math.max(pageGate, now + SHELL_LEAD_MS)
  }
  const previous = shellLast.get(edge)
  const start = previous === undefined ? now : Math.max(now, previous + STAGGER_MS.shell)
  shellLast.set(edge, start)
  play(el, start, now)
}

function schedulePage(el: HTMLElement, kind: PageKind, now: number) {
  let start = Math.max(now, pageGate)
  if (lastPage) {
    const sameGroup = lastPage.kind === kind && (kind === 'hero' || lastPage.parent === el.parentElement)
    const gap = sameGroup ? STAGGER_MS[kind] : GROUP_OFFSET_MS[lastPage.kind]
    start = Math.max(start, lastPage.start + gap)
  }
  lastPage = { kind, start, parent: el.parentElement }
  play(el, start, now)
}

/** Elements still waiting to reveal that are somewhere on screen (used for the page-end fallback). */
const onScreen = new Set<Element>()

function revealContent(el: Element) {
  untrack(el)
  schedulePage(el as HTMLElement, 'enter', performance.now())
}

// Fires once ≥30% of the element (or of the viewport, for tall elements) sits above the 80% line.
const trigger = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const rootHeight = entry.rootBounds?.height ?? window.innerHeight
      if (entry.intersectionRatio >= AMOUNT || entry.intersectionRect.height >= rootHeight * AMOUNT) revealContent(entry.target)
    }
  },
  { rootMargin: '0px 0px -20% 0px', threshold: THRESHOLDS },
)

// Bottom margin covers the start offset, so an element whose resting spot is on screen counts.
const viewport = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target)
      else onScreen.delete(entry.target)
    }
    revealAtScrollEnd()
  },
  { rootMargin: '0px 0px 24px 0px' },
)

function atScrollEnd(el: Element): boolean {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    if (node.scrollHeight > node.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(node).overflowY)) {
      return node.scrollTop + node.clientHeight >= node.scrollHeight - 2
    }
  }
  const root = document.scrollingElement ?? document.documentElement
  return root.scrollTop + window.innerHeight >= root.scrollHeight - 2
}

/** Content stuck in the bottom 20% band can never cross the trigger line once scrolling bottoms out. */
function revealAtScrollEnd() {
  for (const el of onScreen) if (atScrollEnd(el)) revealContent(el)
}

function track(el: Element) {
  if (el.hasAttribute(REVEALED) || !(el instanceof HTMLElement)) return
  const { classList } = el
  const now = performance.now()
  if (classList.contains('animate-shell-left')) scheduleShell(el, 'left', now)
  else if (classList.contains('animate-shell-down')) scheduleShell(el, 'down', now)
  else if (classList.contains('animate-hero')) schedulePage(el, 'hero', now)
  else {
    trigger.observe(el)
    viewport.observe(el)
  }
}

function untrack(el: Element) {
  trigger.unobserve(el)
  viewport.unobserve(el)
  onScreen.delete(el)
}

function forEachTarget(node: Node, fn: (el: Element) => void) {
  if (!(node instanceof Element)) return
  if (node.matches(SELECTOR)) fn(node)
  node.querySelectorAll(SELECTOR).forEach(fn)
}

let started = false

export function startEntranceMotion() {
  if (started) return
  started = true

  forEachTarget(document.body, track)
  // Runs as a microtask after React commits, so delays are set before the first paint.
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => forEachTarget(node, track))
      mutation.removedNodes.forEach((node) => forEachTarget(node, untrack))
    }
  }).observe(document.body, { childList: true, subtree: true })

  let frame = 0
  const schedule = () => {
    if (frame || !onScreen.size) return
    frame = requestAnimationFrame(() => {
      frame = 0
      revealAtScrollEnd()
    })
  }
  document.addEventListener('scroll', schedule, { capture: true, passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}
