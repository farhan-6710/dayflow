import { useId } from "react";
import { Sparkles } from "lucide-react";

import { SPOTLIGHT } from "@/features/site/constants/homeContent";
import { cn } from "@/shared/lib/utils";

/** Round seal for the corner of the spotlight art: ring of text turning slowly around a mark. */
export function BrandSeal({ className }: { className?: string }) {
  const ringId = useId();
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex items-center justify-center rounded-full border border-chart-1/40 bg-background shadow-lg", className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_28s_linear_infinite] p-0.5 motion-reduce:animate-none">
        <defs>
          <path id={ringId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--foreground)" strokeOpacity="0.18" strokeWidth="0.8" />
        <text fill="var(--foreground)" fillOpacity="0.72" fontSize="8.2" letterSpacing="1.1">
          <textPath href={`#${ringId}`} textLength="230" lengthAdjust="spacing">
            {SPOTLIGHT.seal}
          </textPath>
        </text>
      </svg>
      <span className="relative inline-flex size-[36%] items-center justify-center rounded-full bg-primary shadow-sm">
        <Sparkles className="size-1/2 text-primary-foreground" strokeWidth={2.2} />
      </span>
    </span>
  );
}
