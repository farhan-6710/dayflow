import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Moon, PanelLeft, Sun } from "lucide-react";
import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import { useTheme } from "@/shared/providers/ThemeProvider";
import type { ShellSidebarConfig } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export type ShellHeaderProps = {
  sidebarConfig: ShellSidebarConfig;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  setIsMobileNavOpen: Dispatch<SetStateAction<boolean>>;
  headerCenter?: ReactNode;
  headerActions?: ReactNode;
  accountPath?: string;
  settingsPath?: string;
  signOutRedirect?: string;
};

export function ShellHeader({
  sidebarConfig,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileNavOpen,
  headerCenter,
  headerActions,
  accountPath,
  settingsPath,
  signOutRedirect,
}: ShellHeaderProps) {
  const { isDarkMode, setDarkMode } = useTheme();
  const ThemeIcon = isDarkMode ? Sun : Moon;

  return (
    <header className="animate-shell-down sticky top-0 z-10 flex h-14 w-full min-w-0 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md rounded-t-xl">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open navigation menu"
        className="-ml-1 md:hidden"
      >
        <PanelLeft aria-hidden="true" />
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="-ml-1 hidden md:inline-flex"
          >
            <PanelLeft aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
      </Tooltip>
      <div className="mr-1 h-4 w-px shrink-0 bg-border" aria-hidden="true" />

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <ShellNavSearch
          nav={sidebarConfig.nav}
          placeholder={sidebarConfig.searchPlaceholder ?? "Search navigation..."}
          className="max-w-sm"
        />
        {headerCenter}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3">
        {headerActions}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="size-9 rounded-md p-0"
            >
              <ThemeIcon aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isDarkMode ? "Light mode" : "Dark mode"}
          </TooltipContent>
        </Tooltip>
        {accountPath ? (
          <PortalUserHeaderMenu
            accountPath={accountPath}
            settingsPath={settingsPath}
            signOutRedirect={signOutRedirect}
          />
        ) : null}
      </div>
    </header>
  );
}
