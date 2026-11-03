import type { PageHeaderProps } from "@/shared/types/components";

export function PageHeader({ eyebrow, heading, description, backButton, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 min-w-0 space-y-3 lg:mb-8">
      {backButton ? <div className="flex items-center">{backButton}</div> : null}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="mb-1 text-sm text-muted-foreground">{eyebrow}</p> : null}
          <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
