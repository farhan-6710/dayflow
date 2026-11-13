import type { AssistantMessage } from "@/shared/types/assistant";

export type AssistantWelcomeProps = {
  name: string;
  onAsk: (question: string) => void;
};

export type AssistantMessagesProps = {
  messages: AssistantMessage[];
  isThinking: boolean;
  error: string | null;
  onNavigate: () => void;
};

export type AssistantComposerProps = {
  disabled: boolean;
  onSend: (question: string) => void;
};

export type AssistantRichTextProps = {
  text: string;
  onNavigate: () => void;
};
