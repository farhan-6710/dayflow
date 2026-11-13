import { BlurInItem } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { PROCESS, PROCESS_STEPS } from "@/features/site/constants/homeContent";

/** Working process: four steps in cards on a row. */
export function ProcessSection() {
  return (
    <PageSection tone="paper" icons={FLOATING_ICONS.process} defer>
      <SectionIntro eyebrow={PROCESS.pill} title={PROCESS.title} count={PROCESS_STEPS.length} center />
      <ol className="mt-10 mb-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <BlurInItem
              key={step.num}
              delay={0.1 + index * 0.08}
              className="group relative h-full rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-chart-1/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-chart-1/15 text-chart-1 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-3xl text-chart-1/50 tabular-nums">{step.num}</span>
              </div>
              <h3 className="mt-5 mb-0 font-heading text-lg text-foreground">{step.title}</h3>
              <p className="mt-2 mb-0 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </BlurInItem>
          );
        })}
      </ol>
    </PageSection>
  );
}
