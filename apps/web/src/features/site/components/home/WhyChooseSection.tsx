import { BlurIn, BlurInItem } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { WHY } from "@/features/site/constants/homeContent";
import { DayflowImage } from "@/shared/components/DayflowImage";

/** Round art on the left, numbered reasons on the right. */
export function WhyChooseSection() {
  return (
    <PageSection id="why-dayflow" tone="card" icons={FLOATING_ICONS.why} defer>
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -left-24 size-[20rem] -translate-y-1/2 rounded-full bg-background/80 blur-3xl sm:size-[28rem]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <BlurIn className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="relative mx-auto flex aspect-square max-w-[26rem] items-center justify-center lg:max-w-none">
            <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-background" />
            <DayflowImage name="illo-sidebar-workspace" className="relative z-10 h-auto w-3/4 drop-shadow-sm" />
          </div>
        </BlurIn>
        <div className="min-w-0">
          <SectionIntro eyebrow={WHY.pill} title={WHY.title} />
          <ul className="mt-8 mb-0 grid list-none gap-6 p-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7">
            {WHY.items.map((item, index) => (
              <BlurInItem
                key={item.num}
                delay={0.1 + index * 0.06}
                className="group flex gap-4 border-t border-border pt-5 first:border-t-0 first:pt-0 sm:gap-5 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+2)]:pt-0"
              >
                <span aria-hidden="true" className="font-heading text-2xl text-chart-1/60 tabular-nums transition-colors group-hover:text-chart-1 sm:text-3xl">
                  {item.num}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 font-heading text-lg text-foreground sm:text-xl">{item.title}</h3>
                  <p className="mt-1.5 mb-0 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </BlurInItem>
            ))}
          </ul>
        </div>
      </div>
    </PageSection>
  );
}
