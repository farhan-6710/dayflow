import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import { SHELL_HEADER_MOTION } from "@/shared/constants/pageMotion";
import { useTheme } from "@/shared/providers/ThemeProvider";
import type { ShellSidebarConfig } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

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

  return (
    <motion.header
      {...SHELL_HEADER_MOTION}
      className="flex h-16 w-full shrink-0 items-center gap-4 rounded-2xl border border-white/70 bg-white/60 px-4 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6 dark:border-white/10 dark:bg-card/50 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.06)]"
    >
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open navigation menu"
        className="inline-flex size-9 items-center justify-center rounded-xl border border-border md:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden size-9 items-center justify-center rounded-xl md:inline-flex"
      >
        <Menu className="size-4" aria-hidden="true" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ShellNavSearch
          nav={sidebarConfig.nav}
          placeholder={sidebarConfig.searchPlaceholder ?? "Search navigation..."}
        />
        {headerCenter}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {headerActions}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="size-4" aria-hidden="true" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={setDarkMode}
            aria-label="Toggle dark mode"
            className="cursor-pointer"
          />
          <Moon className="size-4" aria-hidden="true" />
        </div>
        {accountPath ? (
          <PortalUserHeaderMenu
            accountPath={accountPath}
            settingsPath={settingsPath}
            signOutRedirect={signOutRedirect}
          />
        ) : null}
      </div>
    </motion.header>
  );
}
