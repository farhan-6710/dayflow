import { Loader2 } from "lucide-react";

export function CenteredLoading() {
  return (
    <div role="status" className="flex min-h-svh items-center justify-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
