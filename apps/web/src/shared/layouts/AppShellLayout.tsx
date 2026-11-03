import { useState } from "react";

import { PageOutlet } from "@/shared/components/PageOutlet";
import { ShellHeader } from "@/shared/components/ShellHeader";
import { ShellMobileNavSheet } from "@/shared/components/ShellMobileNavSheet";
import { ShellSidebar } from "@/shared/components/ShellSidebar";
import { useSidebarCollapsed } from "@/shared/hooks/useSidebarCollapsed";
import type { AppShellLayoutProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { UnsavedChangesProvider } from "@/shared/unsaved-changes/UnsavedChangesProvider";

export function AppShellLayout({
  sidebarConfig,
  signOutRedirect,
  headerActions,
  mobileNavDescription,
}: AppShellLayoutProps) {
  const { collapsed, toggle } = useSidebarCollapsed();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <UnsavedChangesProvider>
      <TooltipProvider delayDuration={200}>
        <a
          href="#main-content"
          className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <div className="fixed inset-0 flex min-w-0 overflow-hidden bg-background text-foreground">
          <ShellSidebar config={sidebarConfig} collapsed={collapsed} />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <ShellHeader
              sidebarConfig={sidebarConfig}
              signOutRedirect={signOutRedirect}
              headerActions={headerActions}
              isSidebarCollapsed={collapsed}
              onToggleSidebar={toggle}
              onOpenMobileNav={() => setIsMobileNavOpen(true)}
            />
            <PageOutlet />
          </div>
        </div>
        <ShellMobileNavSheet
          config={sidebarConfig}
          open={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
          description={mobileNavDescription}
        />
      </TooltipProvider>
    </UnsavedChangesProvider>
  );
}
