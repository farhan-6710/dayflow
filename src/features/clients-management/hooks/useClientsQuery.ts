import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Client } from "@/features/clients-management/types/types";
import { fetchClients } from "@/services/clientsService";
import { showToast } from "@/shared/utils/showToast";

export function useClientsQuery() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      setClients(await fetchClients(user.id));
    } catch (e) {
      console.error(e);
      setError("Failed to load clients.");
      showToast("error", "Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { clients, isLoading, error, setError, reload };
}
