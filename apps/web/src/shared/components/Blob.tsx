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

function jitter(amount = 0.4) {
  return (Math.random() - 0.5) * amount;
}

function clampSpeed(v: number) {
  return Math.max(-4.8, Math.min(4.8, v));
}

export function Blob({ className }: BlobProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLDivElement>("[data-orb]"));
    const orbs: Orb[] = nodes.map((el, index) => {
      const size = el.offsetWidth || 320;
      const dir = index % 2 === 0 ? 1 : -1;
      return {
        el,
        size,
        // Track the orb center inside the viewport.
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (2.4 + Math.random() * 2.2) * dir,
        vy: (2.0 + Math.random() * 2.2) * -dir,
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
            orb.vy = clampSpeed(orb.vy + jitter(0.8));
            orb.x = Math.max(0, Math.min(orb.x, w));
          }

          if (orb.y <= 0 || orb.y >= h) {
            orb.vy = clampSpeed(-orb.vy + jitter());
            orb.vx = clampSpeed(orb.vx + jitter(0.8));
            orb.y = Math.max(0, Math.min(orb.y, h));
          }

          // Draw from top-left so the center sits on (x, y).
          const left = orb.x - orb.size / 2;
          const top = orb.y - orb.size / 2;
          orb.el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
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
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        data-orb
        className="absolute left-0 top-0 size-128 rounded-full bg-[#f2cf6b]/50 blur-[110px] will-change-transform dark:bg-[#e9bf55]/14 sm:size-152"
      />
      <div
        data-orb
        className="absolute left-0 top-0 size-96 rounded-full bg-[#f7e2a1]/55 blur-[90px] will-change-transform dark:bg-[#f0cf7a]/10 sm:size-120"
      />
    </div>
  );
}

export default Blob;
