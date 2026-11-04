import { createContext, useContext, useEffect } from "react";

import type { BreadcrumbItem } from "@/shared/types/components";

export const BreadcrumbTrailContext = createContext<{
  trail: BreadcrumbItem[];
  setTrail: (trail: BreadcrumbItem[]) => void;
}>({ trail: [], setTrail: () => undefined });

/** Adds a detail page's own steps after its section in the header breadcrumbs. */
export function usePageBreadcrumbs(items: BreadcrumbItem[]) {
  const { setTrail } = useContext(BreadcrumbTrailContext);
  const key = JSON.stringify(items);

  useEffect(() => {
    setTrail(JSON.parse(key) as BreadcrumbItem[]);
    return () => setTrail([]);
  }, [key, setTrail]);
}
