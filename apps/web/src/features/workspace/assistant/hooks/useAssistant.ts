import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { loadChat, saveChat } from "@/features/workspace/assistant/utils/assistantSession";
import { runAssistantTool } from "@/features/workspace/assistant/utils/assistantTools";
import { streamAssistantTurn } from "@/services/assistantService";
import { useAuth } from "@/shared/hooks/useAuth";
import type { AssistantContent, AssistantMessage, AssistantPart } from "@/shared/types/assistant";

/** Tool round trips allowed for one question before giving up. */
const MAX_STEPS = 6;
/** Older turns are dropped so a long chat stays inside the function's limit. */
const MAX_HISTORY = 30;

/** Keeps the history starting at a plain user question, never mid tool exchange. */
function trimHistory(history: AssistantContent[]): AssistantContent[] {
  if (history.length <= MAX_HISTORY) return history;
  const start = history.findIndex(
    (content, index) => index >= history.length - MAX_HISTORY && content.role === "user" && content.parts.some((part) => part.text),
  );
  return start > 0 ? history.slice(start) : history;
}

/** idle: waiting for a question. thinking: waiting on the model or a tool. streaming: text is arriving. */
export type AssistantStatus = "idle" | "thinking" | "streaming";

const NO_ANSWER = "I couldn't find an answer to that. Try asking another way.";

/**
 * Chat state and the tool loop: stream a turn from the function, show its text as it arrives, run
 * any tool calls here, repeat until the model answers. One question gets one assistant bubble.
 */
export function useAssistant() {
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useRef<AssistantContent[]>([]);
  const displayName = profile?.display_name ?? "";
  const userId = user?.id ?? null;
  const restoredFor = useRef<string | null>(null);

  // Restore this tab's chat after a refresh, once per signed-in user.
  useEffect(() => {
    if (!userId || restoredFor.current === userId) return;
    restoredFor.current = userId;
    const saved = loadChat(userId);
    history.current = saved.history;
    setMessages(saved.messages);
  }, [userId]);

  // Save once a turn has finished, never mid-stream.
  useEffect(() => {
    if (!userId || status !== "idle" || restoredFor.current !== userId) return;
    saveChat(userId, { messages, history: history.current });
  }, [userId, messages, status]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || status !== "idle" || !user) return;
    setError(null);
    setStatus("thinking");
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: trimmed }]);

    const context = { userName: displayName, today: new Date().toDateString(), currentPath: pathname };
    let contents = trimHistory([...history.current, { role: "user", parts: [{ text: trimmed }] }]);
    const replyId = crypto.randomUUID();
    let shown = "";
    let paragraphBreak = false;

    function showText(piece: string) {
      const isFirst = !shown;
      shown = `${shown}${paragraphBreak && shown ? "\n\n" : ""}${piece}`;
      paragraphBreak = false;
      const text = shown;
      setMessages((current) =>
        isFirst
          ? [...current, { id: replyId, role: "assistant", text }]
          : current.map((message) => (message.id === replyId ? { ...message, text } : message)),
      );
      setStreamingId(replyId);
      setStatus("streaming");
    }

    try {
      for (let step = 0; step < MAX_STEPS; step += 1) {
        const reply = await streamAssistantTurn(contents, context, showText);
        contents = [...contents, reply];
        const calls = reply.parts.filter((part) => part.functionCall);
        if (!calls.length) {
          history.current = contents;
          if (!shown) showText(NO_ANSWER);
          return;
        }
        paragraphBreak = true;
        setStatus("thinking");
        const responses: AssistantPart[] = await Promise.all(
          calls.map(async ({ functionCall }) => ({
            functionResponse: {
              id: functionCall?.id,
              name: functionCall?.name ?? "",
              response: await runAssistantTool(user.id, functionCall?.name ?? "", functionCall?.args),
            },
          })),
        );
        contents = [...contents, { role: "user", parts: responses }];
      }
      setError("That took too many steps. Try a more specific question.");
    } catch (caught) {
      setError((caught instanceof Error && caught.message) || "The assistant is unavailable right now.");
    } finally {
      setStatus("idle");
      setStreamingId(null);
    }
  }

  function reset() {
    history.current = [];
    setMessages([]);
    setError(null);
  }

  return { messages, status, streamingId, error, ask, reset, displayName };
}
