import {
  mapClientChatMessageRow,
  type ClientChatMessageRow,
} from "@/features/admin/clients-management/utils/clientChatMessageDb";
import type { ClientChatMessage } from "@/features/admin/clients-management/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

/** Admin portal — message from the signed-in admin. */
export async function createAdminClientChatMessage(input: {
  clientId: string;
  adminId: string;
  body: string;
}): Promise<ClientChatMessage> {
  return insertClientChatMessage({
    clientId: input.clientId,
    authorAdminId: input.adminId,
    authorClientId: null,
    body: input.body,
  });
}

/** Client portal — message from the client (future). */
export async function createClientAuthoredChatMessage(input: {
  clientId: string;
  body: string;
}): Promise<ClientChatMessage> {
  return insertClientChatMessage({
    clientId: input.clientId,
    authorAdminId: null,
    authorClientId: input.clientId,
    body: input.body,
  });
}

export async function fetchClientChatMessages(
  clientId: string,
): Promise<ClientChatMessage[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapClientChatMessageRow(row as unknown as ClientChatMessageRow),
  );
}

async function insertClientChatMessage(input: {
  clientId: string;
  authorAdminId: string | null;
  authorClientId: string | null;
  body: string;
}): Promise<ClientChatMessage> {
  const body = input.body.trim();
  if (!body) {
    throw new Error("Message cannot be empty.");
  }

  if (Boolean(input.authorAdminId) === Boolean(input.authorClientId)) {
    throw new Error("Message needs exactly one author (admin or client).");
  }

  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .insert({
      client_id: input.clientId,
      author_admin_id: input.authorAdminId,
      author_client_id: input.authorClientId,
      body,
    })
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapClientChatMessageRow(data as unknown as ClientChatMessageRow);
}

export async function updateAdminClientChatMessage(
  messageId: string,
  body: string,
): Promise<ClientChatMessage> {
  const nextBody = body.trim();
  if (!nextBody) {
    throw new Error("Message cannot be empty.");
  }

  const { data, error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .update({ body: nextBody })
    .eq("id", messageId)
    .not("author_admin_id", "is", null)
    .select(DB.CLIENT_CONVERSATION_MESSAGES.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapClientChatMessageRow(data as unknown as ClientChatMessageRow);
}

export async function deleteAdminClientChatMessage(
  messageId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.CLIENT_CONVERSATION_MESSAGES.TABLE)
    .delete()
    .eq("id", messageId)
    .not("author_admin_id", "is", null);

  if (error) {
    throw error;
  }
}
