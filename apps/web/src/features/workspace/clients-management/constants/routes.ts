import { WORKSPACE_CLIENTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";

export const CLIENTS_MANAGEMENT_PATH = WORKSPACE_CLIENTS_MANAGEMENT_PATH;

export function buildClientDetailPath(clientId: string): string {
  return `${CLIENTS_MANAGEMENT_PATH}/${clientId}`;
}
