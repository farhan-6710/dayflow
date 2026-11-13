import { Link } from "react-router";

import type { SiteLinkButtonProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** The app's Button as an in-app link; `xl` is eatrrite's larger call-to-action size. */
export function SiteLinkButton({ to, variant = "default", size = "lg", className, children }: SiteLinkButtonProps) {
  return (
    <Button asChild variant={variant} size="lg" className={cn(size === "xl" && "h-11 px-7 text-[0.95rem]", className)}>
      <Link to={to}>{children}</Link>
    </Button>
  );
}
