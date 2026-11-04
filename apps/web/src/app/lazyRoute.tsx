import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

import { PageSkeleton } from "@/shared/components/PageSkeleton";

export function lazyRoutePage(
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
  fallback: ReactNode = <PageSkeleton />,
) {
  const LazyPage = lazy(() =>
    loader().then((module) => {
      const component = module[exportName];
      if (!component) {
        throw new Error(`Missing export "${exportName}" in lazy route module.`);
      }
      return { default: component };
    }),
  );

  return function LazyRoutePage() {
    return (
      <Suspense fallback={fallback}>
        <LazyPage />
      </Suspense>
    );
  };
}
