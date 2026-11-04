import type { PageHeaderProps } from "@/shared/types/components";

export function PageHeader({ heading, description, backButton, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 min-w-0 space-y-3">
      {backButton ? <div className="flex items-center">{backButton}</div> : null}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{heading}</h1>
          {description ? (
            <div className="mt-2 max-w-2xl text-muted-foreground text-pretty">{description}</div>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
