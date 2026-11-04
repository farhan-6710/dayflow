import { Reveal } from "@/shared/components/Reveal";
import type { PageHeaderProps } from "@/shared/types/components";

export function PageHeader({ leading, heading, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 min-w-0">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {leading ? (
            <Reveal kind="hero" className="shrink-0">
              {leading}
            </Reveal>
          ) : null}
          <div className="min-w-0">
            <Reveal kind="hero">
              <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
            </Reveal>
            {description ? (
              <Reveal kind="hero" className="mt-2 max-w-2xl text-muted-foreground text-pretty">
                {description}
              </Reveal>
            ) : null}
          </div>
        </div>
        {actions ? (
          <Reveal kind="hero" className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
