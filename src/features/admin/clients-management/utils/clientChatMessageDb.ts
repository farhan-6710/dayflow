import type { ClientChatMessage } from "@/features/admin/clients-management/types/types";

export type ClientChatMessageRow = ClientChatMessage;

function pickRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapClientChatMessageRow(row: ClientChatMessageRow): ClientChatMessage {
  const { author_user, author_client, ...message } = row;

  return {
    ...message,
    author_user: pickRelation(author_user),
    author_client: pickRelation(author_client),
  };
}

export function isWorkspaceAuthoredChatMessage(
  message: ClientChatMessage,
  userId: string,
): boolean {
  return message.author_user_id === userId;
}

export function getClientChatMessageAuthorLabel(
  message: ClientChatMessage,
  fallbackClientLabel: string,
): string {
  if (message.author_user_id) {
    const userName = pickRelation(message.author_user)?.display_name?.trim();
    return userName || "Workspace";
  }

  const clientAuthor = pickRelation(message.author_client);
  return (
    clientAuthor?.client_name?.trim() ||
    clientAuthor?.company_name?.trim() ||
    fallbackClientLabel
  );
}
