import { resolveBrandLogoSrc } from "@/shared/constants/brandAssets";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { cn } from "@/shared/lib/utils";

type DayFlowLogoProps = {
  variant?: "full" | "icon";
  subtitle?: string;
  className?: string;
  imageClassName?: string;
};

export function DayFlowLogo({
  variant = "full",
  subtitle,
  className,
  imageClassName,
}: DayFlowLogoProps) {
  const { isDarkMode } = useTheme();
  const src = resolveBrandLogoSrc(isDarkMode, variant);

  const image = (
    <img
      src={src}
      alt="DayFlow"
      className={cn(
        "object-contain object-left",
        variant === "icon" ? "size-9.75" : "h-10 w-auto max-w-[12rem]",
        imageClassName,
      )}
    />
  );

  if (variant === "icon" || !subtitle) {
    return <div className={cn("flex shrink-0", className)}>{image}</div>;
  }

  return (
    <div className={cn("relative w-fit shrink-0", className)}>
      {image}
      <p
        className="pointer-events-none absolute -bottom-1 left-[45.5%] text-[7px] font-semibold uppercase leading-none tracking-[0.16em] text-muted-foreground"
        aria-hidden="true"
      >
        {subtitle}
      </p>
    </div>
  );
}
