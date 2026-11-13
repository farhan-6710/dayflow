import { RouteTransitionWindow } from "@/shared/components/RouteTransitionWindow";
import { useRouteTransition } from "@/shared/hooks/useRouteTransition";

/** Shutter transition between shell routes. Must sit inside `UnsavedChangesProvider`. */
export function RouteTransition() {
  const isNavigating = useRouteTransition();
  return <RouteTransitionWindow isNavigating={isNavigating} />;
}
