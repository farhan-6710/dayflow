import { useEffect, useRef, useState } from "react";

import { SITE_FEATURES_PATH } from "@/app/constants/siteRoutes";
import { FeatureChapter } from "@/features/site/components/home/FeatureChapter";
import { AccentTitle } from "@/features/site/components/section/AccentText";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { FEATURE_CHAPTERS, FEATURES_BLOCK } from "@/features/site/constants/featuresContent";
import { cn } from "@/shared/lib/utils";

/** The chapter crossing the middle of the screen is the active one in the rail. */
const ACTIVE_BAND = "-45% 0px -45% 0px";

/** Sticky intro rail beside scroll-revealed chapters. No transform or filter on the rail: it breaks sticky. */
export function FeaturesScroll({ showCta = true }: { showCta?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapters = root.current?.querySelectorAll<HTMLElement>("[data-index]");
    if (!chapters?.length) return;
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(Number((record.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: ACTIVE_BAND },
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    root.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div ref={root} className="grid items-start gap-10 lg:grid-cols-[minmax(16rem,34rem)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
      <aside className="relative z-20 lg:sticky lg:top-28 lg:self-start">
        <p className="mb-0 flex items-center gap-2 font-serif text-lg text-muted-foreground italic">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-chart-1" />
          {FEATURES_BLOCK.pill}
        </p>
        <h2 className="mt-3 mb-0 font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          <AccentTitle text={FEATURES_BLOCK.title} accent={FEATURES_BLOCK.accent} />
        </h2>
        <p className="mt-4 mb-0 max-w-md text-muted-foreground">{FEATURES_BLOCK.lead}</p>
        <ol className="mt-8 mb-0 hidden list-none gap-1 p-0 lg:grid">
          {FEATURE_CHAPTERS.map((feature, index) => (
            <li key={feature.slug}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={active === index ? "true" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active === index ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                )}
              >
                <span className={cn("font-heading text-sm tabular-nums transition-colors", active === index ? "text-chart-1" : "opacity-50")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm">{feature.title}</span>
              </button>
            </li>
          ))}
        </ol>
        {showCta ? (
          <SiteLinkButton to={SITE_FEATURES_PATH} size="xl" className="mt-8">{FEATURES_BLOCK.cta.label}</SiteLinkButton>
        ) : null}
      </aside>

      <div className="min-w-0 divide-y divide-border">
        {FEATURE_CHAPTERS.map((feature, index) => (
          <FeatureChapter key={feature.slug} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
}
