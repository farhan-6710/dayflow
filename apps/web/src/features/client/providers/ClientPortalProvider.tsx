import { useMemo, type ReactNode } from "react";

import { ClientPortalContext } from "@/features/client/providers/clientPortalContext";
import type { Client } from "@/shared/types/types";

export function ClientPortalProvider({
  client,
  children,
}: {
  client: Client;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ client }), [client]);
  return <ClientPortalContext.Provider value={value}>{children}</ClientPortalContext.Provider>;
}
