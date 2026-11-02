import { EyebrowPill } from "@/shared/components/EyebrowPill";
import type { PageHeaderProps } from "@/shared/types/components";

/** Each line blurs in on mount, staggered (`animate-hero`). */
export function PageHeader({
  eyebrow,
  heading,
  description,
  backButton,
  actions,
}: PageHeaderProps) {
  const hasTitleBlock = Boolean(eyebrow || heading || description);

  return (
    <header className="mb-8 w-full min-w-0 space-y-4">
      {backButton ? (
        <div className="animate-hero flex items-center">{backButton}</div>
      ) : null}

      {hasTitleBlock || actions ? (
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {hasTitleBlock ? (
            <div className="min-w-0">
              {eyebrow ? (
                <EyebrowPill className="animate-hero">{eyebrow}</EyebrowPill>
              ) : null}
              {heading ? (
                <h1
                  className={
                    eyebrow
                      ? "animate-hero mt-3 text-4xl leading-tight font-bold sm:text-[2.75rem]"
                      : "animate-hero text-4xl leading-tight font-bold sm:text-[2.75rem]"
                  }
                >
                  {heading}
                </h1>
              ) : null}
              {description ? (
                <p className="animate-hero mt-2 max-w-2xl text-sm text-pretty text-foreground/80">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}
          {actions ? (
            <div
              className={
                hasTitleBlock
                  ? "animate-hero flex min-w-0 shrink-0 flex-wrap items-center gap-2"
                  : "animate-hero w-full min-w-0"
              }
            >
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
