import type { AuthBrandPanelProps } from "@/shared/auth/types/components";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE, brandManifest } from "@/shared/brand/brandManifest";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { DayflowImage } from "@/shared/components/DayflowImage";

export function AuthBrandPanel({ config }: AuthBrandPanelProps) {
  const { features, subtitle } = brandManifest.portals[config.portal];

  return (
    <aside className="hidden flex-col justify-between gap-8 border-r border-sidebar-border bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
      <div className="flex items-center gap-2.5">
        <DayFlowLogo className="size-10" />
        <div className="leading-none">
          <p className="text-xl">{BRAND_NAME}</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg">
        <DayflowImage
          name={config.illustration}
          className="mb-6 w-full max-w-sm [@media(max-height:760px)]:max-w-56"
        />
        <p className="text-4xl leading-tight text-balance xl:text-5xl">{BRAND_TAGLINE}</p>
        <p className="mt-3 text-sidebar-foreground/70 text-pretty">{BRAND_DESCRIPTION}</p>
      </div>

      <ul className="grid gap-x-8 gap-y-3 text-sm xl:grid-cols-2 [@media(max-height:860px)]:hidden">
        {features.map((feature) => (
          <li key={feature.name}>
            <p>{feature.name}</p>
            <p className="text-xs text-sidebar-foreground/70">{feature.description}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
