import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { SITE_HOW_IT_WORKS_PATH } from "@/app/constants/siteRoutes";
import { INTRO_STRIP } from "@/features/site/constants/homeContent";

/** One-line strip under the hero (eatrrite's credentials strip). */
export function IntroStrip() {
  return (
    <div className="border-b border-border bg-background">
      <div className="site-container py-4">
        <Link
          to={SITE_HOW_IT_WORKS_PATH}
          className="group flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-foreground"
        >
          <span>{INTRO_STRIP}</span>
          <ArrowRight aria-hidden="true" className="size-4 text-chart-1 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
