import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import {
  SHELL_HEADER_ITEM,
  SHELL_HEADER_MOTION,
  SHELL_STAGGER,
} from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
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
      className={cn(
        "flex h-14 w-full min-w-0 shrink-0 items-center gap-2 px-2 sm:h-16 sm:gap-4 sm:px-6",
        glassPanelClassName,
      )}
    >
      <motion.div
        className="flex w-full min-w-0 items-center gap-2 sm:gap-4"
        {...SHELL_STAGGER}
      >
        <motion.div variants={SHELL_HEADER_ITEM} className="shrink-0">
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
        </motion.div>

        <motion.div
          variants={SHELL_HEADER_ITEM}
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4"
        >
          <ShellNavSearch
            nav={sidebarConfig.nav}
            placeholder={sidebarConfig.searchPlaceholder ?? "Search navigation..."}
          />
          {headerCenter}
        </motion.div>

        <motion.div
          variants={SHELL_HEADER_ITEM}
          className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3"
        >
          {headerActions}
          <div className="flex items-center gap-1.5 text-muted-foreground sm:gap-2">
            <Sun className="hidden size-4 min-[360px]:block" aria-hidden="true" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setDarkMode}
              aria-label="Toggle dark mode"
              className="cursor-pointer"
            />
            <Moon className="hidden size-4 min-[360px]:block" aria-hidden="true" />
          </div>
          {accountPath ? (
            <PortalUserHeaderMenu
              accountPath={accountPath}
              settingsPath={settingsPath}
              signOutRedirect={signOutRedirect}
            />
          ) : null}
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
