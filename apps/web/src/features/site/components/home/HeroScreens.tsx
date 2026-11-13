import { m } from "framer-motion";

import { ScreenFrame } from "@/features/site/components/section/ScreenFrame";
import { SITE_SCREEN_ORDER, SITE_SCREEN_SIZE, SITE_SCREENS } from "@/features/site/constants/siteScreens";
import type { SiteScreenId } from "@/features/site/types/components";
import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const PILL_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

/** One tab per workspace page; the raised pill slides to the selected one. */
export function HeroScreenTabs({ active }: { active: SiteScreenId }) {
  return (
    <TabsList
      aria-label="Workspace pages"
      className="h-auto max-w-full flex-wrap gap-1 rounded-2xl border border-border bg-card/80 p-1.5 backdrop-blur-sm sm:rounded-full"
    >
      {SITE_SCREEN_ORDER.map((id) => (
        <TabsTrigger
          key={id}
          value={id}
          className="isolate flex-none rounded-full px-4 py-2 text-sm font-normal text-muted-foreground transition-colors data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
        >
          {active === id ? (
            <m.span
              layoutId="hero-screen-pill"
              transition={PILL_SPRING}
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full border border-border bg-background shadow-sm"
            />
          ) : null}
          {SITE_SCREENS[id].label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

/**
 * The workspace window under the hero: the selected page in the active theme, fading out at the bottom.
 * Every capture stays mounted so switching tabs crossfades instead of reloading.
 */
export function HeroScreenWindow() {
  const { isDark } = useThemeMode();

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <ScreenFrame>
        {SITE_SCREEN_ORDER.map((id, index) => {
          const screen = SITE_SCREENS[id];
          return (
            <TabsContent
              key={id}
              value={id}
              forceMount
              className="absolute inset-0 transition-[opacity,transform] duration-500 data-[state=inactive]:pointer-events-none data-[state=inactive]:scale-[0.99] data-[state=inactive]:opacity-0"
            >
              <img
                src={isDark ? screen.dark : screen.light}
                alt={screen.alt}
                width={SITE_SCREEN_SIZE.width}
                height={SITE_SCREEN_SIZE.height}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                draggable={false}
                className="size-full object-cover object-top select-none"
              />
            </TabsContent>
          );
        })}
      </ScreenFrame>
      {/* The window runs into the next section instead of ending on a hard edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
