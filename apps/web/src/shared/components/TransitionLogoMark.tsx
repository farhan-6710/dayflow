import { m } from "framer-motion";

import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import type { TransitionLogoMarkProps } from "@/shared/types/components";

/** The line and spinning logo mark shown between the shutters (ShopNow's opener and route windows). */
export function TransitionLogoMark({ timing }: TransitionLogoMarkProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <m.div
        initial={{ width: 0 }}
        animate={{ width: "100vw", opacity: 0 }}
        transition={{
          width: { delay: timing.lineWidthDelay, duration: timing.lineDuration, ease: "easeInOut" },
          opacity: { delay: timing.lineOpacityDelay, duration: 0.2 },
        }}
        className="absolute h-0.5 bg-foreground"
      />

      <m.div
        initial={{ scale: 0, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          scale: { duration: timing.logoEnterDuration, ease: "backOut" },
          opacity: { duration: 0.4 },
          rotate: { duration: timing.logoEnterDuration, ease: "backOut" },
        }}
        className="relative z-10"
      >
        <m.div
          animate={{ scale: 0, opacity: 0 }}
          transition={{ delay: timing.logoExitDelay, duration: timing.logoExitDuration }}
          className="flex size-60 items-center justify-center rounded-full border-2 border-foreground bg-background shadow-[0_0_60px_color-mix(in_oklab,var(--foreground)_21%,transparent)] dark:shadow-[0_0_60px_color-mix(in_oklab,var(--foreground)_16%,transparent)]"
        >
          <DayFlowLogo className="size-32" />
        </m.div>
      </m.div>
    </div>
  );
}
