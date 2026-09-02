import { createContext, useContext, type ReactNode } from "react";

import type { Client } from "@/features/workspace/clients-management/types/types";

type ClientPortalContextValue = {
  client: Client;
};

const ClientPortalContext = createContext<ClientPortalContextValue | null>(null);

export function ClientPortalProvider({
  client,
  children,
}: {
  client: Client;
  children: ReactNode;
}) {
  return (
    <ClientPortalContext.Provider value={{ client }}>
      {children}
    </ClientPortalContext.Provider>
  );
}

export function useClientPortal() {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error("useClientPortal must be used within ClientPortalProvider");
  }
  return context;
}
