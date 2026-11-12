import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { Button } from "@/shared/ui/button";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function isInside(rect: DOMRect, x: number, y: number): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function ThemeToggle() {
  const { isDark, setDarkMode } = useThemeMode();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const transitionRef = useRef<ViewTransition | null>(null);
  const [animating, setAnimating] = useState(false);
  const Icon = isDark ? Sun : Moon;

  // Applies the class now as well as through next-themes, so the view transition captures the new theme.
  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    setDarkMode(dark);
  };

  // The new theme grows as a circle from the button's centre (see `theme-reveal` in index.css).
  const switchTheme = (dark: boolean) => {
    const button = buttonRef.current;
    if (!button || !document.startViewTransition || window.matchMedia(REDUCED_MOTION).matches) {
      applyTheme(dark);
      return;
    }
    const { left, top, width, height } = button.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${left + width / 2}px`);
    root.style.setProperty("--theme-y", `${top + height / 2}px`);
    // A click mid-animation finishes the running switch at once and starts the next one.
    transitionRef.current?.skipTransition();
    const transition = document.startViewTransition(() => flushSync(() => applyTheme(dark)));
    transitionRef.current = transition;
    setAnimating(true);
    void transition.finished.finally(() => {
      if (transitionRef.current !== transition) {
        return;
      }
      transitionRef.current = null;
      setAnimating(false);
    });
  };

  // While a view transition runs, the browser sends every click to <html>, not to the page. Catch
  // clicks that land on the toggle's spot so it stays usable for the next switch.
  useEffect(() => {
    if (!animating) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const button = buttonRef.current;
      if (!button || !isInside(button.getBoundingClientRect(), event.clientX, event.clientY)) {
        return;
      }
      event.preventDefault();
      switchTheme(!document.documentElement.classList.contains("dark"));
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  });

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon-lg"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => switchTheme(!isDark)}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
