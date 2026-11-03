import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { BRAND_LOGO_ICON } from "@/shared/constants/brandAssets";
import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { cn } from "@/shared/lib/utils";
import type { DayFlowLogoProps } from "@/shared/types/components";

export function DayFlowLogo({ className }: DayFlowLogoProps) {
  const { isDark } = useThemeMode();

  return (
    <img
      src={isDark ? BRAND_LOGO_ICON.dark : BRAND_LOGO_ICON.light}
      alt={BRAND_NAME}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
