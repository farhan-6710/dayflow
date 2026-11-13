import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { CHAPTER_EASE } from "@/features/site/constants/siteMotion";
import type { FeatureChapterProps } from "@/features/site/types/components";
import { DayflowImage } from "@/shared/components/DayflowImage";

/** Rises in once its top reaches 88% of the screen (GSAP "top 88%" in the original). */
const CHAPTER_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" };

/** One vertical chapter on the features rail: art that eases in as it passes, then the copy. */
export function FeatureChapter({ feature, index }: FeatureChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const number = String(index + 1).padStart(2, "0");

  return (
    <article ref={ref} data-index={index} className="flex min-h-[min(78vh,44rem)] flex-col justify-center gap-7 py-12 lg:py-16">
      <m.div
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={CHAPTER_VIEWPORT}
        transition={{ duration: 0.9, ease: CHAPTER_EASE }}
        className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border bg-card sm:aspect-[5/3]"
      >
        <m.div style={{ scale: imageScale }} className="flex size-full items-center justify-center">
          <DayflowImage name={feature.image} className="h-[62%] w-auto" />
        </m.div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/60 to-transparent px-5 pt-16 pb-5 text-primary-foreground">
          <p className="m-0 font-heading text-4xl tabular-nums opacity-85">{number}</p>
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={CHAPTER_VIEWPORT}
        transition={{ duration: 0.8, delay: 0.08, ease: CHAPTER_EASE }}
        className="min-w-0 max-w-xl"
      >
        <p className="m-0 font-serif text-lg text-muted-foreground italic">Feature {number}</p>
        <h3 className="mt-3 mb-0 font-heading text-2xl leading-tight text-foreground sm:text-3xl">{feature.title}</h3>
        <p className="mt-4 mb-0 text-muted-foreground">{feature.summary}</p>
        <ul className="mt-5 mb-0 grid list-none gap-2.5 p-0">
          {feature.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-1" />
              {benefit}
            </li>
          ))}
        </ul>
        <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} className="mt-7 h-auto min-h-9 max-w-full self-start py-2 text-left whitespace-normal">
          Try {feature.title.toLowerCase()}
          <ArrowRight className="size-4" aria-hidden="true" />
        </SiteLinkButton>
      </m.div>
    </article>
  );
}
