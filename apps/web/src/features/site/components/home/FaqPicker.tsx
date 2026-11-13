import { useState } from "react";

import { FAQ } from "@/features/site/constants/faqContent";
import type { FaqPickerProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** Question rail on one side, answer card on the other. */
export function FaqPicker({ items }: FaqPickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
      <div aria-live="polite" className="order-2 flex flex-col justify-center rounded-xl border border-chart-1/30 bg-background p-6 sm:p-8 lg:order-none">
        <p className="m-0 font-serif text-lg text-muted-foreground italic">{FAQ.aside}</p>
        <p className="mt-2 mb-0 text-xs text-muted-foreground tabular-nums">
          Question {pad(activeIndex + 1)} of {pad(items.length)}
        </p>
        <p aria-hidden="true" className="mt-4 mb-0 font-heading text-xl text-foreground sm:text-2xl">{active.q}</p>
        <p className="mt-4 mb-0 text-sm leading-relaxed text-muted-foreground sm:text-base">{active.a}</p>
      </div>
      <ol className="relative order-1 m-0 grid list-none gap-1 border-l border-border pl-5 lg:order-none">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <li key={item.q} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 -left-[1.53rem] size-2.5 -translate-y-1/2 rounded-full border-2 border-card transition-colors",
                  selected ? "bg-chart-1" : "bg-border",
                )}
              />
              <h3 className="m-0 text-base font-normal">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full cursor-pointer items-start justify-between gap-3 rounded-md px-3 py-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    selected ? "bg-background text-foreground" : "text-muted-foreground hover:bg-background hover:text-foreground",
                  )}
                >
                  <span className="font-heading text-base leading-snug sm:text-lg">{item.q}</span>
                  <span className="shrink-0 pt-1 text-xs tabular-nums opacity-60">{pad(index + 1)}</span>
                </button>
              </h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
