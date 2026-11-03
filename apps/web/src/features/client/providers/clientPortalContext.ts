import { createContext } from "react";

import type { Client } from "@/shared/types/types";

export const ClientPortalContext = createContext<{ client: Client } | null>(null);
