import { dayflowImageSrc } from "@/shared/constants/dayflowImages";
import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { cn } from "@/shared/lib/utils";
import type { DayflowImageProps } from "@/shared/types/components";

/** Custom 3D art: picks the file matching the active theme. Decorative unless `alt` is given. */
export function DayflowImage({ name, alt = "", className }: DayflowImageProps) {
  const { isDark } = useThemeMode();

  return (
    <img
      src={dayflowImageSrc(name, isDark)}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("object-contain select-none", className)}
    />
  );
}
