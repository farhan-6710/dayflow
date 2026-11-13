import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { ScreenFrame } from "@/features/site/components/section/ScreenFrame";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { SITE_SCREEN_ORDER, SITE_SCREEN_SIZE, SITE_SCREENS } from "@/features/site/constants/siteScreens";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/shared/brand/brandManifest";
import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const FIRST_SCREEN = SITE_SCREEN_ORDER[0];

/** One pill per workspace page; the active one is raised like a card on the track. */
function ScreenTabs() {
  return (
    <TabsList
      aria-label="Workspace pages"
      className="h-auto max-w-full flex-wrap gap-1 rounded-2xl border border-border bg-card p-1.5 sm:rounded-full"
    >
      {SITE_SCREEN_ORDER.map((id) => (
        <TabsTrigger
          key={id}
          value={id}
          className="flex-none rounded-full px-4 py-2 text-sm font-normal text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:border-border dark:data-[state=active]:bg-background"
        >
          {SITE_SCREENS[id].label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

/**
 * The workspace window under the hero: a slim title bar, then the selected page in the active theme, fading
 * out at the bottom. Every capture stays mounted so switching tabs crossfades instead of reloading.
 */
function ScreenWindow() {
  const { isDark } = useThemeMode();

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <ScreenFrame>
        {SITE_SCREEN_ORDER.map((id) => {
          const screen = SITE_SCREENS[id];
          return (
            <TabsContent
              key={id}
              value={id}
              forceMount
              className="absolute inset-0 transition-opacity duration-500 data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0"
            >
              <img
                src={isDark ? screen.dark : screen.light}
                alt={screen.alt}
                width={SITE_SCREEN_SIZE.width}
                height={SITE_SCREEN_SIZE.height}
                fetchPriority={id === FIRST_SCREEN ? "high" : "low"}
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

/** Centered hero: tagline, description, both portals, then tabs that switch the workspace window below. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-16 lg:pt-24">
      <Tabs defaultValue={FIRST_SCREEN} className="block">
        <div className="site-container relative flex flex-col items-center text-center">
          <BlurIn immediate>
            <h1 className="m-0 max-w-4xl font-heading text-[clamp(40px,7vw,80px)] leading-[1.05] tracking-tight text-balance">
              {BRAND_TAGLINE}
            </h1>
          </BlurIn>
          <BlurIn immediate delay={0.1}>
            <p className="mx-auto mt-6 mb-0 max-w-2xl text-lg text-muted-foreground text-pretty">{BRAND_DESCRIPTION}</p>
          </BlurIn>
          <BlurIn immediate delay={0.2} className="mt-9 flex flex-wrap justify-center gap-3">
            <SiteLinkButton to={WORKSPACE_DASHBOARD_PATH} size="xl">Open Workspace</SiteLinkButton>
            <SiteLinkButton to={CLIENT_PORTAL_DASHBOARD_PATH} variant="outline" size="xl">Client Portal</SiteLinkButton>
          </BlurIn>
          <BlurIn immediate delay={0.3} className="mt-12 flex max-w-full justify-center">
            <ScreenTabs />
          </BlurIn>
        </div>
        <BlurIn immediate delay={0.4} y={40} duration={0.95} className="site-container relative mt-10">
          <ScreenWindow />
        </BlurIn>
      </Tabs>
    </section>
  );
}
