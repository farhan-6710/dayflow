import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Link } from "react-router";

import { SITE_HOME_PATH } from "@/app/constants/siteRoutes";
import { HeaderNavLinks } from "@/features/site/components/layout/HeaderNavLinks";
import { MenuToggle } from "@/features/site/components/layout/MenuToggle";
import { WorkspaceButton } from "@/features/site/components/layout/WorkspaceButton";
import { HEADER_EASE } from "@/features/site/constants/siteMotion";
import { useScrolled } from "@/features/site/hooks/useScrolled";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { cn } from "@/shared/lib/utils";

const transition = { duration: 0.45, ease: HEADER_EASE };

/** Full-width bar at the top; once the page scrolls it shrinks into a floating rounded pill. */
const BAR = { maxWidth: 1240, marginTop: 0, paddingTop: 14, paddingBottom: 14, borderRadius: 0 };
const PILL = { maxWidth: 1100, marginTop: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20 };

export function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 flow-root px-2">
      <m.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 border-b border-border bg-card"
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={transition}
      />
      <m.nav
        aria-label="Main"
        className={cn(
          "mx-auto w-full border px-4 transition-[background-color,border-color,box-shadow] duration-500 sm:px-5",
          scrolled
            ? cn("border-border shadow-lg backdrop-blur-xl backdrop-saturate-150", open ? "bg-card/95" : "bg-card/70")
            : "border-transparent bg-transparent",
        )}
        initial={false}
        animate={scrolled ? PILL : BAR}
        transition={transition}
      >
        <div className="flex items-center justify-between gap-5">
          <Link to={SITE_HOME_PATH} onClick={close} className="flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <DayFlowLogo className="size-10" />
            <span className="font-heading text-xl text-foreground">{BRAND_NAME}</span>
          </Link>
          <div className="hidden lg:block">
            <HeaderNavLinks />
          </div>
          <div className="hidden lg:block">
            <WorkspaceButton />
          </div>
          <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
        <AnimatePresence initial={false}>
          {open ? (
            <m.div
              key="menu"
              className="overflow-hidden lg:hidden"
              initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(6px)" }}
              transition={transition}
            >
              <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 pb-1">
                <HeaderNavLinks mobile onNavigate={close} />
                <WorkspaceButton className="w-full" onClick={close} />
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.nav>
    </header>
  );
}
