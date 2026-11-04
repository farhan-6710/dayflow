import { supabase } from "@/services/supabaseClient";
import type { Client } from "@/shared/types/types";

const LINK_RPC = "link_client_portal_user";
const LINK_RETRY_DELAYS_MS = [0, 400, 1200];

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Finds or links the signed-in user's client profile by matching their login
 * email to `clients.email`. Retries briefly so new sessions can finish establishing.
 */
export async function resolveClientPortalProfile(): Promise<Client | null> {
  for (const delayMs of LINK_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await wait(delayMs);
    }

    const { data, error } = await supabase.rpc(LINK_RPC);
    if (error) {
      throw error;
    }
    if (data) {
      return data as Client;
    }
  }

  return null;
}
