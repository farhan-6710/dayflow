import { useRef, useState } from "react";
import { Blob } from "@/shared/components/Blob";
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
        <div className="fixed inset-0 isolate flex w-full overflow-hidden bg-background p-2 text-foreground sm:p-3 md:gap-3.5 md:p-3.5">
          <Blob />
          <ShellSidebar config={sidebarConfig} collapsed={isSidebarCollapsed} />

          <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-2.5 overflow-hidden sm:gap-3 md:gap-3.5">
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
              className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-1 scrollbar-gutter-stable sm:px-2"
            />
          </div>
        </div>

        <ShellMobileNavSheet
          config={sidebarConfig}
          open={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
          sheetDescription={mobileNavDescription}
        />
      </PageTransitionProvider>
    </UnsavedChangesProvider>
  );
}
