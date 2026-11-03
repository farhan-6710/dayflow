import { useMatches } from "react-router";

import { EmptyState } from "@/shared/components/EmptyState";
import { PageHeader } from "@/shared/components/PageHeader";

/** Temporary stand-in for routes whose page is built in a later phase. */
export function PlaceholderPage() {
  const match = useMatches().at(-1);
  const title = (match?.handle as { title?: string } | undefined)?.title ?? "DayFlow";

  return (
    <>
      <PageHeader heading={title} />
      <EmptyState
        image="icon-extra-sparkles"
        title="Not built yet"
        description="This page arrives in a later phase of the rebuild."
      />
    </>
  );
}
