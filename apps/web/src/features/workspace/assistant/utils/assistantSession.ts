import type { AssistantContent, AssistantMessage } from "@/shared/types/assistant";

/** One key per signed-in user, so another account in the same tab never sees this chat. */
const KEY_PREFIX = "dayflow.assistant-chat:";

export type SavedChat = { messages: AssistantMessage[]; history: AssistantContent[] };

const EMPTY_CHAT: SavedChat = { messages: [], history: [] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMessage(value: unknown): value is AssistantMessage {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.text === "string"
  );
}

function isContent(value: unknown): value is AssistantContent {
  return isRecord(value) && (value.role === "user" || value.role === "model") && Array.isArray(value.parts);
}

/** The chat saved in this tab, or an empty one when there is none or it is unreadable. */
export function loadChat(userId: string): SavedChat {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + userId);
    if (!raw) return EMPTY_CHAT;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.messages) || !Array.isArray(parsed.history)) return EMPTY_CHAT;
    if (!parsed.messages.every(isMessage) || !parsed.history.every(isContent)) return EMPTY_CHAT;
    return { messages: parsed.messages, history: parsed.history };
  } catch {
    // Storage blocked (private mode) or corrupt JSON: start a fresh chat.
    return EMPTY_CHAT;
  }
}

/** Saves the chat for this tab's session; an empty chat removes the entry. */
export function saveChat(userId: string, chat: SavedChat) {
  try {
    if (chat.messages.length === 0) {
      sessionStorage.removeItem(KEY_PREFIX + userId);
    } else {
      sessionStorage.setItem(KEY_PREFIX + userId, JSON.stringify(chat));
    }
  } catch {
    // Storage blocked or full: the chat still works, it just won't survive a refresh.
  }
}
