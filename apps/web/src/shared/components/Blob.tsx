import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

type BlobProps = {
  className?: string;
};

type Orb = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

function jitter(amount = 0.35) {
  return (Math.random() - 0.5) * amount;
}

function clampSpeed(v: number) {
  return Math.max(-3.2, Math.min(3.2, v));
}

/** Full-viewport gold wash — sits behind all shell chrome and page content. */
export function Blob({ className }: BlobProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLDivElement>("[data-orb]"));
    const orbs: Orb[] = nodes.map((el, index) => {
      const size = el.offsetWidth || 420;
      const dir = index % 2 === 0 ? 1 : -1;
      return {
        el,
        size,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (1.6 + Math.random() * 1.4) * dir,
        vy: (1.3 + Math.random() * 1.4) * -dir,
      };
    });

    let frame = 0;

    const tick = () => {
      if (!document.hidden) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        for (const orb of orbs) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          if (orb.x <= 0 || orb.x >= w) {
            orb.vx = clampSpeed(-orb.vx + jitter());
            orb.vy = clampSpeed(orb.vy + jitter(0.6));
            orb.x = Math.max(0, Math.min(orb.x, w));
          }

          if (orb.y <= 0 || orb.y >= h) {
            orb.vy = clampSpeed(-orb.vy + jitter());
            orb.vx = clampSpeed(orb.vx + jitter(0.6));
            orb.y = Math.max(0, Math.min(orb.y, h));
          }

          orb.el.style.transform = `translate3d(${orb.x - orb.size / 2}px, ${orb.y - orb.size / 2}px, 0)`;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      <div
        data-orb
        className="absolute left-0 top-0 size-128 rounded-full bg-[#f2cf6b]/40 blur-[110px] will-change-transform dark:bg-[#e9bf55]/28 sm:size-152"
      />
      <div
        data-orb
        className="absolute left-0 top-0 size-96 rounded-full bg-[#f7e2a1]/50 blur-[90px] will-change-transform dark:bg-[#f0cf7a]/20 sm:size-120"
      />
    </div>
  );
}

export default Blob;
