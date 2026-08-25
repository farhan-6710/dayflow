import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Client } from "@/features/clients-management/types/types";

export type CreateClientInput = {
  clientName: string;
  email?: string | null;
  primaryContactName?: string | null;
  mobileNumber?: string | null;
  secondaryContactName?: string | null;
  secondaryMobileNumber?: string | null;
  websiteName?: string | null;
};

export type UpdateClientInput = CreateClientInput & {
  isActive?: boolean;
};

function saveError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A client with this email already exists.");
  }
  return new Error(error.message ?? "Failed to save client.");
}

function toClientColumns(input: CreateClientInput) {
  return {
    client_name: input.clientName,
    email: input.email?.trim().toLowerCase() || null,
    primary_contact_name: input.primaryContactName?.trim() || null,
    mobile_number: input.mobileNumber?.trim() || null,
    secondary_contact_name: input.secondaryContactName?.trim() || null,
    secondary_mobile_number: input.secondaryMobileNumber?.trim() || null,
    website_name: input.websiteName?.trim() || null,
  };
}

export async function fetchClients(userId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("user_id", userId)
    .order("client_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Client[];
}

export async function createClient(
  userId: string,
  input: CreateClientInput,
): Promise<Client> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .insert({
      user_id: userId,
      ...toClientColumns(input),
      is_active: true,
    })
    .select(DB.CLIENTS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  return data as Client;
}

export async function updateClient(
  clientId: string,
  input: UpdateClientInput,
): Promise<Client> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .update({
      ...toClientColumns(input),
      ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
    })
    .eq("id", clientId)
    .select(DB.CLIENTS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  return data as Client;
}

export async function deleteClient(clientId: string): Promise<void> {
  const { error } = await supabase.from(DB.CLIENTS.TABLE).delete().eq("id", clientId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete client.");
  }
}
