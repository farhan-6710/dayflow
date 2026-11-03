import { CircleAlert } from "lucide-react";

import type { ErrorBannerProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
    >
      <CircleAlert className="size-4 shrink-0 text-destructive" aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
