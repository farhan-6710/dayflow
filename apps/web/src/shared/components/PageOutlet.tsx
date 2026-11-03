import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";

/** Scrollable main area: quick fade between routes, and each route starts at the top. */
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
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:py-8"
      >
        <Outlet />
      </motion.div>
    </main>
  );
}
