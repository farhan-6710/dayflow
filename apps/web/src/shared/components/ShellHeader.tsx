import { Menu } from "lucide-react";

import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import { Reveal } from "@/shared/components/Reveal";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import type { ShellHeaderProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function ShellHeader({
  sidebarConfig,
  signOutRedirect,
  headerActions,
  onOpenMobileNav,
}: ShellHeaderProps) {
  return (
    <Reveal as="header" kind="shell-down" className="flex h-16 shrink-0 items-center gap-1 border-b border-border bg-background px-3 sm:gap-2 md:gap-3 md:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <Menu aria-hidden="true" />
      </Button>

      <Breadcrumbs nav={sidebarConfig.nav} homeLink={sidebarConfig.homeLink} className="mr-auto hidden flex-1 md:block" />

      <ShellNavSearch nav={sidebarConfig.nav} placeholder={sidebarConfig.searchPlaceholder} />

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        {headerActions}
        <PortalUserHeaderMenu
          settingsPath={sidebarConfig.profilePath}
          signOutRedirect={signOutRedirect}
        />
      </div>
    </Reveal>
  );
}
