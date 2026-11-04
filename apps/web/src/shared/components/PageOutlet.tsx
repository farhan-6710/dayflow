import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";

/** Scrollable main area. The key remounts each route, so it plays its entrance and starts at the top. */
export function PageOutlet() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main
      id="main-content"
      ref={mainRef}
      tabIndex={-1}
      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain outline-none"
    >
      <Suspense fallback={null}>
        <div key={pathname} className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </Suspense>
    </main>
  );
}
