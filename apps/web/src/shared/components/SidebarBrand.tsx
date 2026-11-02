import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { resolveBrandLogoSrc } from "@/shared/constants/brandAssets";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { cn } from "@/shared/lib/utils";

type SidebarBrandProps = {
  subtitle?: string;
  collapsed?: boolean;
  className?: string;
};

export function SidebarBrand({
  subtitle,
  collapsed = false,
  className,
}: SidebarBrandProps) {
  const { isDarkMode } = useTheme();
  const iconSrc = resolveBrandLogoSrc(isDarkMode, "icon");

  if (collapsed) {
    return (
      <img
        src={iconSrc}
        alt={BRAND_NAME}
        className={cn("size-9 shrink-0 object-contain", className)}
      />
    );
  }

  return (
    <div className={cn("flex h-14 w-fit min-w-0 items-center gap-2.5", className)}>
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="size-11 shrink-0 object-contain"
      />
      <div
        className="h-7 w-px shrink-0 self-center bg-sidebar-border"
        aria-hidden="true"
      />
      <div className="min-w-0 shrink-0">
        <p className="font-heading text-[1.6rem] leading-none tracking-tight text-sidebar-foreground">
          {BRAND_NAME}
        </p>
        {subtitle ? (
          <p className="mt-1 text-[0.6rem] font-medium uppercase leading-none tracking-[0.12em] text-primary-text">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
