import type { ClientChatMessage } from "@/features/workspace/clients-management/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

function pickRelation<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function mapMessage(row: ClientChatMessage): ClientChatMessage {
  return { ...row, author_user: pickRelation(row.author_user), author_client: pickRelation(row.author_client) };
}

export async function fetchClientChatMessages(clientId: string): Promise<ClientChatMessage[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as unknown as ClientChatMessage[]).map(mapMessage);
}

/** A message from the signed-in workspace user. */
export async function createWorkspaceClientChatMessage(
  clientId: string,
  userId: string,
  body: string,
): Promise<ClientChatMessage> {
  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .insert({ client_id: clientId, author_user_id: userId, author_client_id: null, body: body.trim() })
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapMessage(data as unknown as ClientChatMessage);
}

export async function updateWorkspaceClientChatMessage(messageId: string, body: string): Promise<ClientChatMessage> {
  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .update({ body: body.trim() })
    .eq("id", messageId)
    .not("author_user_id", "is", null)
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapMessage(data as unknown as ClientChatMessage);
}

export async function deleteWorkspaceClientChatMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .delete()
    .eq("id", messageId)
    .not("author_user_id", "is", null);

  if (error) throw error;
}
