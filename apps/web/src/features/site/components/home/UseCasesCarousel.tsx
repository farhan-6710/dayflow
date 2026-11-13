import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { UseCaseCard } from "@/features/site/components/home/UseCaseCard";
import { USE_CASE_ITEMS } from "@/features/site/constants/homeContent";
import { TESTIMONIAL_AUTOPLAY_MS } from "@/features/site/constants/siteMotion";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Looping carousel with autoplay and a focused centre card. */
export function UseCasesCarousel() {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    reducedMotion ? [] : [Autoplay({ delay: TESTIMONIAL_AUTOPLAY_MS, stopOnInteraction: true })],
  );

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative" aria-roledescription="carousel">
      <div className="overflow-hidden px-2" ref={emblaRef}>
        <div className="flex touch-pan-y items-stretch py-10 sm:py-12">
          {USE_CASE_ITEMS.map((item, index) => (
            <div key={item.role} className="min-w-0 shrink-0 grow-0 basis-full px-2 sm:basis-1/2 lg:basis-1/3">
              <UseCaseCard item={item} index={index} focused={index === selected} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <Button type="button" variant="outline" size="icon-lg" aria-label="Previous use case" onClick={() => emblaApi?.scrollPrev()}>
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex gap-1.5">
          {USE_CASE_ITEMS.map((item, index) => (
            <button
              key={item.role}
              type="button"
              aria-label={`Show use case ${index + 1}`}
              aria-current={index === selected ? "true" : undefined}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "size-2 cursor-pointer rounded-full transition-all",
                index === selected ? "w-5 bg-chart-1" : "bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
        <Button type="button" variant="outline" size="icon-lg" aria-label="Next use case" onClick={() => emblaApi?.scrollNext()}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
