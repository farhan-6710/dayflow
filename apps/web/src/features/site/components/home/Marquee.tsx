import { MARQUEE } from "@/features/site/constants/homeContent";

/** Endless band of feature names; the track holds two copies and slides by half. */
export function Marquee() {
  return (
    <div aria-hidden="true" className="group/marquee relative overflow-hidden bg-primary py-6 whitespace-nowrap text-primary-foreground">
      <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center font-heading text-[22px] leading-[1.4] md:text-[28px]">
            {MARQUEE.map((item) => (
              <span key={item} className="inline-flex items-center px-9 after:ml-18 after:text-[18px] after:text-chart-1 after:content-['✦']">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
