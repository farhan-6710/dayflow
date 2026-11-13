import { FloatingIcons } from "@/features/site/components/section/FloatingIcons";
import type { PageSectionProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

/** One website section: alternating paper tone, bottom hairline, faint drifting icons behind. */
export function PageSection({ id, tone, icons, defer = false, className, children }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Overflow stays visible so sticky children (the features rail) can pin.
        "relative border-b border-border py-20",
        tone === "card" ? "bg-card" : "bg-background",
        defer && "defer-section",
        className,
      )}
    >
      <FloatingIcons items={icons} />
      <div className="site-container relative z-10">{children}</div>
    </section>
  );
}
