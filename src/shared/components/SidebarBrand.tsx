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
        alt="DayFlow"
        className={cn("size-9.75 shrink-0 object-contain", className)}
      />
    );
  }

  return (
    <div className={cn("flex w-fit min-w-0 items-center gap-3", className)}>
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0 object-contain"
      />
      <div
        className="h-9 w-px shrink-0 bg-sidebar-border/80"
        aria-hidden="true"
      />
      <div className="min-w-0 shrink-0">
        <p className="font-serif text-[1.35rem] font-semibold leading-none tracking-[0.02em] text-sidebar-foreground">
          DayFlow
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.1em] text-muted-foreground text-center">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
