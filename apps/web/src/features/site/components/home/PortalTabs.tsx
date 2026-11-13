import { useState } from "react";
import { Check, LayoutDashboard, Users } from "lucide-react";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { SiteLinkButton } from "@/features/site/components/section/SiteLinkButton";
import { brandManifest } from "@/shared/brand/brandManifest";
import { DayflowImage } from "@/shared/components/DayflowImage";
import { Button } from "@/shared/ui/button";

const PORTALS = [
  { key: "workspace", icon: LayoutDashboard, art: "illo-auth-workspace", to: WORKSPACE_DASHBOARD_PATH },
  { key: "client", icon: Users, art: "illo-auth-client", to: CLIENT_PORTAL_DASHBOARD_PATH },
] as const;

/** Eatrrite's program tabs: one tab per portal and a detail panel beside its art. */
export function PortalTabs() {
  const [active, setActive] = useState(0);
  const portal = PORTALS[active];
  const copy = brandManifest.portals[portal.key];
  const Icon = portal.icon;

  return (
    <>
      <BlurIn delay={0.1} className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist" aria-label="Portals">
        {PORTALS.map((item, index) => {
          const TabIcon = item.icon;
          return (
            <Button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={index === active}
              size="lg"
              variant={index === active ? "default" : "outline"}
              onClick={() => setActive(index)}
            >
              <TabIcon aria-hidden="true" />
              {brandManifest.portals[item.key].name}
            </Button>
          );
        })}
      </BlurIn>
      <BlurIn delay={0.15} className="mt-8">
        <div role="tabpanel" className="grid gap-8 rounded-xl border border-border bg-card p-6 md:grid-cols-2 md:p-8 lg:gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-chart-1/15 text-chart-1">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="m-0 font-heading text-2xl text-foreground">{copy.label}</h3>
            <p className="m-0 leading-relaxed text-muted-foreground">{copy.description}</p>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {copy.features.map((feature) => (
                <li key={feature.name} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-chart-1" aria-hidden="true" />
                  <span>
                    {feature.name}: <span className="text-muted-foreground">{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <SiteLinkButton to={portal.to} className="mt-2 self-start">Open {copy.name}</SiteLinkButton>
          </div>
          <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-lg bg-background p-6 sm:min-h-72">
            <DayflowImage name={portal.art} className="h-full max-h-80 w-auto" />
          </div>
        </div>
      </BlurIn>
    </>
  );
}
