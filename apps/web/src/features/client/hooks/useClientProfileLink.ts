import { useEffect, useState } from "react";

import { resolveClientPortalProfile } from "@/services/clientPortalService";
import type { Client } from "@/shared/types/types";

type LinkResult = {
  userId: string;
  client: Client | null;
  error: string | null;
};

/** Links the signed-in user to their client record. `checking` holds until a result exists for this user. */
export function useClientProfileLink(userId: string | null, enabled: boolean) {
  const [result, setResult] = useState<LinkResult | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    let active = true;
    void resolveClientPortalProfile()
      .then((client) => {
        if (active) {
          setResult({ userId, client, error: null });
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to resolve client portal profile:", error);
        if (active) {
          setResult({
            userId,
            client: null,
            error: error instanceof Error ? error.message : "Failed to link client profile.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, userId]);

  const current = result?.userId === userId ? result : null;

  return {
    client: current?.client ?? null,
    linkError: current?.error ?? null,
    checking: Boolean(userId) && !current,
  };
}
