import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

/**
 * Without a `fallback` the page suspends up to `PageOutlet`, which keeps the previous page on screen
 * until the new one is ready. Each page then shows its own skeleton, so no generic one flashes first.
 */
export function lazyRoutePage(
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
  fallback?: ReactNode,
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
    return fallback ? (
      <Suspense fallback={fallback}>
        <LazyPage />
      </Suspense>
    ) : (
      <LazyPage />
    );
  };
}
