import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Client } from "@/features/admin/clients-management/types/types";

export type CreateClientInput = {
  companyName: string;
  clientName?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  secondaryContactName?: string | null;
  secondaryContactNumber?: string | null;
  websiteUrl?: string | null;
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
    company_name: input.companyName,
    client_name: input.clientName?.trim() || null,
    mobile_number: input.mobileNumber?.trim() || null,
    email: input.email?.trim().toLowerCase() || null,
    secondary_contact_name: input.secondaryContactName?.trim() || null,
    secondary_contact_number: input.secondaryContactNumber?.trim() || null,
    website_url: input.websiteUrl?.trim() || null,
  };
}

export async function fetchClientById(clientId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("id", clientId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Client | null) ?? null;
}

export async function fetchClients(adminId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("admin_id", adminId)
    .order("company_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Client[];
}

export async function createClient(
  adminId: string,
  input: CreateClientInput,
): Promise<Client> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .insert({
      admin_id: adminId,
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
