import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { AccentTitle } from "@/features/site/components/section/AccentText";
import type { SectionIntroProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

/**
 * Eyebrow with a coral dot, title with its accent words (or a coral rule when it has none), lead and a
 * large faded count, revealed one after another.
 */
export function SectionIntro({ eyebrow, title, accent, lead, count, center = false, className }: SectionIntroProps) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <BlurIn>
        <p className={cn("m-0 flex items-center gap-2 font-serif text-lg text-muted-foreground italic", center && "justify-center")}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-chart-1" />
          {eyebrow}
        </p>
      </BlurIn>
      <BlurIn delay={0.1}>
        <h2 className="mt-3 mb-0 font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          <AccentTitle text={title} accent={accent} />
        </h2>
        {accent ? null : (
          <span aria-hidden="true" className={cn("mt-4 block h-[3px] w-12 rounded-full bg-chart-1", center && "mx-auto")} />
        )}
      </BlurIn>
      {lead ? (
        <BlurIn delay={0.15}>
          <p className="mt-4 mb-0 text-muted-foreground text-pretty">{lead}</p>
        </BlurIn>
      ) : null}
      {count ? (
        <BlurIn delay={0.2}>
          <p className="mt-5 mb-0 font-heading text-5xl leading-none text-chart-1/45 tabular-nums sm:text-6xl">
            {String(count).padStart(2, "0")}
          </p>
        </BlurIn>
      ) : null}
    </div>
  );
}
