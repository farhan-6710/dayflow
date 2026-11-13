import { useRef, useState } from "react";
import { useLocation } from "react-router";

import { runAssistantTool } from "@/features/workspace/assistant/utils/assistantTools";
import { requestAssistantTurn } from "@/services/assistantService";
import { useAuth } from "@/shared/hooks/useAuth";
import type { AssistantContent, AssistantMessage, AssistantPart } from "@/shared/types/assistant";

/** Tool round trips allowed for one question before giving up. */
const MAX_STEPS = 6;
/** Older turns are dropped so a long chat stays inside the function's limit. */
const MAX_HISTORY = 30;

function answerText(content: AssistantContent): string {
  return content.parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
}

/** Keeps the history starting at a plain user question, never mid tool exchange. */
function trimHistory(history: AssistantContent[]): AssistantContent[] {
  if (history.length <= MAX_HISTORY) return history;
  const start = history.findIndex(
    (content, index) => index >= history.length - MAX_HISTORY && content.role === "user" && content.parts.some((part) => part.text),
  );
  return start > 0 ? history.slice(start) : history;
}

/** Chat state and the tool loop: ask the function, run any tool calls here, repeat until it answers. */
export function useAssistant() {
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useRef<AssistantContent[]>([]);
  const displayName = profile?.display_name ?? "";

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isThinking || !user) return;
    setError(null);
    setIsThinking(true);
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: trimmed }]);

    const context = { userName: displayName, today: new Date().toDateString(), currentPath: pathname };
    let contents = trimHistory([...history.current, { role: "user", parts: [{ text: trimmed }] }]);

    try {
      for (let step = 0; step < MAX_STEPS; step += 1) {
        const reply = await requestAssistantTurn(contents, context);
        contents = [...contents, reply];
        const calls = reply.parts.filter((part) => part.functionCall);
        if (!calls.length) {
          history.current = contents;
          const text = answerText(reply) || "I couldn't find an answer to that. Try asking another way.";
          setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text }]);
          return;
        }
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
      setError(caught instanceof Error ? caught.message : "The assistant is unavailable right now.");
    } finally {
      setIsThinking(false);
    }
  }

  function reset() {
    history.current = [];
    setMessages([]);
    setError(null);
  }

  return { messages, isThinking, error, ask, reset, displayName };
}
