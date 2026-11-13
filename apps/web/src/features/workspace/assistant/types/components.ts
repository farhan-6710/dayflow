import type { AssistantStatus } from "@/features/workspace/assistant/hooks/useAssistant";
import type { AssistantMessage } from "@/shared/types/assistant";

export type AssistantWelcomeProps = {
  name: string;
  onAsk: (question: string) => void;
};

export type AssistantMessagesProps = {
  messages: AssistantMessage[];
  status: AssistantStatus;
  streamingId: string | null;
  error: string | null;
  onNavigate: () => void;
};

export type AssistantReplyProps = {
  message: AssistantMessage;
  /** True while this reply is the one streaming in. */
  live: boolean;
  onNavigate: () => void;
};

export type AssistantComposerProps = {
  disabled: boolean;
  onSend: (question: string) => void;
};

export type AssistantRichTextProps = {
  text: string;
  onNavigate: () => void;
  /** True while the answer is still arriving: shows a blinking caret after the last word. */
  streaming?: boolean;
};

export type AssistantMarkProps = {
  className?: string;
  /** Spins the outer ring while the assistant is working. */
  active?: boolean;
};
