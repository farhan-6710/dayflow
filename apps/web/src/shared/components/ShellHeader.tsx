import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import type { ShellHeaderProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function ShellHeader({
  sidebarConfig,
  signOutRedirect,
  headerActions,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileNav,
}: ShellHeaderProps) {
  const CollapseIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <header className="flex h-16 shrink-0 items-center gap-1 border-b border-border bg-background px-3 sm:gap-2 md:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <Menu aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-lg"
        className="-ml-2 hidden lg:inline-flex"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isSidebarCollapsed}
        onClick={onToggleSidebar}
      >
        <CollapseIcon aria-hidden="true" />
      </Button>

      <ShellNavSearch nav={sidebarConfig.nav} placeholder={sidebarConfig.searchPlaceholder} />

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <ThemeToggle />
        {headerActions}
        <PortalUserHeaderMenu
          settingsPath={sidebarConfig.profilePath}
          signOutRedirect={signOutRedirect}
        />
      </div>
    </header>
  );
}
