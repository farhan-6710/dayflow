import { AssistantMark } from "@/features/workspace/assistant/components/AssistantMark";
import { ASSISTANT_NAME, ASSISTANT_SUGGESTIONS } from "@/features/workspace/assistant/constants/assistantSuggestions";
import type { AssistantWelcomeProps } from "@/features/workspace/assistant/types/components";

/** Empty state: who the assistant is, and four questions it answers well. */
export function AssistantWelcome({ name, onAsk }: AssistantWelcomeProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 text-center">
        <span className="grid size-20 animate-message-in place-items-center rounded-3xl border border-border bg-card text-chart-1 shadow-md">
          <AssistantMark className="size-11" active />
        </span>
        <h2 className="mt-6 text-3xl leading-tight">
          Hello, <span className="text-chart-1">{name || "there"}!</span>
        </h2>
        <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-muted-foreground">
          I'm {ASSISTANT_NAME}, your DayFlow assistant. Ask me anything about your workspace, tasks, projects or how to get started!
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
