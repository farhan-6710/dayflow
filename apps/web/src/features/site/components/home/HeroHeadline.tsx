import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { AccentText } from "@/features/site/components/section/AccentText";
import { TAGLINE } from "@/features/site/constants/homeContent";
import { ASSISTANT_NAME } from "@/features/workspace/assistant/constants/assistantSuggestions";

/** Small pill above the headline pointing at the AI assistant, with a live dot. */
export function HeroBadge() {
  return (
    <Link
      to={WORKSPACE_DASHBOARD_PATH}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 py-1.5 pr-3 pl-2 text-sm text-muted-foreground backdrop-blur-sm transition-colors outline-none hover:border-chart-1/40 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-1 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-chart-1" />
      </span>
      <Sparkles className="size-3.5 text-chart-1" aria-hidden="true" />
      Meet {ASSISTANT_NAME}, your AI assistant
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

/** The tagline with its last word in the accent and a hand-drawn underline that draws itself in. */
export function HeroHeadline() {
  return (
    <h1 className="m-0 max-w-4xl font-heading text-[clamp(40px,7vw,80px)] leading-[1.05] tracking-tight text-balance">
      {TAGLINE.lead}{" "}
      <AccentText delay={0.75}>{TAGLINE.accent}</AccentText>
    </h1>
  );
}
