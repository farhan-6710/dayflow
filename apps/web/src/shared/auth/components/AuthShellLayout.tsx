import { AuthBrandPanel } from "@/shared/auth/components/AuthBrandPanel";
import type { AuthShellLayoutProps } from "@/shared/auth/types/components";
import { BRAND_NAME, brandManifest } from "@/shared/brand/brandManifest";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function AuthShellLayout({ config, children }: AuthShellLayoutProps) {
  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-[1.1fr_1fr]">
      <AuthBrandPanel config={config} />
      <main className="flex min-w-0 flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2.5 lg:hidden">
            <DayFlowLogo className="size-10" />
            <div className="leading-none">
              <p className="text-xl">{BRAND_NAME}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {brandManifest.portals[config.portal].subtitle}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
