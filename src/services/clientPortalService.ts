import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Client } from "@/features/admin/clients-management/types/types";

export async function fetchClientForAuthUser(
  userId: string,
): Promise<Client | null> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("auth_user_id", userId)
    .eq("portal_enabled", true)
    .maybeSingle();

  if (error) throw error;
  return (data as Client | null) ?? null;
}

/** Links the signed-in user to a client row on first client-portal login. */
export async function linkClientPortalUser(
  userId: string,
  email: string,
): Promise<Client | null> {
  const existing = await fetchClientForAuthUser(userId);
  if (existing) return existing;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const { data: candidates, error: findError } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("portal_enabled", true)
    .is("auth_user_id", null)
    .ilike("email", normalizedEmail)
    .limit(1);

  if (findError) throw findError;

  const match = (candidates as Client[] | null)?.[0];
  if (!match) return null;

  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .update({ auth_user_id: userId })
    .eq("id", match.id)
    .is("auth_user_id", null)
    .select(DB.CLIENTS.SELECT)
    .single();

  if (error) throw error;
  return data as Client;
}
