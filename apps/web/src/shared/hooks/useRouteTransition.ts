import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";

import { ROUTE_TRANSITION_ANIMATION as ANIM } from "@/shared/constants/routeTransition";
import { useUnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";

/** The in-app destination of a plain left click on a link, or null to let the click through. */
function transitionTarget(event: MouseEvent, currentPathname: string): string | null {
  if (event.defaultPrevented || event.button !== 0) {
    return null;
  }
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null;
  }
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) {
    return null;
  }
  if (anchor.target && anchor.target !== "_self") {
    return null;
  }
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === currentPathname) {
    return null;
  }
  return url.pathname + url.search + url.hash;
}

/**
 * Plays the shutter transition on every in-app link click: closes the shutters,
 * navigates once they meet, and reports `false` again when the new route has rendered.
 */
export function useRouteTransition(): boolean {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { isDirty } = useUnsavedChangesContext();

  const stateRef = useRef({ pathname: location.pathname, isDirty, reducedMotion, busy: false });
  useEffect(() => {
    stateRef.current = { ...stateRef.current, pathname: location.pathname, isDirty, reducedMotion };
  }, [location.pathname, isDirty, reducedMotion]);

  useEffect(() => {
    let pushTimer: number | undefined;

    function onClick(event: MouseEvent) {
      const state = stateRef.current;
      // Dirty forms keep their unsaved-changes prompt; reduced motion skips the effect.
      if (state.isDirty || state.reducedMotion) {
        return;
      }
      const target = transitionTarget(event, state.pathname);
      if (!target) {
        return;
      }
      // Stops the router link's own navigation; its other click handlers still run.
      event.preventDefault();
      if (state.busy) {
        return;
      }
      stateRef.current = { ...state, busy: true };
      setIsNavigating(true);
      pushTimer = window.setTimeout(() => void navigate(target), ANIM.ROUTER_PUSH_DELAY_MS);
    }

    // Capture phase, so it runs before React Router's link handler.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(pushTimer);
    };
  }, [navigate]);

  useEffect(() => {
    stateRef.current = { ...stateRef.current, busy: false };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the new route has rendered
    setIsNavigating(false);
  }, [location.key]);

  return isNavigating;
}
