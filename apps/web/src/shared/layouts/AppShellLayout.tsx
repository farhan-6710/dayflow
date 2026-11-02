import { useRef, useState } from "react";
import { ShellHeader } from "@/shared/components/ShellHeader";
import {
  ShellMobileNavSheet,
  ShellSidebar,
} from "@/shared/components/ShellSidebar";
import {
  PageTransitionMain,
  PageTransitionProvider,
} from "@/shared/providers/PageTransitionProvider";
import type { AppShellLayoutProps } from "@/shared/types/components";
import { UnsavedChangesProvider } from "@/shared/unsaved-changes/UnsavedChangesProvider";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function AppShellLayout({
  sidebarConfig,
  accountPath,
  settingsPath,
  signOutRedirect,
  headerCenter,
  headerActions,
  mobileNavDescription,
}: AppShellLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  return (
    <UnsavedChangesProvider>
      <PageTransitionProvider>
        <TooltipProvider>
        <div className="fixed inset-0 flex w-full min-w-0 overflow-hidden bg-sidebar text-foreground">
          <div className="flex min-h-0 min-w-0 w-full flex-1">
            <ShellSidebar config={sidebarConfig} collapsed={isSidebarCollapsed} />

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-background md:m-2 md:ml-0 md:rounded-xl md:shadow-sm">
              <ShellHeader
                sidebarConfig={sidebarConfig}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                setIsMobileNavOpen={setIsMobileNavOpen}
                headerCenter={headerCenter}
                headerActions={headerActions}
                accountPath={accountPath}
                settingsPath={settingsPath}
                signOutRedirect={signOutRedirect}
              />

              <PageTransitionMain
                mainRef={mainRef}
                className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
              />
            </div>
          </div>
        </div>

        <ShellMobileNavSheet
          config={sidebarConfig}
          open={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
          sheetDescription={mobileNavDescription}
        />
        </TooltipProvider>
      </PageTransitionProvider>
    </UnsavedChangesProvider>
  );
}
