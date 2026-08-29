import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Client } from "@/features/clients-management/types/types";
import { fetchClients } from "@/services/clientsService";
import { showToast } from "@/shared/utils/showToast";

function loadClientsErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Failed to load clients.";
}

export function useClientsQuery() {
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setClients(await fetchClients(user.id));
    } catch (e) {
      console.error(e);
      const message = loadClientsErrorMessage(e);
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    clients,
    isLoading: authLoading || isLoading,
    error,
    setError,
    reload,
  };
}
