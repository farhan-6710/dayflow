export const CLIENTS_MANAGEMENT_PATH = "/clients-management";

export function buildClientDetailPath(clientId: string): string {
  return `${CLIENTS_MANAGEMENT_PATH}/${clientId}`;
}
