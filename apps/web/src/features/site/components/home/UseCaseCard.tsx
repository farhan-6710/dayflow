import type { UseCaseCardProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

const initials = (role: string) =>
  role
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

/** Eatrrite's testimonial card, holding a typical use case instead of a quote. */
export function UseCaseCard({ item, index, focused }: UseCaseCardProps) {
  return (
    <article
      className={cn(
        "relative h-full overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-500 ease-out",
        focused ? "z-10 scale-100 opacity-100 shadow-md lg:scale-[1.04]" : "scale-[0.97] opacity-70 lg:scale-[0.95]",
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-3 -right-1 font-heading text-7xl leading-none text-chart-1/30">”</span>
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-chart-1 bg-background font-heading text-sm text-foreground">
            {initials(item.role)}
          </span>
          <div>
            <h3 className="m-0 font-heading text-base text-foreground">{item.role}</h3>
            <p className="m-0 text-xs text-muted-foreground">{item.focus}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground/70 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="relative mt-4 mb-0 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
    </article>
  );
}
