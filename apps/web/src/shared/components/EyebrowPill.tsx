import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

/** Amber uppercase pill used above page headings and in hero panels. */
export function EyebrowPill({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      style={style}
      className={cn(
        "inline-flex h-7 max-w-full items-center truncate rounded-full border border-tint/20 bg-[color-mix(in_srgb,var(--tint)_28%,var(--card))] px-3.5 text-[0.6875rem] font-medium tracking-[0.08em] text-primary-text uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:shadow-none",
        className,
      )}
    >
      {children}
    </p>
  );
}
