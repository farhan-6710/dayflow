import type { ReactNode } from "react";

import {
  BRAND_DESCRIPTION,
  BRAND_TAGLINE,
  brandManifest,
  type BrandPortalKey,
} from "@/shared/brand/brandManifest";
import { SidebarBrand } from "@/shared/components/SidebarBrand";
import { cn } from "@/shared/lib/utils";

type AuthShellLayoutProps = {
  children: ReactNode;
  /** Which portal's feature highlights the brand panel lists. */
  portal?: BrandPortalKey;
  className?: string;
};

function AuthBrandPanel({ portal }: { portal: BrandPortalKey }) {
  const { features, subtitle } = brandManifest.portals[portal];

  return (
    <aside className="relative hidden overflow-hidden border-r bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <SidebarBrand subtitle={subtitle} className="animate-hero" />

      <div className="animate-hero relative max-w-md space-y-6">
        <p className="font-heading text-4xl leading-tight text-balance">{BRAND_TAGLINE}</p>
        <p className="text-sm text-muted-foreground">{BRAND_DESCRIPTION}</p>
      </div>

      <ol className="animate-hero relative grid gap-3 text-sm">
        {features.map((feature) => (
          <li key={feature.name} className="flex items-baseline gap-3">
            <span className="w-32 shrink-0 text-xs text-muted-foreground">{feature.name}</span>
            <span className="truncate">{feature.description}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function AuthShellLayout({
  children,
  portal = "workspace",
  className,
}: AuthShellLayoutProps) {
  return (
    <div className="grid h-svh overflow-y-auto overscroll-y-contain bg-background text-foreground lg:grid-cols-[1.1fr_1fr]">
      <AuthBrandPanel portal={portal} />
      <main className={cn("relative flex flex-col p-6 sm:p-10", className)}>
        <div className="flex items-center lg:invisible">
          <SidebarBrand subtitle={brandManifest.portals[portal].subtitle} />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
