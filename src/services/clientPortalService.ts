import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Client } from "@/features/admin/clients-management/types/types";

const LINK_RPC = "link_client_portal_user";
const LINK_RETRY_DELAYS_MS = [0, 400, 1200];

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchClientForAuthUser(
  userId: string,
): Promise<Client | null> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("auth_user_id", userId)
    .eq("is_active", true)
    .not("email", "is", null)
    .maybeSingle();

  if (error) throw error;
  return (data as Client | null) ?? null;
}

async function callLinkClientPortalUser(): Promise<Client | null> {
  const { data, error } = await supabase.rpc(LINK_RPC);

  if (error) {
    if (error.code === "PGRST202") {
      throw new Error(
        "Client portal linking is not set up yet. Run migration 022 (or 023) in Supabase.",
      );
    }
    throw error;
  }

  return (data as Client | null) ?? null;
}

/**
 * Finds or links the signed-in user's client profile by matching auth.users.email
 * to clients.email. Retries briefly so magic-link sessions can finish establishing.
 */
export async function resolveClientPortalProfile(): Promise<Client | null> {
  for (const delayMs of LINK_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await wait(delayMs);
    }

    const linked = await callLinkClientPortalUser();
    if (linked) {
      return linked;
    }
  }

  return null;
}

/** @deprecated Prefer resolveClientPortalProfile. */
export async function linkClientPortalUser(
  userId: string,
  email: string,
): Promise<Client | null> {
  void userId;
  void email;
  return resolveClientPortalProfile();
}
