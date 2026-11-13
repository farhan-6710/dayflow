import { Sparkle } from "lucide-react";

import { ASSISTANT_SUGGESTIONS } from "@/features/workspace/assistant/constants/assistantSuggestions";
import type { AssistantWelcomeProps } from "@/features/workspace/assistant/types/components";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";

/** Empty state: who the assistant is, and four questions it answers well. */
export function AssistantWelcome({ name, onAsk }: AssistantWelcomeProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 text-center">
        <div className="relative">
          <span className="grid size-20 place-items-center rounded-3xl border border-border bg-card shadow-md">
            <DayFlowLogo className="size-12" />
          </span>
          <Sparkle aria-hidden="true" className="absolute -top-2 -right-3 size-4 fill-chart-1 text-chart-1" />
          <Sparkle aria-hidden="true" className="absolute top-3 -right-5 size-2.5 fill-chart-1/70 text-chart-1/70" />
        </div>
        <h2 className="mt-6 text-3xl leading-tight">
          Hello, <span className="text-chart-1">{name || "there"}!</span>
        </h2>
        <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-muted-foreground">
          I'm your DayFlow AI assistant. Ask me anything about your workspace, tasks, projects or how to get started!
        </p>
      </div>


      <ul className="mt-8 space-y-2.5 px-5 pb-4" aria-label="Suggested questions">
        {ASSISTANT_SUGGESTIONS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onAsk(label)}
              className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-border bg-card/80 py-1.5 pr-4 pl-1.5 text-sm shadow-xs transition-colors hover:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="grid size-7 place-items-center rounded-full bg-sidebar-accent text-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
