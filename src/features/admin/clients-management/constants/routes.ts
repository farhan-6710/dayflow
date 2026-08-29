import { ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH } from "@/app/constants/adminPortalRoutes";

export const CLIENTS_MANAGEMENT_PATH = ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH;

export function buildClientDetailPath(clientId: string): string {
  return `${CLIENTS_MANAGEMENT_PATH}/${clientId}`;
}
