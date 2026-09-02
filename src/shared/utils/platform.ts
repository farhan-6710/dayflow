import { isTauri } from "@tauri-apps/api/core";

/** True when running inside the Tauri desktop shell (not the browser). */
export function isDesktopApp(): boolean {
  return isTauri();
}
