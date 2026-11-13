import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import { AssistantRichText } from "@/features/workspace/assistant/components/AssistantRichText";
import type { AssistantMessagesProps } from "@/features/workspace/assistant/types/components";

function AssistantAvatar() {
  return (
    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-sidebar-accent text-chart-1">
      <Sparkles className="size-3.5" aria-hidden="true" />
    </span>
  );
}

export function AssistantMessages({ messages, isThinking, error, onNavigate }: AssistantMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking, error]);

  return (
    <div className="flex-1 space-y-4 px-5 py-5" aria-live="polite">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-sidebar-accent px-3.5 py-2 text-sm whitespace-pre-wrap">{message.text}</p>
          </div>
        ) : (
          <div key={message.id} className="flex gap-2.5">
            <AssistantAvatar />
            <div className="min-w-0 flex-1 pt-1 text-sm leading-relaxed">
              <AssistantRichText text={message.text} onNavigate={onNavigate} />
            </div>
          </div>
        ),
      )}
      {isThinking ? (
        <div className="flex gap-2.5" role="status" aria-label="Assistant is thinking">
          <AssistantAvatar />
          <span className="flex items-center gap-1 pt-2.5">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${dot * 120}ms` }} />
            ))}
          </span>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
