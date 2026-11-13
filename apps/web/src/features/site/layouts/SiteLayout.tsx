import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Header } from "@/features/site/components/layout/Header";
import { SiteFooter } from "@/features/site/components/layout/SiteFooter";

/** Public website: header, page, footer. Each new page starts at the top. */
export function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#site-main"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <Header />
      <main id="site-main">
        <Suspense fallback={<div className="min-h-dvh" />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
