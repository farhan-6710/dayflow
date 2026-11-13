import { useEffect, useRef } from "react";

import { AssistantMark } from "@/features/workspace/assistant/components/AssistantMark";
import { AssistantRichText } from "@/features/workspace/assistant/components/AssistantRichText";
import { ASSISTANT_NAME } from "@/features/workspace/assistant/constants/assistantSuggestions";
import { useTypewriter } from "@/features/workspace/assistant/hooks/useTypewriter";
import type { AssistantMessagesProps, AssistantReplyProps } from "@/features/workspace/assistant/types/components";

/** How close to the bottom (px) the list must be for typing to keep scrolling it. */
const FOLLOW_DISTANCE_PX = 160;
const BUBBLE = "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs";

function AssistantAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-chart-1 shadow-xs">
      <AssistantMark className="size-4.5" />
    </span>
  );
}

function TypingBubble() {
  return (
    <div className="flex animate-message-in items-end gap-2" role="status" aria-label={`${ASSISTANT_NAME} is thinking`}>
      <AssistantAvatar />
      <span className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 shadow-xs">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-1.5 animate-bounce rounded-full bg-chart-1/60" style={{ animationDelay: `${dot * 140}ms` }} />
        ))}
      </span>
    </div>
  );
}

/** One answer bubble. A reply that starts streaming while on screen types itself out. */
function AssistantReply({ message, live, onNavigate }: AssistantReplyProps) {
  const { text, isTyping } = useTypewriter(message.text, live);
  return (
    <div className="flex animate-message-in items-end gap-2">
      <AssistantAvatar />
      <div className={`${BUBBLE} min-w-0 rounded-bl-md border border-border bg-card`}>
        <AssistantRichText text={text} onNavigate={onNavigate} streaming={live || isTyping} />
      </div>
    </div>
  );
}

/** The conversation as chat bubbles: the user's on the right, Flowy's on the left, filling in live. */
export function AssistantMessages({ messages, status, streamingId, error, onNavigate }: AssistantMessagesProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // A new bubble scrolls smoothly into view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, status, error]);

  // While text types out, keep the newest line in view unless the user has scrolled up to read.
  useEffect(() => {
    const list = listRef.current;
    const scroller = list?.parentElement;
    if (!list || !scroller) return;
    const observer = new ResizeObserver(() => {
      const distanceFromEnd = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (distanceFromEnd < FOLLOW_DISTANCE_PX) endRef.current?.scrollIntoView({ block: "end" });
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={listRef} className="flex-1 space-y-4 px-4 py-5">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex animate-message-in justify-end">
            <p className={`${BUBBLE} rounded-br-md bg-primary whitespace-pre-wrap text-primary-foreground`}>{message.text}</p>
          </div>
        ) : (
          <AssistantReply key={message.id} message={message} live={message.id === streamingId} onNavigate={onNavigate} />
        ),
      )}
      {status === "thinking" ? <TypingBubble /> : null}
      {error ? (
        <p role="alert" className="animate-message-in rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
