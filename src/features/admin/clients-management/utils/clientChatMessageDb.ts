import type { ClientChatMessage } from "@/features/admin/clients-management/types/types";

export type ClientChatMessageRow = ClientChatMessage;

function pickRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapClientChatMessageRow(row: ClientChatMessageRow): ClientChatMessage {
  const { author_admin, author_client, ...message } = row;

  return {
    ...message,
    author_admin: pickRelation(author_admin),
    author_client: pickRelation(author_client),
  };
}

export function isAdminAuthoredChatMessage(
  message: ClientChatMessage,
  adminId: string,
): boolean {
  return message.author_admin_id === adminId;
}

export function getClientChatMessageAuthorLabel(
  message: ClientChatMessage,
  fallbackClientLabel: string,
): string {
  if (message.author_admin_id) {
    const adminName = pickRelation(message.author_admin)?.display_name?.trim();
    return adminName || "Admin";
  }

  const clientAuthor = pickRelation(message.author_client);
  return (
    clientAuthor?.client_name?.trim() ||
    clientAuthor?.company_name?.trim() ||
    fallbackClientLabel
  );
}
