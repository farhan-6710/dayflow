import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import type { BackLinkProps } from "@/shared/types/components";

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="-ml-1 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
