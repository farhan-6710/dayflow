/** Shared OAuth popup callback — same origin for admin and client portals. */
export const OAUTH_CALLBACK_PATH = "/auth/oauth-callback";

/** Browser bridge: Supabase redirects here; page forwards to the desktop deep link. */
export const DESKTOP_OAUTH_BRIDGE_PATH = "/auth/desktop-oauth-bridge";

export const OAUTH_CALLBACK_MESSAGE_TYPE = "dayflow-oauth-callback";

/** Custom URL scheme registered in Tauri (`dayflow://auth/callback`). */
export const DESKTOP_OAUTH_CALLBACK_SCHEME = "dayflow://auth/callback";
