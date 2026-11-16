import { m } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { FAUX_SPRING } from "@/features/site/constants/fauxMotion";
import { useFauxTimeline } from "@/features/site/components/faux/useFauxTimeline";
import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { cn } from "@/shared/lib/utils";

/** Beats: show the page's own theme, then flip to the other one and hold. */
const HOLDS = [1300] as const;
const THUMB_TRAVEL = 40;

/**
 * Light and dark as an object: a large sun/moon switch over a paper swatch. The swatch starts in the
 * page's theme and inverts when the switch flips, so it reads right on either theme.
 */
export function ThemeTile() {
  const { isDark } = useThemeMode();
  const { ref, step } = useFauxTimeline(HOLDS);
  const flipped = step >= 1;
  const showsDark = isDark !== flipped;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 flex flex-col items-start gap-5 px-6 pt-1">
      <div className="relative flex h-11 w-[5.75rem] items-center rounded-full border border-border bg-background p-1">
        <m.span
          className="absolute top-1 left-1 size-[2.125rem] rounded-full bg-primary shadow-sm"
          initial={false}
          animate={{ x: showsDark ? THUMB_TRAVEL : 0 }}
          transition={FAUX_SPRING}
        />
        <span className={cn("relative flex size-[2.125rem] items-center justify-center transition-colors", showsDark ? "text-muted-foreground" : "text-primary-foreground")}>
          <Sun className="size-4" />
        </span>
        <span className={cn("relative ml-auto flex size-[2.125rem] items-center justify-center transition-colors", showsDark ? "text-primary-foreground" : "text-muted-foreground")}>
          <Moon className="size-4" />
        </span>
      </div>
      <div
        className={cn(
          "w-full max-w-[15rem] rounded-xl border p-4 transition-colors duration-700",
          flipped ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground",
        )}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-4xl leading-none">Aa</span>
          <span className="size-2.5 rounded-full bg-chart-1" />
        </div>
        <div className="mt-4 grid gap-1.5">
          <span className="block h-1.5 w-[86%] rounded-full bg-current opacity-20" />
          <span className="block h-1.5 w-[64%] rounded-full bg-current opacity-20" />
        </div>
      </div>
    </div>
  );
}
