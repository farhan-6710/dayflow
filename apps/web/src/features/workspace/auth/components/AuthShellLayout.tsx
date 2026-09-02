import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo } from "react";

import {
  BRAND_PROMOTION_BANNER,
  BRAND_PROMOTION_BANNER_ASPECT,
  BRAND_PROMOTION_BANNER_BACKDROP,
  resolveBrandPromotionBannerSrc,
} from "@/shared/constants/brandAssets";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { cn } from "@/shared/lib/utils";

type AuthShellLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthShellLayout({
  children,
  className,
}: AuthShellLayoutProps) {
  const { isDarkMode } = useTheme();
  const bannerSrc = resolveBrandPromotionBannerSrc(isDarkMode);

  const bannerColumnStyle = useMemo(
    (): CSSProperties => ({
      width: `min(50vw, calc(100dvh * ${BRAND_PROMOTION_BANNER_ASPECT}))`,
      backgroundColor: isDarkMode
        ? BRAND_PROMOTION_BANNER_BACKDROP.dark
        : BRAND_PROMOTION_BANNER_BACKDROP.light,
    }),
    [isDarkMode],
  );

  useEffect(() => {
    const { documentElement, body } = document;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background text-foreground lg:flex-row">
      <div
        className="relative hidden h-full shrink-0 overflow-hidden lg:flex lg:items-center lg:justify-center"
        style={bannerColumnStyle}
        aria-hidden="true"
      >
        <img
          src={bannerSrc}
          alt=""
          width={BRAND_PROMOTION_BANNER.width}
          height={BRAND_PROMOTION_BANNER.height}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="h-full w-full object-contain object-center"
        />
        <span className="sr-only">DayFlow</span>
      </div>

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col lg:h-full",
          className,
        )}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-contain px-6 py-5 sm:px-10 sm:py-6 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
