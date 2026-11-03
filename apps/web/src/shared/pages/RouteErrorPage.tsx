import { useRouteError } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { Button } from "@/shared/ui/button";

export function RouteErrorPage() {
  const error = useRouteError();
  console.error(error);

  const message = error instanceof Error ? error.message : "";
  const isChunkError =
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed");

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center">
      <DayflowImage name="illo-error" className="w-56 max-w-full" />
      <div className="space-y-2">
        <h1 className="text-3xl text-balance">
          {isChunkError ? "This page needs a refresh" : "Something went wrong"}
        </h1>
        <p className="text-muted-foreground text-pretty">
          {isChunkError
            ? "DayFlow was updated while this tab was open. Refresh to load the latest version."
            : "This page hit an unexpected error. Refresh to try again. Your saved work is safe."}
        </p>
      </div>
      <Button size="lg" onClick={() => window.location.reload()}>
        Refresh page
      </Button>
    </main>
  );
}
