import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

import { AssistantComposer } from "@/features/workspace/assistant/components/AssistantComposer";
import { AssistantMark } from "@/features/workspace/assistant/components/AssistantMark";
import { AssistantMessages } from "@/features/workspace/assistant/components/AssistantMessages";
import { AssistantWelcome } from "@/features/workspace/assistant/components/AssistantWelcome";
import { ASSISTANT_NAME, ASSISTANT_SHORTCUT_KEY } from "@/features/workspace/assistant/constants/assistantSuggestions";
import { useAssistant, type AssistantStatus } from "@/features/workspace/assistant/hooks/useAssistant";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";

const STATUS_LABEL: Record<AssistantStatus, string> = { idle: "Online", thinking: "Thinking…", streaming: "Typing…" };

/** Live status under the name: a pulsing dot, and what the assistant is doing right now. */
function AssistantStatusLine({ status }: { status: AssistantStatus }) {
  return (
    <SheetDescription className="mt-0.5 flex items-center gap-2 text-xs">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span aria-live="polite">{STATUS_LABEL[status]}</span>
    </SheetDescription>
  );
}

/** Floating round button plus the assistant sheet. The chat survives closing the sheet until "New chat". */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const assistant = useAssistant();
  const hasChat = assistant.messages.length > 0;
  const isBusy = assistant.status !== "idle";

  // ⌘J / Ctrl+J toggles the assistant from anywhere in the workspace.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === ASSISTANT_SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Floating round trigger, bottom-right on every workspace page */}
      <Button
        size="icon-lg"
        aria-label={`Open ${ASSISTANT_NAME} (⌘J)`}
        title={`${ASSISTANT_NAME} (⌘J)`}
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-lg transition-transform hover:scale-105 sm:right-7 sm:bottom-7"
      >
        <AssistantMark className="size-7" />
      </Button>

      <SheetContent className="assistant-panel w-full gap-0 overflow-hidden p-0 sm:inset-y-3 sm:right-3 sm:h-auto sm:max-w-md sm:rounded-2xl sm:border sm:shadow-xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4 pr-14">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-chart-1 shadow-xs">
            <AssistantMark className="size-6" active={isBusy} />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg leading-tight">{ASSISTANT_NAME}</SheetTitle>
            <AssistantStatusLine status={assistant.status} />
          </div>
          {hasChat ? (
            <Button variant="ghost" size="icon" onClick={assistant.reset} aria-label="Start a new chat" className="text-muted-foreground">
              <RotateCcw aria-hidden="true" />
            </Button>
          ) : null}
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {hasChat ? (
            <AssistantMessages
              messages={assistant.messages}
              status={assistant.status}
              streamingId={assistant.streamingId}
              error={assistant.error}
              onNavigate={() => setOpen(false)}
            />
          ) : (
            <AssistantWelcome name={assistant.displayName} onAsk={(question) => void assistant.ask(question)} />
          )}
        </div>

        <AssistantComposer disabled={isBusy} onSend={(question) => void assistant.ask(question)} />
      </SheetContent>
    </Sheet>
  );
}
